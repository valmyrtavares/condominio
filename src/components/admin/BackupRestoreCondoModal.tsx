import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCondo } from '../../context/CondoContext';
import { 
  ShieldCheck, 
  X, 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileJson,
  Sparkles,
  Info,
  KeyRound
} from 'lucide-react';

interface BackupRestoreCondoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreCondoModal: React.FC<BackupRestoreCondoModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    currentCondo, 
    currentCondoId, 
    recuperarMoradoresDoCondominio,
    padronizarSenhasTodasUnidades,
    exportarBackupCondominio,
    restaurarBackupCondominio
  } = useCondo();

  const [abaAtiva, setAbaAtiva] = useState<'recuperar' | 'backup'>('recuperar');
  const [loading, setLoading] = useState(false);
  const [statusSenha, setStatusSenha] = useState<string | null>(null);
  const [resultadoRecuperacao, setResultadoRecuperacao] = useState<{
    success: boolean;
    countRestaurados?: number;
    unidadesAfetadas?: number;
    detalhes?: string[];
    error?: string;
  } | null>(null);

  const [statusBackup, setStatusBackup] = useState<{
    tipo: 'sucesso' | 'erro' | null;
    mensagem: string;
  }>({ tipo: null, mensagem: '' });

  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null);

  if (!isOpen) return null;

  const nomeCondominio = currentCondo?.nome || currentCondoId || 'Condomínio';
  const canonicalCondoId = currentCondo?.id || currentCondoId || '';

  // Executa o resgate de moradores via coleção users e histórico
  const handleExecutarRecuperacao = async () => {
    setLoading(true);
    setResultadoRecuperacao(null);
    try {
      const res = await recuperarMoradoresDoCondominio(canonicalCondoId);
      setResultadoRecuperacao(res);
    } catch (err: any) {
      setResultadoRecuperacao({
        success: false,
        error: err.message || 'Erro inesperado ao executar recuperação.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Exporta o backup JSON do condomínio ativo
  const handleExportarBackup = async () => {
    setLoading(true);
    setStatusBackup({ tipo: null, mensagem: '' });
    try {
      const res = await exportarBackupCondominio(canonicalCondoId);
      if (res.success && res.backup) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.backup, null, 2));
        const downloadAnchor = document.createElement('a');
        const dataFormatada = new Date().toISOString().slice(0, 10);
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `backup-${canonicalCondoId}-${dataFormatada}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setStatusBackup({
          tipo: 'sucesso',
          mensagem: `Backup exportado com sucesso! Arquivo backup-${canonicalCondoId}-${dataFormatada}.json baixado.`
        });
      } else {
        setStatusBackup({
          tipo: 'erro',
          mensagem: res.error || 'Não foi possível gerar o backup.'
        });
      }
    } catch (err: any) {
      setStatusBackup({
        tipo: 'erro',
        mensagem: err.message || 'Erro ao exportar backup.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Restaura o backup a partir do arquivo JSON selecionado
  const handleRestaurarArquivo = async () => {
    if (!arquivoUpload) {
      setStatusBackup({ tipo: 'erro', mensagem: 'Selecione um arquivo de backup (.json).' });
      return;
    }

    setLoading(true);
    setStatusBackup({ tipo: null, mensagem: '' });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const conteudo = e.target?.result as string;
        const dadosJson = JSON.parse(conteudo);

        const res = await restaurarBackupCondominio(canonicalCondoId, dadosJson);
        if (res.success) {
          setStatusBackup({
            tipo: 'sucesso',
            mensagem: `Backup do condomínio "${nomeCondominio}" restaurado com sucesso no Cloud Firestore!`
          });
          setArquivoUpload(null);
        } else {
          setStatusBackup({
            tipo: 'erro',
            mensagem: res.error || 'Falha ao restaurar o backup.'
          });
        }
      } catch (err: any) {
        setStatusBackup({
          tipo: 'erro',
          mensagem: 'Arquivo JSON inválido ou corrompido: ' + err.message
        });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setStatusBackup({ tipo: 'erro', mensagem: 'Erro ao ler o arquivo de backup.' });
      setLoading(false);
    };

    reader.readAsText(arquivoUpload);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
            <Database size={160} />
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Segurança & Recuperação de Dados</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                {nomeCondominio} • Identificador: <span className="font-mono text-amber-300">{canonicalCondoId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors relative z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setAbaAtiva('recuperar')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
              abaAtiva === 'recuperar'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            <Sparkles size={16} />
            Resgate de Moradores (Nuvem)
          </button>
          <button
            onClick={() => setAbaAtiva('backup')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
              abaAtiva === 'backup'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            <FileJson size={16} />
            Backup & Restauração JSON
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {abaAtiva === 'recuperar' && (
            <div className="space-y-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3.5">
                <Info className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-indigo-950 space-y-1">
                  <p className="font-bold text-sm text-indigo-900">Como funciona o Resgate Automático?</p>
                  <p>
                    O sistema consulta a coleção global <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono">users</code> e o histórico de serviços cadastrados. Todos os moradores encontrados que pertencem a este condomínio serão automaticamente reassociados às suas respectivas unidades e fotos do Storage com status <strong>"Cadastrado"</strong>.
                  </p>
                  <p className="text-indigo-700 pt-1">
                    ✓ Não afeta outros condomínios • ✓ Preserva dados de outros apartamentos • ✓ Operação 100% segura.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Recuperar Moradores Perdidos</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Clique no botão abaixo para varrer a nuvem e repovoar imediatamente todos os moradores do condomínio <strong>{nomeCondominio}</strong>.
                  </p>
                </div>

                <button
                  onClick={handleExecutarRecuperacao}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Varrendo e Restaurando...' : 'Executar Resgate de Moradores Agora'}
                </button>
              </div>

              {/* Padronização de Senhas em Massa */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-950">Padronizar Senha de Todos os Apartamentos</h4>
                    <p className="text-[11px] text-amber-900/80">
                      Define a senha de acesso de todas as unidades para <strong className="font-mono text-xs bg-amber-200/80 px-1 py-0.5 rounded">123456</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    setStatusSenha(null);
                    try {
                      const res = await padronizarSenhasTodasUnidades(canonicalCondoId, '123456');
                      if (res.success) {
                        setStatusSenha(`Sucesso! ${res.totalAlteradas || 'Todas as'} unidades atualizadas com a senha "123456".`);
                      } else {
                        setStatusSenha('Erro: ' + (res.error || 'Falha ao alterar senhas.'));
                      }
                    } catch (e: any) {
                      setStatusSenha('Erro: ' + e.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors"
                >
                  Definir "123456" para Todos
                </button>
              </div>

              {statusSenha && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{statusSenha}</span>
                </div>
              )}

              {/* Relatório de Resultado */}
              {resultadoRecuperacao && (
                <div className={`p-4 rounded-xl border ${
                  resultadoRecuperacao.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    {resultadoRecuperacao.success ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span>Varredura concluída com sucesso!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-rose-600" />
                        <span>Erro ao executar a recuperação</span>
                      </>
                    )}
                  </div>

                  {resultadoRecuperacao.success ? (
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-emerald-800">
                        Total de moradores restaurados: <span className="text-sm font-bold text-emerald-900">{resultadoRecuperacao.countRestaurados || 0}</span> em <span className="text-sm font-bold text-emerald-900">{resultadoRecuperacao.unidadesAfetadas || 0}</span> unidades.
                      </p>
                      {resultadoRecuperacao.detalhes && resultadoRecuperacao.detalhes.length > 0 && (
                        <div className="mt-2 max-h-36 overflow-y-auto bg-white/70 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                          {resultadoRecuperacao.detalhes.map((detalhe, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{detalhe}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-rose-700">{resultadoRecuperacao.error}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'backup' && (
            <div className="space-y-6">
              {/* Exportar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Download size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Exportar Backup (.json)</h4>
                      <p className="text-xs text-slate-500">Baixa todas as unidades, moradores, comunicados e regras deste condomínio.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportarBackup}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                  >
                    <Download size={14} />
                    {loading ? 'Exportando...' : 'Baixar Backup'}
                  </button>
                </div>
              </div>

              {/* Restaurar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Restaurar Backup (.json)</h4>
                    <p className="text-xs text-slate-500">Restaura exclusivamente este condomínio sem afetar os outros clientes.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".json"
                    id="upload-backup-json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setArquivoUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="upload-backup-json"
                    className="px-3.5 py-2 border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition-colors"
                  >
                    {arquivoUpload ? arquivoUpload.name : 'Selecionar arquivo .json...'}
                  </label>

                  <button
                    onClick={handleRestaurarArquivo}
                    disabled={!arquivoUpload || loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-40 transition-colors"
                  >
                    <Upload size={14} />
                    {loading ? 'Restaurando...' : 'Aplicar Restauração'}
                  </button>
                </div>
              </div>

              {/* Mensagem de status */}
              {statusBackup.mensagem && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  statusBackup.tipo === 'sucesso' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {statusBackup.tipo === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{statusBackup.mensagem}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Tenant: {canonicalCondoId} • Base de dados segura
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
