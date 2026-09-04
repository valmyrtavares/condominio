/**
 * Utilitário para compressão e redimensionamento automático de imagens client-side
 * Reduz fotos pesadas de celulares (5MB - 15MB) para arquivos leves (~150KB - 250KB)
 * mantendo alta nitidez para exibição na web e mobile.
 */

export interface OtimizacaoImagemOpcoes {
  maxLargura?: number;
  maxAltura?: number;
  qualidade?: number; // 0.1 a 1.0 (padrão 0.82)
}

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
 * Redimensiona e comprime uma imagem a partir de uma string Data URL / Base64
 */
export const otimizarImagemDataUrl = (
  dataUrl: string,
  opcoes: OtimizacaoImagemOpcoes = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { maxLargura = 1024, maxAltura = 1024, qualidade = 0.82 } = opcoes;

    // Se já for uma URL externa (http/https), não processa em canvas
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.onerror = () => reject(new Error('Falha ao processar a imagem no navegador.'));
    img.onload = () => {
      let { width, height } = img;

      // Mantém a proporção redimensionando se ultrapassar os limites máximos
      if (width > maxLargura || height > maxAltura) {
        if (width / height > maxLargura / maxAltura) {
          height = Math.round((height * maxLargura) / width);
          width = maxLargura;
        } else {
          width = Math.round((width * maxAltura) / height);
          height = maxAltura;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl); // Fallback caso não suporte canvas 2D
      }

      // Suavização de alta qualidade
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fundo branco caso a imagem possua transparência (evita fundo preto ao converter PNG para JPEG)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Exporta em JPEG otimizado
      const resultadoComprimido = canvas.toDataURL('image/jpeg', qualidade);
      resolve(resultadoComprimido);
    };

    img.src = dataUrl;
  });
};
