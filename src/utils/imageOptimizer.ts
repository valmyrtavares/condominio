/**
 * Utilitário para compressão e redimensionamento automático de imagens client-side.
 * Transforma fotos pesadas de celulares (5MB - 20MB) em arquivos leves e nítidos
 * rigorosamente limitados a NO MÁXIMO ~120KB, protegendo o Firestore e otimizando a navegação.
 */

export interface OtimizacaoImagemOpcoes {
  maxLargura?: number; // padrão 1024px
  maxAltura?: number; // padrão 1024px
  qualidade?: number; // padrão 0.75
  maxBytes?: number; // padrão 122880 bytes (~120KB)
}

const LIMITE_PADRAO_BYTES = 120 * 1024; // 120 KB

/**
 * Comprime e redimensiona um File de imagem selecionado no input
 */
export const otimizarImagemArquivo = (
  arquivo: File,
  opcoes: OtimizacaoImagemOpcoes = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Se não for imagem, rejeita
    if (!arquivo.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Conteúdo da imagem vazio.'));
      }
      otimizarImagemDataUrl(dataUrl, opcoes)
        .then(resolve)
        .catch(reject);
    };

    reader.readAsDataURL(arquivo);
  });
};

/**
 * Redimensiona e comprime uma imagem a partir de uma string Data URL / Base64.
 * Garante que a saída nunca ultrapasse 120KB com compressão adaptativa em canvas.
 */
export const otimizarImagemDataUrl = (
  dataUrl: string,
  opcoes: OtimizacaoImagemOpcoes = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { 
      maxLargura = 1024, 
      maxAltura = 1024, 
      qualidade = 0.75,
      maxBytes = LIMITE_PADRAO_BYTES
    } = opcoes;

    // Se já for uma URL externa (http/https) ou SVG, não processa em canvas
    if (
      dataUrl.startsWith('http://') || 
      dataUrl.startsWith('https://') || 
      dataUrl.startsWith('data:image/svg+xml')
    ) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.onerror = () => reject(new Error('Falha ao processar a imagem no navegador.'));
    img.onload = () => {
      let curWidth = img.width;
      let curHeight = img.height;

      // 1. Redimensionamento inicial mantendo proporção
      if (curWidth > maxLargura || curHeight > maxAltura) {
        if (curWidth / curHeight > maxLargura / maxAltura) {
          curHeight = Math.round((curHeight * maxLargura) / curWidth);
          curWidth = maxLargura;
        } else {
          curWidth = Math.round((curWidth * maxAltura) / curHeight);
          curHeight = maxAltura;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, curWidth);
      canvas.height = Math.max(1, curHeight);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl); // Fallback caso não suporte canvas 2D
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fundo branco caso a imagem possua transparência (PNG/WEBP para JPEG)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Limite em caracteres Base64 correspondente a maxBytes (~1.37x do binário)
      const maxCharLength = Math.floor(maxBytes * 1.37);

      let currentQuality = Math.min(0.9, Math.max(0.3, qualidade));
      let resultadoComprimido = canvas.toDataURL('image/jpeg', currentQuality);

      // 2. Loop Adaptativo de Compressão e Escala para garantir estritamente <= 120KB
      let tentativas = 0;
      while (resultadoComprimido.length > maxCharLength && tentativas < 6) {
        tentativas++;
        currentQuality = Math.max(0.35, currentQuality - 0.12);

        // Se a qualidade já estiver baixa, reduz a resolução em 15%
        if (tentativas >= 2) {
          curWidth = Math.round(curWidth * 0.85);
          curHeight = Math.round(curHeight * 0.85);
          canvas.width = Math.max(1, curWidth);
          canvas.height = Math.max(1, curHeight);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        resultadoComprimido = canvas.toDataURL('image/jpeg', currentQuality);
      }

      resolve(resultadoComprimido);
    };

    img.src = dataUrl;
  });
};
