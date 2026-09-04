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
import { otimizarImagemDataUrl } from '../utils/imageOptimizer';

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
 * Sanitiza objetos para o Firestore (remove propriedades undefined e limpa arrays aninhados)
 */
export const sanitizarParaFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => sanitizarParaFirestore(item));
  }
  const limpo: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      limpo[key] = sanitizarParaFirestore(value);
    }
  }
  return limpo;
};

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
      console.warn('Aviso: Firestore listener:', error);
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
    const limpo = sanitizarParaFirestore(condo);
    const condoRef = doc(db, 'condominios', limpo.id);
    await setDoc(condoRef, {
      ...limpo,
      atualizadoEm: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('🔥 Erro ao salvar condomínio no Firestore:', error);
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
    console.error('🔥 Erro ao excluir condomínio no Firestore:', error);
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
 * Escuta em tempo real documentos de uma subcoleção do condomínio (ex: condominios/condoId/unidades)
 */
export const ouvirSubcolecaoFirestore = (
  condoId: string,
  nomeSubcolecao: string,
  callback: (itens: any[]) => void
) => {
  try {
    if (!condoId) return () => {};
    const colRef = collection(db, 'condominios', condoId, nomeSubcolecao);
    return onSnapshot(colRef, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Ordenação previsível por andar e id
      if (nomeSubcolecao === 'unidades') {
        lista.sort((a, b) => {
          if (a.andar !== undefined && b.andar !== undefined && a.andar !== b.andar) {
            return a.andar - b.andar;
          }
          return (a.id || '').localeCompare(b.id || '', undefined, { numeric: true });
        });
      }

      callback(lista);
    }, (error) => {
      console.warn(`Aviso: Firestore subcoleção ${nomeSubcolecao} listener:`, error);
    });
  } catch (err) {
    console.warn(`Erro ao configurar listener do Firestore para ${nomeSubcolecao}:`, err);
    return () => {};
  }
};

/**
 * Higieniza estritamente um objeto de morador para o Firestore (garante ausência de arrays aninhados ou Base64)
 */
export const higienizarMoradorParaFirestore = (m: any) => {
  return {
    id: String(m.id || m.uid || `usr-${Date.now()}`),
    uid: String(m.uid || m.id || ''),
    nome: String(m.nome || ''),
    email: String(m.email || ''),
    role: String(m.role || 'morador'),
    unidade: String(m.unidade || ''),
    bloco: String(m.bloco || 'Bloco A'),
    profissao: String(m.profissao || ''),
    foto: typeof m.foto === 'string' && !m.foto.startsWith('data:') ? m.foto : '',
    condominioId: String(m.condominioId || '')
  };
};

/**
 * Higieniza estritamente um objeto de unidade para o Firestore
 */
export const higienizarUnidadeParaFirestore = (u: any, condoId: string) => {
  const moradoresLimpos = Array.isArray(u.moradores)
    ? u.moradores.map(higienizarMoradorParaFirestore)
    : [];

  return {
    id: String(u.id),
    numero: String(u.numero || ''),
    bloco: String(u.bloco || 'Bloco A'),
    andar: typeof u.andar === 'number' ? u.andar : 1,
    tipo: String(u.tipo || 'Apartamento'),
    vagaGaragem: String(u.vagaGaragem || ''),
    senhaAcesso: String(u.senhaAcesso || u.numero || ''),
    senhaPadraoAlterada: Boolean(u.senhaPadraoAlterada),
    statusCadastro: String(u.statusCadastro || (moradoresLimpos.length > 0 ? 'Cadastrado' : 'Pendente')),
    semMoradores: Boolean(u.semMoradores),
    emailResponsavel: String(u.emailResponsavel || moradoresLimpos[0]?.email || ''),
    nomeCelula: String(u.nomeCelula || moradoresLimpos.map((m: any) => m.nome).join(', ') || ''),
    fotoCelula: typeof u.fotoCelula === 'string' && !u.fotoCelula.startsWith('data:') ? u.fotoCelula : '',
    condoId: String(condoId),
    moradores: moradoresLimpos
  };
};

/**
 * Salva ou atualiza uma única unidade na subcoleção do condomínio com upload automático de fotos para o Storage
 */
export const salvarUnidadeNoFirestore = async (condoId: string, unidade: any) => {
  try {
    if (!condoId || !unidade || !unidade.id) return { success: false };

    // Se tiver foto em Base64, faz o upload para o Firebase Storage antes de salvar no Firestore
    let fotoUrlFinal = unidade.fotoCelula;
    if (typeof fotoUrlFinal === 'string' && fotoUrlFinal.startsWith('data:')) {
      try {
        const caminhoFoto = `condominios/${condoId}/unidades/${unidade.id}/foto_${Date.now()}.jpg`;
        const storageUrl = await uploadFotoFirebaseStorage(caminhoFoto, fotoUrlFinal);
        if (storageUrl) {
          fotoUrlFinal = storageUrl;
        }
      } catch (errFoto) {
        console.warn('Falha no upload da foto da unidade para o Storage:', errFoto);
      }
    }

    const unidadeComFotoFinal = {
      ...unidade,
      fotoCelula: typeof fotoUrlFinal === 'string' && !fotoUrlFinal.startsWith('data:') ? fotoUrlFinal : ''
    };

    const limpo = higienizarUnidadeParaFirestore(unidadeComFotoFinal, condoId);
    const docRef = doc(db, 'condominios', condoId, 'unidades', unidade.id);
    await setDoc(docRef, limpo, { merge: true });
    return { success: true, fotoUrl: limpo.fotoCelula };
  } catch (error: any) {
    console.error('🔥 Erro ao salvar unidade no Firestore:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exclui um documento de uma subcoleção do condomínio
 */
export const excluirDocumentoSubcolecaoFirestore = async (condoId: string, nomeSubcolecao: string, docId: string) => {
  try {
    if (!condoId || !docId) return { success: false };
    const docRef = doc(db, 'condominios', condoId, nomeSubcolecao, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    console.error(`🔥 Erro ao excluir documento ${docId} em ${nomeSubcolecao}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Limpa uma subcoleção existente (remove todos os documentos antigos)
 * e grava os novos itens na nuvem Firestore
 */
export const limparESubstituirSubcolecaoFirestore = async (
  condoId: string, 
  nomeSubcolecao: string, 
  novosItens: any[]
) => {
  try {
    if (!condoId) return { success: false, error: 'CondoId ausente' };
    const colRef = collection(db, 'condominios', condoId, nomeSubcolecao);
    const snapshot = await getDocs(colRef);
    
    // 1. Exclui em lote todos os documentos antigos que existiam na subcoleção
    const batchDelete = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batchDelete.delete(docSnap.ref);
    });
    await batchDelete.commit();

    // 2. Insere os novos documentos limpos
    const batchInsert = writeBatch(db);
    for (const item of novosItens) {
      const docId = item.id || `unit-${condoId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const docRef = doc(db, 'condominios', condoId, nomeSubcolecao, docId);
      const limpo = sanitizarParaFirestore(item);
      batchInsert.set(docRef, { ...limpo, condoId });
    }
    await batchInsert.commit();
    
    console.log(`✅ Subcoleção ${nomeSubcolecao} limpa e recriada com sucesso no Firestore (${novosItens.length} itens).`);
    return { success: true, count: novosItens.length };
  } catch (error: any) {
    console.error(`🔥 Erro ao limpar e substituir subcoleção ${nomeSubcolecao} no condomínio ${condoId}:`, error);
    return { success: false, error: error.message };
  }
};

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
      const limpo = sanitizarParaFirestore(item);
      batch.set(docRef, { ...limpo, condoId }, { merge: true });
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
 * Upload de imagem Base64 para o Firebase Storage com compressão automática
 */
export const uploadFotoFirebaseStorage = async (
  caminhoStorage: string, 
  dataUrlBase64: string
): Promise<string | null> => {
  try {
    // Comprime e redimensiona para max 1024px e ~150KB antes do upload
    let payloadEnvio = dataUrlBase64;
    try {
      payloadEnvio = await otimizarImagemDataUrl(dataUrlBase64, {
        maxLargura: 1024,
        maxAltura: 1024,
        qualidade: 0.82
      });
    } catch {
      // Fallback
    }

    const storageRef = ref(storage, caminhoStorage);
    // Envia string em formato data_url otimizada
    await uploadString(storageRef, payloadEnvio, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.warn('Fallback: usando imagem original ou local devido a erro no Storage:', error);
    return null;
  }
};

export interface CadastroMoradorAuthParams {
  condoId: string;
  unidadeId: string;
  unidadeNumero: string;
  bloco?: string;
  moradorPrincipal: {
    nome: string;
    email: string;
    profissao?: string;
    fotoUrl?: string;
  };
  dependentes?: {
    nome: string;
    email?: string;
    profissao?: string;
  }[];
  senha?: string;
}

/**
 * Cria ou vincula o morador no Firebase Auth, cria perfil em 'users' e atualiza a unidade no Firestore.
 */
export const cadastrarMoradorAuth = async (params: CadastroMoradorAuthParams) => {
  const { condoId, unidadeId, unidadeNumero, bloco = 'Bloco A', moradorPrincipal, dependentes = [], senha } = params;
  
  try {
    let authUid = `usr-${unidadeNumero.replace(/\s+/g, '-')}-1-${Date.now()}`;
    const emailLimpo = moradorPrincipal.email.trim();
    const senhaFinal = senha && senha.trim().length >= 6 ? senha.trim() : `${unidadeNumero}123456`.slice(0, 8);

    // 1. Tenta criar usuário real no Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senhaFinal);
      authUid = userCredential.user.uid;
    } catch (authErr: any) {
      if (authErr.code === 'auth/email-already-in-use') {
        try {
          const loginRes = await signInWithEmailAndPassword(auth, emailLimpo, senhaFinal);
          authUid = loginRes.user.uid;
        } catch {
          // Se não conseguir logar com essa senha, mantém UID gerado
          console.warn('E-mail já registrado no Firebase Auth, atualizando dados no Firestore.');
        }
      } else {
        console.warn('Aviso Firebase Auth (continuando gravação no Firestore):', authErr.message);
      }
    }

    let urlFotoFinal = moradorPrincipal.fotoUrl || '';
    if (urlFotoFinal && urlFotoFinal.startsWith('data:')) {
      try {
        const caminhoFoto = `condominios/${condoId}/unidades/${unidadeId}/foto_${Date.now()}.jpg`;
        const storageUrl = await uploadFotoFirebaseStorage(caminhoFoto, urlFotoFinal);
        if (storageUrl) {
          urlFotoFinal = storageUrl;
        }
      } catch (errFoto) {
        console.warn('Aviso: falha no upload para o Storage, prosseguindo com cadastro:', errFoto);
      }
    }

    // 2. Monta o morador principal como plain object limpo
    const principalUserObj = {
      id: String(authUid),
      uid: String(authUid),
      nome: String(moradorPrincipal.nome.trim()),
      email: String(emailLimpo),
      profissao: String(moradorPrincipal.profissao?.trim() || ''),
      foto: urlFotoFinal.startsWith('data:') ? '' : urlFotoFinal,
      role: 'morador' as const,
      unidade: String(unidadeNumero),
      bloco: String(bloco),
      condominioId: String(condoId)
    };

    // 3. Monta dependentes/familiares como plain objects limpos
    const dependentesObjs = dependentes
      .filter(d => d.nome && d.nome.trim().length > 0)
      .map((d, idx) => ({
        id: `usr-${unidadeNumero.replace(/\s+/g, '-')}-${idx + 2}-${Date.now()}`,
        nome: String(d.nome.trim()),
        email: String(d.email?.trim() || ''),
        profissao: String(d.profissao?.trim() || ''),
        role: 'morador' as const,
        unidade: String(unidadeNumero),
        bloco: String(bloco),
        condominioId: String(condoId)
      }));

    const todosMoradores = [principalUserObj, ...dependentesObjs];
    const nomesFormatados = todosMoradores.map(m => m.nome).join(', ');

    // 4. Grava perfil do usuário na coleção 'users/{uid}'
    try {
      const userDocRef = doc(db, 'users', authUid);
      await setDoc(userDocRef, sanitizarParaFirestore({
        ...principalUserObj,
        foto: urlFotoFinal,
        atualizadoEm: new Date().toISOString()
      }), { merge: true });
    } catch (err) {
      console.warn('Erro ao salvar em users/{uid}:', err);
    }

    // 5. Atualiza a unidade na subcoleção condominios/{condoId}/unidades/{unidadeId}
    const unidadePayload = {
      id: String(unidadeId),
      numero: String(unidadeNumero),
      bloco: String(bloco),
      tipo: 'Apartamento',
      condoId: String(condoId),
      statusCadastro: 'Cadastrado',
      semMoradores: false,
      moradores: todosMoradores,
      titularUid: String(authUid),
      emailResponsavel: String(emailLimpo),
      nomeCelula: String(nomesFormatados),
      fotoCelula: urlFotoFinal.startsWith('data:') ? '' : urlFotoFinal,
      senhaAcesso: String(senhaFinal),
      senhaPadraoAlterada: Boolean(senha && senha.trim().length >= 6),
      atualizadoEm: new Date().toISOString()
    };

    const docRef = doc(db, 'condominios', condoId, 'unidades', unidadeId);
    await setDoc(docRef, sanitizarParaFirestore(unidadePayload), { merge: true });

    console.log(`✅ Morador ${moradorPrincipal.nome} cadastrado com sucesso na unidade ${unidadeNumero} (${condoId}/${unidadeId})`);

    return {
      success: true,
      authUid,
      usuarioPrincipal: principalUserObj,
      unidadeAtualizada: unidadePayload
    };
  } catch (error: any) {
    console.error('🔥 Erro no cadastrarMoradorAuth:', error);
    return {
      success: false,
      error: error.message || 'Erro ao realizar cadastro do morador'
    };
  }
};
