import * as XLSX from 'xlsx';
import { DespesaItem, ReceitaItem } from '../types';

export interface ParsedItemResult<T> {
  validos: T[];
  erros: { linha: number; mensagem: string }[];
  totalValor: number;
}

// Formatador de Moeda
export const formatCurrency = (val: number): string => {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Helper universal para forçar o download de arquivo Blob no navegador (pasta Downloads)
const salvarWorkbookNoNavegador = (workbook: XLSX.WorkBook, filename: string) => {
  try {
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.warn('Fallback para XLSX.writeFile:', err);
    XLSX.writeFile(workbook, filename);
  }
};

// Helper para salvar CSV com UTF-8 BOM
const salvarCSVNoNavegador = (content: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Sanitizar número vindo do Excel ou CSV (ex: "R$ 1.250,50", "1250,50", "1250.50", 1250.5)
const parseExcelNumber = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  
  let str = String(val).trim();
  str = str.replace(/R\$\s?/gi, '').trim();
  
  if (str.includes(',') && !str.includes('.')) {
    str = str.replace(',', '.');
  } else if (str.includes('.') && str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }
  
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

// Formatador de Data (suporta objeto Date do Excel, serial number ou strings como "25/09/2026", "2026-09-25")
const parseExcelDate = (val: any): string => {
  if (!val) return new Date().toLocaleDateString('pt-BR');
  
  if (typeof val === 'number') {
    const dateObj = XLSX.SSF.parse_date_code(val);
    if (dateObj) {
      const day = String(dateObj.d).padStart(2, '0');
      const month = String(dateObj.m).padStart(2, '0');
      const year = dateObj.y;
      return `${day}/${month}/${year}`;
    }
  }

  if (val instanceof Date) {
    const day = String(val.getDate()).padStart(2, '0');
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const year = val.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const str = String(val).trim();
  
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [year, month, day] = str.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  return str;
};

/**
 * Download Modelo Excel (.XLSX) de SAÍDAS (Despesas)
 */
export const downloadModeloSaidasExcel = () => {
  const data = [
    {
      'Título da Saída': 'Manutenção Preventiva do Motor do Portão',
      'Categoria da Despesa': 'Manutenção',
      'Fornecedor / Favorecido': 'Elevadores Atlas / Portões Tec',
      'Valor da Saída (R$)': 450.00,
      'Data de Vencimento': '25/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Substituição de graxa e ajuste dos cabos de aço da garagem',
      'Link do Comprovante / NF': 'https://exemplo.com/nota-fiscal-portao.pdf'
    },
    {
      'Título da Saída': 'Conta de Energia das Áreas Comuns',
      'Categoria da Despesa': 'Energia Elétrica',
      'Fornecedor / Favorecido': 'ENEL Distribuição SP',
      'Valor da Saída (R$)': 1850.30,
      'Data de Vencimento': '28/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Refere-se ao consumo da bomba d\'água, iluminação das garagens e elevadores',
      'Link do Comprovante / NF': 'https://exemplo.com/fatura-enel.pdf'
    },
    {
      'Título da Saída': 'Produtos de Limpeza e Higienização dos Blocos',
      'Categoria da Despesa': 'Limpeza',
      'Fornecedor / Favorecido': 'Distribuidora LimpMax',
      'Valor da Saída (R$)': 620.00,
      'Data de Vencimento': '30/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Compra mensal de sabão líquido, desinfetante e sacos de lixo de 100L',
      'Link do Comprovante / NF': ''
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 45 },
    { wch: 25 },
    { wch: 35 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 50 },
    { wch: 45 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo de Saídas');

  salvarWorkbookNoNavegador(workbook, 'Modelo_Prestacao_Contas_SAIDAS.xlsx');
};

/**
 * Download Modelo CSV de SAÍDAS (Despesas)
 */
export const downloadModeloSaidasCSV = () => {
  const csvContent = 
`Título da Saída;Categoria da Despesa;Fornecedor / Favorecido;Valor da Saída (R$);Data de Vencimento;Parcela;Comentário;Link do Comprovante / NF
Manutenção Preventiva do Motor do Portão;Manutenção;Elevadores Atlas / Portões Tec;450,00;25/09/2026;1/1;Substituição de graxa e ajuste dos cabos de aço da garagem;https://exemplo.com/nota-fiscal-portao.pdf
Conta de Energia das Áreas Comuns;Energia Elétrica;ENEL Distribuição SP;1850,30;28/09/2026;1/1;Refere-se ao consumo da bomba d'água e elevadores;https://exemplo.com/fatura-enel.pdf
Produtos de Limpeza e Higienização dos Blocos;Limpeza;Distribuidora LimpMax;620,00;30/09/2026;1/1;Compra mensal de sabão líquido e sacos de lixo;`;

  salvarCSVNoNavegador(csvContent, 'Modelo_Prestacao_Contas_SAIDAS.csv');
};

/**
 * Download Modelo Excel (.XLSX) de ENTRADAS (Receitas)
 */
export const downloadModeloEntradasExcel = () => {
  const data = [
    {
      'Título da Entrada': 'Arrecadação Taxa Condominial Ordinária',
      'Categoria da Receita': 'Taxa Condominial',
      'Origem / Pagador': 'Moradores / Cobrança Bradesco',
      'Valor da Entrada (R$)': 45000.00,
      'Data de Recebimento': '10/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Total consolidado da arrecadação da taxa condominial referente ao mês',
      'Link do Comprovante': 'https://exemplo.com/extrato-recebimento-bradesco.pdf'
    },
    {
      'Título da Entrada': 'Fundo de Reserva Mensal',
      'Categoria da Receita': 'Fundo de Reserva',
      'Origem / Pagador': 'Transferência Conta Principal',
      'Valor da Entrada (R$)': 4500.00,
      'Data de Recebimento': '12/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Repasse obrigatório de 10% da taxa ordinária para a conta de reserva',
      'Link do Comprovante': ''
    },
    {
      'Título da Entrada': 'Locação do Salão de Festas - Ap 402',
      'Categoria da Receita': 'Aluguel Espaços',
      'Origem / Pagador': 'Morador Ap 402 Bloco A',
      'Valor da Entrada (R$)': 250.00,
      'Data de Recebimento': '18/09/2026',
      'Parcela': '1/1',
      'Comentário': 'Taxa de uso e higienização do Salão de Festas Principal',
      'Link do Comprovante': 'https://exemplo.com/recibo-salao-festas.pdf'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 45 },
    { wch: 25 },
    { wch: 35 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 50 },
    { wch: 45 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo de Entradas');

  salvarWorkbookNoNavegador(workbook, 'Modelo_Prestacao_Contas_ENTRADAS.xlsx');
};

/**
 * Download Modelo CSV de ENTRADAS (Receitas)
 */
export const downloadModeloEntradasCSV = () => {
  const csvContent = 
`Título da Entrada;Categoria da Receita;Origem / Pagador;Valor da Entrada (R$);Data de Recebimento;Parcela;Comentário;Link do Comprovante
Arrecadação Taxa Condominial Ordinária;Taxa Condominial;Moradores / Cobrança Bradesco;45000,00;10/09/2026;1/1;Total consolidado da arrecadação da taxa condominial referente ao mês;https://exemplo.com/extrato-recebimento-bradesco.pdf
Fundo de Reserva Mensal;Fundo de Reserva;Transferência Conta Principal;4500,00;12/09/2026;1/1;Repasse obrigatório de 10% da taxa ordinária para a conta de reserva;
Locação do Salão de Festas - Ap 402;Aluguel Espaços;Morador Ap 402 Bloco A;250,00;18/09/2026;1/1;Taxa de uso e higienização do Salão de Festas Principal;https://exemplo.com/recibo-salao-festas.pdf`;

  salvarCSVNoNavegador(csvContent, 'Modelo_Prestacao_Contas_ENTRADAS.csv');
};

/**
 * Exporta lançamentos existentes de Saídas ou Entradas para Excel
 */
export const exportarMesFinanceiroExcel = (
  mesAno: string,
  tipo: 'saidas' | 'entradas',
  despesas: DespesaItem[],
  receitas: ReceitaItem[]
) => {
  const filename = `Prestacao_Contas_${tipo.toUpperCase()}_${mesAno.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  const workbook = XLSX.utils.book_new();

  if (tipo === 'saidas') {
    const data = despesas.length > 0 
      ? despesas.map(d => ({
          'Título da Saída': d.titulo || d.descricao,
          'Categoria da Despesa': d.categoria,
          'Fornecedor / Favorecido': d.fornecedor,
          'Valor da Saída (R$)': d.valor,
          'Data de Vencimento': d.dataVencimento || d.data,
          'Parcela': d.parcelas || '1/1',
          'Comentário': d.comentario || '',
          'Link do Comprovante / NF': d.comprovanteUrl || d.notaFiscalUrl || ''
        }))
      : [
          {
            'Título da Saída': 'Ex: Manutenção Preventiva do Portão',
            'Categoria da Despesa': 'Manutenção',
            'Fornecedor / Favorecido': 'Elevadores Atlas / Portões Tec',
            'Valor da Saída (R$)': 450.00,
            'Data de Vencimento': '25/09/2026',
            'Parcela': '1/1',
            'Comentário': 'Substituição de graxa e ajuste dos cabos de aço da garagem',
            'Link do Comprovante / NF': 'https://exemplo.com/nota-fiscal.pdf'
          }
        ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 45 },
      { wch: 25 },
      { wch: 35 },
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 50 },
      { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Saídas');
  } else {
    const data = receitas.length > 0 
      ? receitas.map(r => ({
          'Título da Entrada': r.titulo || r.descricao,
          'Categoria da Receita': r.categoria,
          'Origem / Pagador': r.origem,
          'Valor da Entrada (R$)': r.valor,
          'Data de Recebimento': r.dataVencimento || r.data,
          'Parcela': r.parcelas || '1/1',
          'Comentário': r.comentario || '',
          'Link do Comprovante': r.comprovanteUrl || r.notaFiscalUrl || ''
        }))
      : [
          {
            'Título da Entrada': 'Ex: Arrecadação Taxa Condominial Ordinária',
            'Categoria da Receita': 'Taxa Condominial',
            'Origem / Pagador': 'Moradores / Cobrança Bradesco',
            'Valor da Entrada (R$)': 45000.00,
            'Data de Recebimento': '10/09/2026',
            'Parcela': '1/1',
            'Comentário': 'Total consolidado da arrecadação da taxa condominial referente ao mês',
            'Link do Comprovante': 'https://exemplo.com/extrato.pdf'
          }
        ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 45 },
      { wch: 25 },
      { wch: 35 },
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 50 },
      { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entradas');
  }

  salvarWorkbookNoNavegador(workbook, filename);
};

/**
 * Parser de arquivo Excel/CSV para Saídas ou Entradas
 */
export const parsearExcelFinanceiro = async (
  file: File,
  tipo: 'despesas' | 'receitas'
): Promise<ParsedItemResult<Omit<DespesaItem, 'id'> | Omit<ReceitaItem, 'id'>>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary', cellDates: true });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const validos: any[] = [];
        const erros: { linha: number; mensagem: string }[] = [];
        let totalValor = 0;

        jsonRows.forEach((row, index) => {
          const linhaNum = index + 2;

          const normalizedKeys: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '');
            normalizedKeys[cleanKey] = row[key];
          });

          const getValueByKeywords = (keywords: string[]) => {
            for (const kw of keywords) {
              for (const key of Object.keys(normalizedKeys)) {
                if (key.includes(kw)) {
                  return normalizedKeys[key];
                }
              }
            }
            return '';
          };

          if (tipo === 'despesas') {
            const titulo = String(getValueByKeywords(['titulo', 'descricao', 'nome'])).trim();
            const categoria = String(getValueByKeywords(['categoria', 'tipo'])).trim() || 'Outros';
            const fornecedor = String(getValueByKeywords(['fornecedor', 'favorecido', 'empresa'])).trim();
            const rawValor = getValueByKeywords(['valor', 'quantia', 'saida']);
            const valor = parseExcelNumber(rawValor);
            const dataVenc = parseExcelDate(getValueByKeywords(['vencimento', 'pagamento', 'data']));
            const parcela = String(getValueByKeywords(['parcela', 'total'])).trim() || '1/1';
            const comentario = String(getValueByKeywords(['comentario', 'detalhe', 'obs'])).trim();
            const comprovanteUrl = String(getValueByKeywords(['link', 'comprovante', 'nota', 'nf'])).trim();

            if (!titulo && valor <= 0 && !fornecedor) {
              return;
            }

            if (!titulo) {
              erros.push({ linha: linhaNum, mensagem: 'Título/Descrição da saída está em branco.' });
              return;
            }

            if (valor <= 0) {
              erros.push({ linha: linhaNum, mensagem: `Valor inválido para "${titulo}": R$ ${valor}` });
              return;
            }

            totalValor += valor;
            const item: Omit<DespesaItem, 'id'> = {
              titulo,
              descricao: titulo,
              categoria: categoria || 'Manutenção',
              fornecedor: fornecedor || 'Não especificado',
              valor,
              data: dataVenc,
              dataVencimento: dataVenc,
              parcelas: parcela,
              comentario,
              comprovanteUrl: comprovanteUrl || undefined,
              notaFiscalUrl: comprovanteUrl || undefined
            };

            validos.push(item);
          } else {
            const titulo = String(getValueByKeywords(['titulo', 'descricao', 'recebimento'])).trim();
            const categoria = String(getValueByKeywords(['categoria', 'tipo'])).trim() || 'Taxa Condominial';
            const origem = String(getValueByKeywords(['origem', 'pagador', 'recurso'])).trim();
            const rawValor = getValueByKeywords(['valor', 'entrada', 'receita']);
            const valor = parseExcelNumber(rawValor);
            const dataRec = parseExcelDate(getValueByKeywords(['recebimento', 'data']));
            const parcela = String(getValueByKeywords(['parcela', 'total'])).trim() || '1/1';
            const comentario = String(getValueByKeywords(['comentario', 'detalhe', 'obs'])).trim();
            const comprovanteUrl = String(getValueByKeywords(['link', 'comprovante', 'recibo'])).trim();

            if (!titulo && valor <= 0 && !origem) {
              return;
            }

            if (!titulo) {
              erros.push({ linha: linhaNum, mensagem: 'Título/Descrição da receita está em branco.' });
              return;
            }

            if (valor <= 0) {
              erros.push({ linha: linhaNum, mensagem: `Valor inválido para "${titulo}": R$ ${valor}` });
              return;
            }

            totalValor += valor;
            const item: Omit<ReceitaItem, 'id'> = {
              titulo,
              descricao: titulo,
              categoria: categoria || 'Taxa Condominial',
              origem: origem || 'Moradores',
              valor,
              data: dataRec,
              dataVencimento: dataRec,
              parcelas: parcela,
              comentario,
              comprovanteUrl: comprovanteUrl || undefined,
              notaFiscalUrl: comprovanteUrl || undefined
            };

            validos.push(item);
          }
        });

        resolve({ validos, erros, totalValor });
      } catch (err: any) {
        reject(new Error(`Falha ao ler o arquivo Excel: ${err.message || err}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Não foi possível ler o arquivo selecionado.'));
    };

    reader.readAsBinaryString(file);
  });
};
