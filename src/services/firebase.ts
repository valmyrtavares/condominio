import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

// Configuração fornecida pelo usuário
export const firebaseConfig = {
  apiKey: "AIzaSyCByX7gMMBSi4ipBtRgzM0eiq1Nkk1ie9A",
  authDomain: "condominio-digital-app.firebaseapp.com",
  projectId: "condominio-digital-app",
  storageBucket: "condominio-digital-app.firebasestorage.app",
  messagingSenderId: "674196915818",
  appId: "1:674196915818:web:a3b8dee14b0fca5aa4ac13"
};

// Inicialização segura do Firebase (evita inicializações duplicadas)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// =========================================================================
// SERVIÇO DE SINCRONIZAÇÃO E PERSISTÊNCIA EM TEMPO REAL NO FIRESTORE
// =========================================================================

/**
 * Escuta a coleção 'condominios' em tempo real na nuvem do Firestore
 */
export const ouvirCondominiosFirestore = (callback: (condos: any[]) => void) => {
  try {
    const colRef = collection(db, 'condominios');
    return onSnapshot(colRef, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      callback(lista);
    }, (error) => {
      console.warn('Aviso: Firestore em modo offline ou aguardando permissão:', error);
    });
  } catch (err) {
    console.warn('Erro ao configurar listener do Firestore:', err);
    return () => {};
  }
};

/**
 * Salva ou atualiza os metadados de um condomínio na coleção raiz 'condominios'
 */
export const salvarCondominioNoFirestore = async (condo: any) => {
  try {
    const condoRef = doc(db, 'condominios', condo.id);
    await setDoc(condoRef, {
      ...condo,
      atualizadoEm: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao salvar condomínio no Firestore:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exclui um condomínio da coleção raiz 'condominios'
 */
export const excluirCondominioNoFirestore = async (condoId: string) => {
  try {
    const condoRef = doc(db, 'condominios', condoId);
    await deleteDoc(condoRef);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir condomínio no Firestore:', error);
    return { success: false, error: error.message };
  }
};


// =========================================================================
// SERVIÇOS DE AUTENTICAÇÃO COM FIREBASE AUTH
// =========================================================================

/**
 * Realiza login com E-mail e Senha no Firebase Authentication
 */
export const loginFirebaseEmailSenha = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let msg = 'Erro ao realizar login.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      msg = 'E-mail ou senha incorretos.';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'Formato de e-mail inválido.';
    } else if (error.code === 'auth/too-many-requests') {
      msg = 'Muitas tentativas sem sucesso. Aguarde alguns instantes.';
    } else if (error.message) {
      msg = error.message;
    }
    return { success: false, error: msg };
  }
};

/**
 * Cadastra um novo usuário no Firebase Auth
 */
export const criarUsuarioFirebaseAuth = async (email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let msg = 'Erro ao criar conta.';
    if (error.code === 'auth/email-already-in-use') {
      msg = 'Este e-mail já está em uso por outro usuário.';
    } else if (error.code === 'auth/weak-password') {
      msg = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (error.message) {
      msg = error.message;
    }
    return { success: false, error: msg };
  }
};

/**
 * Envia e-mail de redefinição/recuperação de senha oficial do Firebase
 */
export const enviarEmailRecuperacaoSenha = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (error: any) {
    let msg = 'Erro ao enviar e-mail de recuperação.';
    if (error.code === 'auth/user-not-found') {
      msg = 'Nenhum usuário encontrado com este e-mail.';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'Formato de e-mail inválido.';
    } else if (error.message) {
      msg = error.message;
    }
    return { success: false, error: msg };
  }
};

/**
 * Desconecta a sessão atual no Firebase Auth
 */
export const logoutFirebaseAuth = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


// =========================================================================
// SERVIÇO DE SINCRONIZAÇÃO E SEED AUTOMÁTICO PARA O FIRESTORE MULTI-TENANT
// =========================================================================

/**
 * Sincroniza uma subcoleção inteira de um condomínio (ex: unidades, moradores, regras, etc.)

 */
export const sincronizarSubcolecaoTenant = async (
  condoId: string, 
  nomeSubcolecao: string, 
  itens: any[]
) => {
  try {
    const batch = writeBatch(db);
    for (const item of itens) {
      const docId = item.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const docRef = doc(db, 'condominios', condoId, nomeSubcolecao, docId);
      batch.set(docRef, { ...item, condoId }, { merge: true });
    }
    await batch.commit();
    return { success: true, count: itens.length };
  } catch (error: any) {
    console.error(`Erro ao sincronizar ${nomeSubcolecao} no condomínio ${condoId}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Realiza o SEED COMPLETO de demonstração na nuvem Firestore
 */
export const executarSeedCompletoFirestore = async (dadosSeed: {
  condominios: any[];
  unidades: any[];
  moradores: any[];
  funcionarios: any[];
  regras: any[];
  dependencias: any[];
  vagas: any[];
  servicosContratados: any[];
  assembleias: any[];
  eventos: any[];
  reclamacoes: any[];
  reparos: any[];
  itensEnjoei: any[];
  mudancas: any[];
  diario: any[];
  acessos: any[];
  encomendas: any[];
}) => {
  try {
    const resultados: Record<string, any> = {};

    // 1. Salva a lista de condomínios
    for (const condo of dadosSeed.condominios) {
      await salvarCondominioNoFirestore(condo);
    }
    resultados.condominios = dadosSeed.condominios.length;

    // 2. Popula as subcoleções para o condomínio padrão (condo-jardim-paulista)
    const condoPadraoId = 'condo-jardim-paulista';

    await sincronizarSubcolecaoTenant(condoPadraoId, 'unidades', dadosSeed.unidades);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'moradores', dadosSeed.moradores);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'funcionarios', dadosSeed.funcionarios);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'regras', dadosSeed.regras);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'dependencias', dadosSeed.dependencias);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'vagas_garagem', dadosSeed.vagas);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'servicos_contratados', dadosSeed.servicosContratados);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'assembleias', dadosSeed.assembleias);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'eventos', dadosSeed.eventos);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'reclamacoes', dadosSeed.reclamacoes);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'reparos', dadosSeed.reparos);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'enjoei', dadosSeed.itensEnjoei);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'mudancas', dadosSeed.mudancas);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'atividades_diario', dadosSeed.diario);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'autorizacoes_acesso', dadosSeed.acessos);
    await sincronizarSubcolecaoTenant(condoPadraoId, 'encomendas_entregas', dadosSeed.encomendas);

    return { success: true, resultados };
  } catch (error: any) {
    console.error('Erro no seed geral do Firestore:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload de imagem Base64 para o Firebase Storage
 */
export const uploadFotoFirebaseStorage = async (
  caminhoStorage: string, 
  dataUrlBase64: string
): Promise<string | null> => {
  try {
    const storageRef = ref(storage, caminhoStorage);
    // Envia string em formato data_url
    await uploadString(storageRef, dataUrlBase64, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.warn('Fallback: usando imagem original ou local devido a erro no Storage:', error);
    return null;
  }
};
