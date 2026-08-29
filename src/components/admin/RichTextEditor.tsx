import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  ListOrdered, 
  List, 
  Heading3, 
  AlertTriangle, 
  Eraser, 
  Eye, 
  Edit3, 
  Sparkles,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escreva as regras, parágrafos, diretrizes e detalhes...',
  minHeight = '180px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isFocused, setIsFocused] = useState(false);

  // Sync incoming value to editor content if changed externally (e.g. edit mode initialization)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Insert a custom highlighted alert block
  const insertHighlightBox = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const alertHtml = `
      <div style="background-color: rgba(254, 243, 199, 0.95); border-left: 4px solid #d97706; padding: 10px 14px; border-radius: 8px; margin: 8px 0; color: #78350f; font-weight: 600;">
        ⚠️ <strong>Atenção / Penalidade:</strong> O descumprimento está sujeito a advertência formal e multa conforme o regimento interno.
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, alertHtml);
    handleInput();
  };

  // Insert quick preset template
  const applyTemplate = (type: 'horario' | 'normas_numeradas' | 'penalidades') => {
    if (!editorRef.current) return;
    let template = '';
    
    if (type === 'horario') {
      template = `
        <p><strong>Horários de Funcionamento e Silêncio:</strong></p>
        <ul>
          <li><strong>Segunda a Sexta:</strong> das 08:00 às 22:00</li>
          <li><strong>Sábados, Domingos e Feriados:</strong> das 09:00 às 20:00</li>
        </ul>
        <p>Após esse horário, o local permanecerá trancado para manutenção e higienização.</p>
      `;
    } else if (type === 'normas_numeradas') {
      template = `
        <p>Diretrizes obrigatórias para o uso do espaço:</p>
        <ol>
          <li>A reserva ou uso deve ser feito sempre pelo <strong>aplicativo oficial</strong> do condomínio.</li>
          <li>É obrigatório zelar pela <strong>limpeza e conservação</strong> dos equipamentos e mobiliários.</li>
          <li>Menores de 12 anos devem estar sempre <strong>acompanhados de um responsável</strong>.</li>
          <li>É expressamente proibido o uso de <strong>garrafas ou recipientes de vidro</strong>.</li>
        </ol>
      `;
    } else if (type === 'penalidades') {
      template = `
        <p><strong>Procedimento em caso de infração:</strong></p>
        <ol>
          <li><strong>1ª Ocorrência:</strong> Advertência formal por escrito enviada à unidade infratora.</li>
          <li><strong>2ª Ocorrência / Reincidência:</strong> Aplicação de multa de 50% da taxa condominial.</li>
          <li><strong>Reincidência Grave:</strong> Multa integral e suspensão temporária de uso de áreas comuns.</li>
        </ol>
      `;
    }

    editorRef.current.focus();
    document.execCommand('insertHTML', false, template);
    handleInput();
  };

  return (
    <div className="space-y-2">
      {/* Top action bar with view switch and quick templates */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-700" />
          Texto das Normas & Regulamento *
        </span>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Eye className="w-3 h-3" /> Visualizar como Morador
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
        
        {/* Formatting Toolbar */}
        {activeTab !== 'preview' && (
          <div className="bg-slate-100/90 border-b border-slate-200 p-2 flex items-center gap-1 flex-wrap text-slate-700 select-none">
            
            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors font-bold text-xs flex items-center gap-0.5 cursor-pointer"
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors text-xs flex items-center gap-0.5 cursor-pointer"
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors text-xs flex items-center gap-0.5 cursor-pointer"
              title="Sublinhado (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Numbered List */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Lista Numerada (1, 2, 3...)"
            >
              <ListOrdered className="w-4 h-4 text-indigo-700" />
              <span className="text-[10px] font-bold hidden sm:inline">Numeração</span>
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Lista com Marcadores (•)"
            >
              <List className="w-4 h-4 text-emerald-700" />
              <span className="text-[10px] font-bold hidden sm:inline">Marcadores</span>
            </button>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {/* Heading / Subtitle */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', '<h3>'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 hover:text-slate-950 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Subtítulo / Destaque"
            >
              <Heading3 className="w-4 h-4 text-amber-800" />
              <span className="text-[10px] font-bold hidden sm:inline">Subtítulo</span>
            </button>

            {/* Alert Box */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertHighlightBox(); }}
              className="p-1.5 rounded-lg hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300/80 transition-colors text-xs flex items-center gap-1 bg-amber-50 cursor-pointer"
              title="Inserir Caixa de Atenção / Advertência"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[10px] font-black uppercase">Aviso</span>
            </button>

            {/* Clear formatting */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('removeFormat'); }}
              className="p-1.5 rounded-lg hover:bg-slate-200 active:bg-amber-200 text-slate-500 hover:text-slate-800 transition-colors text-xs flex items-center gap-0.5 ml-auto cursor-pointer"
              title="Limpar Formatação"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>

          </div>
        )}

        {/* Editor Area */}
        {activeTab === 'editor' && (
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ minHeight }}
              className="p-4 text-xs sm:text-sm text-slate-900 leading-relaxed font-medium focus:outline-none overflow-y-auto max-h-[360px] 
                [&_p]:my-1.5 
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:my-1
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:my-1
                [&_h3]:font-black [&_h3]:text-sm [&_h3]:text-slate-950 [&_h3]:my-2 [&_h3]:text-amber-950
                [&_strong]:font-black [&_strong]:text-slate-950
                [&_em]:italic"
            />
            {(!value || value === '<br>' || value === '<p></p>') && !isFocused && (
              <div 
                onClick={() => editorRef.current?.focus()}
                className="absolute top-4 left-4 text-xs sm:text-sm text-slate-400 pointer-events-none select-none"
              >
                {placeholder}
              </div>
            )}
          </div>
        )}

        {/* Live Resident Mockup Preview */}
        {activeTab === 'preview' && (
          <div className="p-4 bg-slate-900 text-white min-h-[180px] space-y-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1 text-amber-300">
                <Sparkles className="w-3 h-3" /> Visualização Real do Morador (Card Aberto)
              </span>
              <span>Módulo: Regras do Condomínio</span>
            </div>

            {/* Resident Card Preview */}
            <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-2xl p-4 text-slate-950 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-950">
                  Prévia do Tópico de Regra
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/10 text-slate-900 border border-slate-950/15">
                  Exemplo Aberto
                </span>
              </div>

              <div 
                className="pt-2 border-t border-slate-950/10 text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold
                  [&_p]:my-1.5 
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:my-1
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:my-1
                  [&_h3]:font-black [&_h3]:text-sm [&_h3]:text-slate-950 [&_h3]:my-2
                  [&_strong]:font-black [&_strong]:text-slate-950
                  [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-600 italic">Nenhum texto digitado ainda...</p>' }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Quick Templates Helpers */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-bold text-slate-600 uppercase">
          Inserir Modelo Rápido:
        </span>
        <button
          type="button"
          onClick={() => applyTemplate('normas_numeradas')}
          className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold transition-colors cursor-pointer border border-amber-300/60"
        >
          + Lista de Normas (1, 2, 3...)
        </button>
        <button
          type="button"
          onClick={() => applyTemplate('horario')}
          className="px-2 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-950 text-[10px] font-bold transition-colors cursor-pointer border border-indigo-300/60"
        >
          <Clock className="w-2.5 h-2.5 inline mr-1" />+ Tabela de Horários
        </button>
        <button
          type="button"
          onClick={() => applyTemplate('penalidades')}
          className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-950 text-[10px] font-bold transition-colors cursor-pointer border border-rose-300/60"
        >
          <ShieldAlert className="w-2.5 h-2.5 inline mr-1" />+ Escala de Multas
        </button>
      </div>

    </div>
  );
};
