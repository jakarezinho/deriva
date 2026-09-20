import { useState, useEffect, useCallback } from 'react';
import { prompts, categories, getRandomPrompt, getRandomPrompts, getRandomPromptByCategory, type Prompt } from './data/prompts';
import { 
  initDatabase, 
  getAllDerivas, 
  getDerivaById, 
  createDeriva, 
  updateDeriva, 
  deleteDeriva, 
  getConfig, 
  saveConfig, 
  getStats, 
  exportDatabase, 
  importDatabase, 
  generateId,
  type DerivaCompleta,
  type DerivaConfig 
} from './db/database';

type Page = 'home' | 'deriva' | 'historico' | 'config';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [derivaAtiva, setDerivaAtiva] = useState<DerivaCompleta | null>(null);
  const [derivas, setDerivas] = useState<DerivaCompleta[]>([]);
  const [config, setConfig] = useState<DerivaConfig>({ nomeDerivante: 'Derivante', cidadeBase: '', temaPreferido: '' });

  // Inicializar banco de dados
  const initializeDb = useCallback(async () => {
    setDbLoading(true);
    setDbError(null);
    
    try {
      console.log('Iniciando banco de dados...');
      await initDatabase();
      console.log('Banco de dados inicializado com sucesso');
      
      setDbReady(true);
      setDbLoading(false);
      setDerivas(getAllDerivas());
      setConfig(getConfig());
    } catch (err) {
      console.error('Erro ao inicializar banco:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido ao inicializar banco de dados';
      setDbError(errorMsg);
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeDb();
  }, [initializeDb]);

  const handleRetry = () => {
    // Resetar estado e tentar novamente
    setDbReady(false);
    setDbError(null);
    initializeDb();
  };

  const refreshDerivas = () => {
    setDerivas(getAllDerivas());
  };

  const handleSaveDeriva = async (deriva: DerivaCompleta) => {
    await createDeriva(deriva);
    refreshDerivas();
  };

  const handleUpdateDeriva = async (deriva: DerivaCompleta) => {
    await updateDeriva(deriva);
    refreshDerivas();
  };

  const handleDeleteDeriva = async (id: string) => {
    await deleteDeriva(id);
    refreshDerivas();
  };

  const handleSaveConfig = async (newConfig: DerivaConfig) => {
    await saveConfig(newConfig);
    setConfig(newConfig);
  };

  if (dbLoading || !dbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center px-4">
          {dbError ? (
            <>
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-deriva-danger mb-2 text-lg font-bold">Erro ao inicializar banco de dados</p>
              <p className="text-deriva-muted text-sm max-w-md mb-4">{dbError}</p>
              <div className="space-y-2">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-deriva-accent/10 text-deriva-accent border border-deriva-accent/30 rounded-lg text-sm hover:bg-deriva-accent/20 transition-colors block w-full"
                >
                  Tentar novamente
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white/5 text-deriva-muted border border-deriva-border rounded-lg text-sm hover:bg-white/10 transition-colors block w-full"
                >
                  Recarregar página
                </button>
              </div>
              <p className="text-deriva-muted/40 text-xs mt-6 max-w-sm">
                Verifique sua conexão com a internet. O banco de dados precisa carregar arquivos do servidor.
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 animate-pulse-slow">◉</div>
              <p className="text-deriva-muted text-lg">Inicializando banco de dados...</p>
              <p className="text-deriva-muted/50 text-xs mt-2">Carregando SQLite via WebAssembly</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen noise-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-deriva-border/50" style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage('home')} className="flex items-center gap-2 group">
            <span className="text-2xl">◉</span>
            <span className="font-serif text-lg tracking-wider text-gradient font-bold hidden sm:block">DERIVA</span>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            <NavButton active={page === 'home'} onClick={() => setPage('home')} icon="◈" label="Início" />
            <NavButton active={page === 'deriva'} onClick={() => setPage('deriva')} icon="⟐" label="Derivar" />
            <NavButton active={page === 'historico'} onClick={() => setPage('historico')} icon="▤" label="Histórico" />
            <NavButton active={page === 'config'} onClick={() => setPage('config')} icon="⚙" label="Config" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {page === 'home' && <HomePage onStartDeriva={() => setPage('deriva')} config={config} />}
        {page === 'deriva' && (
          <DerivaPage
            derivaAtiva={derivaAtiva}
            setDerivaAtiva={setDerivaAtiva}
            onSave={handleSaveDeriva}
            config={config}
          />
        )}
        {page === 'historico' && (
          <HistoricoPage
            derivas={derivas}
            onDelete={handleDeleteDeriva}
            onUpdate={handleUpdateDeriva}
            stats={getStats()}
          />
        )}
        {page === 'config' && (
          <ConfigPage config={config} onSave={handleSaveConfig} />
        )}
      </main>
    </div>
  );
}

// ============ NAVIGATION ============
function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${
        active
          ? 'bg-deriva-accent/10 text-deriva-accent border border-deriva-accent/30'
          : 'text-deriva-muted hover:text-deriva-text hover:bg-white/5'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ============ HOME PAGE ============
function HomePage({ onStartDeriva, config }: { onStartDeriva: () => void; config: DerivaConfig }) {
  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-6 animate-float">◉</div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-gradient">
          Teoria da Deriva
        </h1>
        <p className="text-deriva-muted text-lg max-w-2xl mx-auto leading-relaxed">
          "A deriva é um modo de comportamento experimental ligado às condições da sociedade urbana urbana: 
          técnica do trânsito passageiro em uma ambiência variável."
        </p>
        <p className="text-deriva-muted/60 text-sm mt-2 italic">— Guy Debord, 1956</p>
      </div>

      {/* Conceito */}
      <div className="glass-card p-6 sm:p-8 mb-8 glow-accent">
        <h2 className="text-xl font-serif font-bold mb-4 text-deriva-accent">O que é a Deriva?</h2>
        <div className="space-y-3 text-deriva-text/80 leading-relaxed text-sm sm:text-base">
          <p>
            A <strong className="text-deriva-text">deriva urbana</strong> é uma prática de exploração sem destino fixo, 
            onde o caminhante se deixa levar pelas psicogeografia do ambiente — os atrativos do terreno, 
            as correntes invisíveis da cidade, os encontros inesperados.
          </p>
          <p>
            Diferente do passeio ou da caminhada com propósito, a deriva abandona as razões habituais 
            de deslocamento (trabalho, lazer, obrigação) e se entrega ao <em className="text-deriva-accent">arrastamento</em> 
            pelo espaço urbano.
          </p>
          <p>
            Os <strong className="text-deriva-text">prompts</strong> desta aplicação funcionam como <em className="text-deriva-accent">situações construídas</em> — 
            dispositivos que quebram a rotina perceptiva e abrem novas possibilidades de experiência na cidade.
          </p>
        </div>
      </div>

      {/* Categorias */}
      <div className="glass-card p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-serif font-bold mb-4 text-deriva-accent2">Modos de Deriva</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-deriva-border/50">
              <span className="text-xl">{cat.icon}</span>
              <div>
                <div className="text-sm font-medium">{cat.label}</div>
                <div className="text-xs text-deriva-muted">
                  {prompts.filter(p => p.category === cat.id).length} prompts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats.totalDerivas > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-serif font-bold mb-4 text-deriva-success">Suas Derivas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox value={stats.totalDerivas} label="Derivas" />
            <StatBox value={stats.totalPrompts} label="Prompts seguidos" />
            <StatBox value={`${Math.round(stats.totalMinutos / 60)}h`} label="Tempo total" />
            <StatBox value={stats.mediaHumor} label="Humor médio" />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStartDeriva}
          className="px-8 py-4 bg-gradient-to-r from-deriva-accent to-deriva-accent2 text-black font-bold rounded-xl text-lg hover:opacity-90 transition-all glow-accent"
        >
          Iniciar Deriva →
        </button>
        <p className="text-deriva-muted text-sm mt-3">
          {config.nomeDerivante !== 'Derivante' ? `Boa caminhada, ${config.nomeDerivante}.` : 'A cidade espera.'}
        </p>
      </div>

      {/* Manifesto */}
      <div className="mt-16 text-center border-t border-deriva-border/30 pt-8">
        <p className="text-deriva-muted/50 text-xs italic max-w-lg mx-auto">
          "Nada de novo na arte ou na poesia pode ser verdadeiramente buscado sem uma exploração 
          prática dos possíveis caminhos da vida." — Situacionismo
        </p>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-white/[0.02]">
      <div className="text-2xl font-bold text-gradient">{value}</div>
      <div className="text-xs text-deriva-muted mt-1">{label}</div>
    </div>
  );
}

// ============ DERIVA PAGE ============
function DerivaPage({ derivaAtiva, setDerivaAtiva, onSave, config }: {
  derivaAtiva: DerivaCompleta | null;
  setDerivaAtiva: (d: DerivaCompleta | null) => void;
  onSave: (d: DerivaCompleta) => void;
  config: DerivaConfig;
}) {
  const [currentPrompts, setCurrentPrompts] = useState<Prompt[]>([]);
  const [usedPromptIds, setUsedPromptIds] = useState<number[]>([]);
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [notas, setNotas] = useState('');
  const [humor, setHumor] = useState(3);
  const [clima, setClima] = useState('');
  const [localInicio, setLocalInicio] = useState('');
  const [descobertas, setDescobertas] = useState<string[]>([]);
  const [novaDescoberta, setNovaDescoberta] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [showFinish, setShowFinish] = useState(false);

  const iniciarDeriva = useCallback(() => {
    const id = generateId();
    const now = new Date().toISOString();
    const novaDeriva: DerivaCompleta = {
      id,
      data_inicio: now,
      data_fim: null,
      duracao: null,
      local_inicio: '',
      local_fim: null,
      notas: '',
      humor: 3,
      clima: '',
      distancia: null,
      promptsSeguidos: [],
      descobertas: [],
    };
    setDerivaAtiva(novaDeriva);
    setStartTime(now);
    const initialPrompts = getRandomPrompts(5);
    setCurrentPrompts(initialPrompts);
    setUsedPromptIds(initialPrompts.map(p => p.id));
  }, [setDerivaAtiva]);

  const adicionarPrompt = () => {
    const newPrompt = selectedCategory
      ? getRandomPromptByCategory(selectedCategory)
      : getRandomPrompt(usedPromptIds);
    setCurrentPrompts(prev => [...prev, newPrompt]);
    setUsedPromptIds(prev => [...prev, newPrompt.id]);
  };

  const seguirPrompt = (prompt: Prompt) => {
    if (!derivaAtiva) return;
    const updated = {
      ...derivaAtiva,
      promptsSeguidos: [...derivaAtiva.promptsSeguidos, {
        promptId: prompt.id,
        promptText: prompt.text,
        timestamp: new Date().toISOString(),
      }],
    };
    setDerivaAtiva(updated);
    // Substituir o prompt usado por um novo
    const newPrompt = selectedCategory
      ? getRandomPromptByCategory(selectedCategory)
      : getRandomPrompt(usedPromptIds);
    setCurrentPrompts(prev => prev.map(p => p.id === prompt.id ? newPrompt : p));
    setUsedPromptIds(prev => [...prev, newPrompt.id]);
  };

  const adicionarDescoberta = () => {
    if (novaDescoberta.trim()) {
      setDescobertas(prev => [...prev, novaDescoberta.trim()]);
      setNovaDescoberta('');
    }
  };

  const finalizarDeriva = () => {
    if (!derivaAtiva) return;
    const endTime = new Date();
    const start = new Date(derivaAtiva.data_inicio);
    const duracao = Math.round((endTime.getTime() - start.getTime()) / 60000);

    const finalDeriva: DerivaCompleta = {
      ...derivaAtiva,
      data_fim: endTime.toISOString(),
      duracao,
      notas,
      humor,
      clima,
      local_inicio: localInicio,
      descobertas,
    };
    onSave(finalDeriva);
    setDerivaAtiva(null);
    setShowFinish(false);
    setCurrentPrompts([]);
    setUsedPromptIds([]);
    setNotas('');
    setHumor(3);
    setClima('');
    setLocalInicio('');
    setDescobertas([]);
  };

  // Tela de início da deriva
  if (!derivaAtiva) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⟐</div>
          <h1 className="text-3xl font-serif font-bold text-gradient mb-2">Iniciar Deriva</h1>
          <p className="text-deriva-muted">Abandone o propósito. Entregue-se ao arrastamento.</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <label className="block text-sm text-deriva-muted mb-2">Onde você está? (opcional)</label>
          <input
            type="text"
            value={localInicio}
            onChange={e => setLocalInicio(e.target.value)}
            placeholder="Ex: Praça da Sé, São Paulo"
            className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-3 text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50 transition-colors"
          />
        </div>

        <div className="glass-card p-6 mb-6">
          <label className="block text-sm text-deriva-muted mb-3">Filtrar por categoria (opcional)</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                !selectedCategory ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent hover:border-deriva-border'
              }`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  selectedCategory === cat.id ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent hover:border-deriva-border'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={iniciarDeriva}
            className="px-8 py-4 bg-gradient-to-r from-deriva-accent to-deriva-accent2 text-black font-bold rounded-xl text-lg hover:opacity-90 transition-all glow-accent"
          >
            Começar a Derivar ◉
          </button>
        </div>

        <div className="mt-12 glass-card p-6">
          <h3 className="text-sm font-bold text-deriva-accent mb-3">Princípios da Deriva (Debord)</h3>
          <ul className="space-y-2 text-sm text-deriva-muted">
            <li>• A deriva se pratica em grupos de 2-3 pessoas que se influenciam mutuamente</li>
            <li>• A duração média é de um dia inteiro</li>
            <li>• O derivante abandona as razões de se deslocar (trabalho, lazer)</li>
            <li>• As psicogeografia revelam linhas de força da cidade</li>
            <li>• Cada deriva é única e irrepetível</li>
          </ul>
        </div>
      </div>
    );
  }

  // Tela durante a deriva
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header da deriva ativa */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-serif font-bold text-gradient">Deriva em Curso</h1>
          <p className="text-xs text-deriva-muted mt-1">
            {derivaAtiva.promptsSeguidos.length} prompts seguidos • {startTime ? formatTimeSince(startTime) : ''}
          </p>
        </div>
        <button
          onClick={() => setShowFinish(true)}
          className="px-4 py-2 bg-deriva-success/10 text-deriva-success border border-deriva-success/30 rounded-lg text-sm hover:bg-deriva-success/20 transition-colors"
        >
          Finalizar ✓
        </button>
      </div>

      {/* Prompts */}
      <div className="space-y-3 mb-8">
        {currentPrompts.map((prompt, index) => (
          <div key={`${prompt.id}-${index}`} className="prompt-card glass-card p-4 flex items-start gap-3 animate-slide-up">
            <span className="text-lg mt-0.5">{categories.find(c => c.id === prompt.category)?.icon || '◉'}</span>
            <div className="flex-1">
              <p className="text-deriva-text text-sm leading-relaxed">{prompt.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-deriva-muted px-2 py-0.5 rounded-full bg-white/5">
                  {categories.find(c => c.id === prompt.category)?.label}
                </span>
                <button
                  onClick={() => seguirPrompt(prompt)}
                  className="text-xs px-3 py-1 bg-deriva-accent/10 text-deriva-accent rounded-full hover:bg-deriva-accent/20 transition-colors border border-deriva-accent/20"
                >
                  Segui este →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adicionar mais prompts */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={adicionarPrompt}
          className="flex-1 py-3 bg-white/5 border border-deriva-border rounded-lg text-sm text-deriva-text hover:bg-white/10 transition-colors"
        >
          + Novo Prompt Aleatório
        </button>
        <button
          onClick={() => setShowAllPrompts(!showAllPrompts)}
          className="px-4 py-3 bg-white/5 border border-deriva-border rounded-lg text-sm text-deriva-muted hover:text-deriva-text transition-colors"
        >
          ▤
        </button>
      </div>

      {/* Todos os prompts */}
      {showAllPrompts && (
        <div className="glass-card p-4 mb-8 max-h-60 overflow-y-auto animate-slide-up">
          <h3 className="text-sm font-bold text-deriva-muted mb-3">Todos os Prompts ({prompts.length})</h3>
          <div className="space-y-2">
            {prompts.map(p => (
              <button
                key={p.id}
                onClick={() => seguirPrompt(p)}
                className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-deriva-text/70 hover:text-deriva-text"
              >
                {categories.find(c => c.id === p.category)?.icon} {p.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descobertas */}
      <div className="glass-card p-4 mb-6">
        <h3 className="text-sm font-bold text-deriva-accent2 mb-3">✍️ Descobertas no Caminho</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={novaDescoberta}
            onChange={e => setNovaDescoberta(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && adicionarDescoberta()}
            placeholder="O que você encontrou?"
            className="flex-1 bg-white/5 border border-deriva-border rounded-lg px-3 py-2 text-sm text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50"
          />
          <button
            onClick={adicionarDescoberta}
            className="px-3 py-2 bg-deriva-accent2/10 text-deriva-accent2 rounded-lg text-sm hover:bg-deriva-accent2/20 transition-colors"
          >
            +
          </button>
        </div>
        {descobertas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {descobertas.map((d, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 rounded-full text-xs text-deriva-text/70 border border-deriva-border/50">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modal de finalização */}
      {showFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card p-6 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-gradient mb-4">Finalizar Deriva</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-deriva-muted block mb-1">Como está seu humor? (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setHumor(n)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        humor === n ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-deriva-muted block mb-1">Clima</label>
                <div className="flex flex-wrap gap-2">
                  {['☀️ Sol', '⛅ Nublado', '🌧️ Chuva', '🌫️ Neblina', '🌬️ Vento', '❄️ Frio'].map(c => (
                    <button
                      key={c}
                      onClick={() => setClima(c)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        clima === c ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-deriva-muted block mb-1">Notas da deriva</label>
                <textarea
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  placeholder="O que esta deriva revelou? Sensações, pensamentos, encontros..."
                  className="w-full bg-white/5 border border-deriva-border rounded-lg px-3 py-2 text-sm text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50 min-h-[100px] resize-y"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowFinish(false)}
                  className="flex-1 py-3 bg-white/5 border border-deriva-border rounded-lg text-sm text-deriva-muted hover:text-deriva-text transition-colors"
                >
                  Continuar
                </button>
                <button
                  onClick={finalizarDeriva}
                  className="flex-1 py-3 bg-deriva-success/10 text-deriva-success border border-deriva-success/30 rounded-lg text-sm font-bold hover:bg-deriva-success/20 transition-colors"
                >
                  Salvar Deriva ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ HISTÓRICO PAGE ============
function HistoricoPage({ derivas, onDelete, onUpdate, stats }: { 
  derivas: DerivaCompleta[]; 
  onDelete: (id: string) => void;
  onUpdate: (deriva: DerivaCompleta) => void;
  stats: ReturnType<typeof getStats> 
}) {
  const [selectedDeriva, setSelectedDeriva] = useState<DerivaCompleta | null>(null);
  const [editingDeriva, setEditingDeriva] = useState<DerivaCompleta | null>(null);
  const [showExport, setShowExport] = useState(false);

  const handleExport = () => {
    const data = exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `derivas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const result = await importDatabase(ev.target?.result as string);
          if (result) {
            window.location.reload();
          } else {
            alert('Erro ao importar dados.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta deriva? Esta ação não pode ser desfeita.')) {
      await onDelete(id);
      setSelectedDeriva(null);
    }
  };

  const handleUpdate = async () => {
    if (editingDeriva) {
      await onUpdate(editingDeriva);
      setEditingDeriva(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gradient">Histórico de Derivas</h1>
          <p className="text-deriva-muted text-sm mt-1">{derivas.length} deriva{derivas.length !== 1 ? 's' : ''} registrada{derivas.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="px-3 py-2 bg-white/5 border border-deriva-border rounded-lg text-xs text-deriva-muted hover:text-deriva-text transition-colors">
            ↓ Exportar
          </button>
          <button onClick={handleImport} className="px-3 py-2 bg-white/5 border border-deriva-border rounded-lg text-xs text-deriva-muted hover:text-deriva-text transition-colors">
            ↑ Importar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <StatBox value={stats.totalDerivas} label="Derivas" />
        <StatBox value={stats.totalPrompts} label="Prompts" />
        <StatBox value={`${Math.round(stats.totalMinutos / 60)}h`} label="Tempo" />
        <StatBox value={stats.mediaHumor} label="Humor" />
        <StatBox value={stats.totalDescobertas} label="Descobertas" />
      </div>

      {/* Lista */}
      {derivas.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">◉</div>
          <p className="text-deriva-muted">Nenhuma deriva registrada ainda.</p>
          <p className="text-deriva-muted/50 text-sm mt-2">Saia e comece a caminhar sem rumo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {derivas.map(deriva => (
            <div
              key={deriva.id}
              className="glass-card p-4 hover:border-deriva-accent/30 transition-all cursor-pointer"
              onClick={() => setSelectedDeriva(deriva)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-deriva-text">
                      {new Date(deriva.data_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {deriva.clima && <span className="text-xs">{deriva.clima}</span>}
                  </div>
                  {deriva.local_inicio && (
                    <p className="text-xs text-deriva-muted">{deriva.local_inicio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-deriva-muted">
                      {deriva.promptsSeguidos.length} prompts
                    </span>
                    {deriva.duracao && (
                      <span className="text-xs text-deriva-muted">
                        {deriva.duracao} min
                      </span>
                    )}
                    <span className="text-xs text-deriva-muted">
                      Humor: {'●'.repeat(deriva.humor)}{'○'.repeat(5 - deriva.humor)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(deriva.id); }}
                  className="p-2 text-deriva-muted/30 hover:text-deriva-danger transition-colors"
                >
                  ✕
                </button>
              </div>
              {deriva.notas && (
                <p className="text-xs text-deriva-muted/70 mt-2 line-clamp-2 italic">"{deriva.notas}"</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedDeriva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedDeriva(null)}>
          <div className="glass-card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-gradient">Detalhes da Deriva</h2>
              <button onClick={() => setSelectedDeriva(null)} className="text-deriva-muted hover:text-deriva-text">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-deriva-muted">{new Date(selectedDeriva.data_inicio).toLocaleString('pt-BR')}</span>
                {selectedDeriva.clima && <span>{selectedDeriva.clima}</span>}
              </div>

              {selectedDeriva.local_inicio && (
                <div>
                  <span className="text-xs text-deriva-muted block mb-1">Início</span>
                  <p className="text-sm text-deriva-text">{selectedDeriva.local_inicio}</p>
                </div>
              )}

              {selectedDeriva.duracao && (
                <div>
                  <span className="text-xs text-deriva-muted block mb-1">Duração</span>
                  <p className="text-sm text-deriva-text">{selectedDeriva.duracao} minutos</p>
                </div>
              )}

              <div>
                <span className="text-xs text-deriva-muted block mb-1">Humor</span>
                <p className="text-lg">{'●'.repeat(selectedDeriva.humor)}{'○'.repeat(5 - selectedDeriva.humor)}</p>
              </div>

              {selectedDeriva.promptsSeguidos.length > 0 && (
                <div>
                  <span className="text-xs text-deriva-muted block mb-2">Prompts Seguidos ({selectedDeriva.promptsSeguidos.length})</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedDeriva.promptsSeguidos.map((p, i) => (
                      <div key={i} className="text-xs text-deriva-text/70 p-2 bg-white/[0.02] rounded-lg">
                        {p.promptText}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDeriva.descobertas.length > 0 && (
                <div>
                  <span className="text-xs text-deriva-muted block mb-2">Descobertas</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeriva.descobertas.map((d, i) => (
                      <span key={i} className="px-2 py-1 bg-deriva-accent2/10 text-deriva-accent2 rounded-full text-xs">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDeriva.notas && (
                <div>
                  <span className="text-xs text-deriva-muted block mb-1">Notas</span>
                  <p className="text-sm text-deriva-text/80 italic leading-relaxed">"{selectedDeriva.notas}"</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingDeriva(selectedDeriva);
                    setSelectedDeriva(null);
                  }}
                  className="flex-1 py-2.5 bg-deriva-accent/10 text-deriva-accent border border-deriva-accent/30 rounded-lg text-sm hover:bg-deriva-accent/20 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(selectedDeriva.id)}
                  className="flex-1 py-2.5 bg-deriva-danger/10 text-deriva-danger border border-deriva-danger/30 rounded-lg text-sm hover:bg-deriva-danger/20 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editingDeriva && (
        <EditDerivaModal
          deriva={editingDeriva}
          onSave={handleUpdate}
          onClose={() => setEditingDeriva(null)}
        />
      )}
    </div>
  );
}

// ============ EDIT DERIVA MODAL ============
function EditDerivaModal({ deriva, onSave, onClose }: {
  deriva: DerivaCompleta;
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DerivaCompleta>(deriva);
  const [novaDescoberta, setNovaDescoberta] = useState('');

  const handleAddDescoberta = () => {
    if (novaDescoberta.trim()) {
      setForm({
        ...form,
        descobertas: [...form.descobertas, novaDescoberta.trim()]
      });
      setNovaDescoberta('');
    }
  };

  const handleRemoveDescoberta = (index: number) => {
    setForm({
      ...form,
      descobertas: form.descobertas.filter((_, i) => i !== index)
    });
  };

  const handleRemovePrompt = (index: number) => {
    setForm({
      ...form,
      promptsSeguidos: form.promptsSeguidos.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-gradient">Editar Deriva</h2>
          <button onClick={onClose} className="text-deriva-muted hover:text-deriva-text text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-deriva-muted block mb-1">Local de início</label>
            <input
              type="text"
              value={form.local_inicio || ''}
              onChange={e => setForm({ ...form, local_inicio: e.target.value })}
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-2.5 text-sm text-deriva-text focus:outline-none focus:border-deriva-accent/50"
            />
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-1">Local de fim</label>
            <input
              type="text"
              value={form.local_fim || ''}
              onChange={e => setForm({ ...form, local_fim: e.target.value })}
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-2.5 text-sm text-deriva-text focus:outline-none focus:border-deriva-accent/50"
            />
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-1">Duração (minutos)</label>
            <input
              type="number"
              value={form.duracao || ''}
              onChange={e => setForm({ ...form, duracao: parseInt(e.target.value) || null })}
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-2.5 text-sm text-deriva-text focus:outline-none focus:border-deriva-accent/50"
            />
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-1">Humor (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, humor: n })}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    form.humor === n ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-1">Clima</label>
            <div className="flex flex-wrap gap-2">
              {['☀️ Sol', '⛅ Nublado', '🌧️ Chuva', '🌫️ Neblina', '🌬️ Vento', '❄️ Frio'].map(c => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, clima: c })}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    form.clima === c ? 'bg-deriva-accent/20 text-deriva-accent border border-deriva-accent/40' : 'bg-white/5 text-deriva-muted border border-transparent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-1">Notas</label>
            <textarea
              value={form.notas || ''}
              onChange={e => setForm({ ...form, notas: e.target.value })}
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-2.5 text-sm text-deriva-text focus:outline-none focus:border-deriva-accent/50 min-h-[100px] resize-y"
            />
          </div>

          <div>
            <label className="text-xs text-deriva-muted block mb-2">Descobertas ({form.descobertas.length})</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={novaDescoberta}
                onChange={e => setNovaDescoberta(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddDescoberta()}
                placeholder="Adicionar descoberta"
                className="flex-1 bg-white/5 border border-deriva-border rounded-lg px-3 py-2 text-sm text-deriva-text focus:outline-none focus:border-deriva-accent/50"
              />
              <button
                onClick={handleAddDescoberta}
                className="px-3 py-2 bg-deriva-accent2/10 text-deriva-accent2 rounded-lg text-sm hover:bg-deriva-accent2/20"
              >
                +
              </button>
            </div>
            {form.descobertas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.descobertas.map((d, i) => (
                  <div key={i} className="flex items-center gap-1 px-2 py-1 bg-deriva-accent2/10 rounded-full text-xs">
                    <span className="text-deriva-accent2">{d}</span>
                    <button
                      onClick={() => handleRemoveDescoberta(i)}
                      className="text-deriva-accent2/50 hover:text-deriva-accent2 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {form.promptsSeguidos.length > 0 && (
            <div>
              <label className="text-xs text-deriva-muted block mb-2">Prompts Seguidos ({form.promptsSeguidos.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {form.promptsSeguidos.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-white/[0.02] rounded-lg">
                    <span className="flex-1 text-xs text-deriva-text/70">{p.promptText}</span>
                    <button
                      onClick={() => handleRemovePrompt(i)}
                      className="text-deriva-muted/50 hover:text-deriva-danger text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 border border-deriva-border rounded-lg text-sm text-deriva-muted hover:text-deriva-text transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-deriva-success/10 text-deriva-success border border-deriva-success/30 rounded-lg text-sm font-bold hover:bg-deriva-success/20 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CONFIG PAGE ============
function ConfigPage({ config, onSave }: { config: DerivaConfig; onSave: (c: DerivaConfig) => void }) {
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza? Isso apagará TODAS as derivas registradas. Esta ação é irreversível.')) {
      indexedDB.deleteDatabase('derivas_urbanas');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-2xl font-serif font-bold text-gradient mb-8">Configurações</h1>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-deriva-text mb-4">Perfil do Derivante</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-deriva-muted block mb-1">Nome</label>
            <input
              type="text"
              value={form.nomeDerivante}
              onChange={e => setForm({ ...form, nomeDerivante: e.target.value })}
              placeholder="Seu nome ou pseudônimo"
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-3 text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-deriva-muted block mb-1">Cidade base</label>
            <input
              type="text"
              value={form.cidadeBase}
              onChange={e => setForm({ ...form, cidadeBase: e.target.value })}
              placeholder="Sua cidade principal"
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-3 text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-deriva-muted block mb-1">Tema preferido</label>
            <input
              type="text"
              value={form.temaPreferido}
              onChange={e => setForm({ ...form, temaPreferido: e.target.value })}
              placeholder="Ex: arquitetura, pessoas, sons..."
              className="w-full bg-white/5 border border-deriva-border rounded-lg px-4 py-3 text-deriva-text placeholder:text-deriva-muted/50 focus:outline-none focus:border-deriva-accent/50 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            saved ? 'bg-deriva-success/20 text-deriva-success border border-deriva-success/30' : 'bg-deriva-accent/10 text-deriva-accent border border-deriva-accent/30 hover:bg-deriva-accent/20'
          }`}
        >
          {saved ? '✓ Salvo!' : 'Salvar'}
        </button>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-deriva-text mb-2">Sobre</h2>
        <div className="space-y-2 text-sm text-deriva-muted">
          <p><strong className="text-deriva-text">Deriva</strong> — v1.0</p>
          <p>Aplicação pessoal para prática de deriva urbana situacionista.</p>
          <p>Inspirado em "Théorie de la Dérive" de Guy Debord (1956).</p>
          <p className="text-xs mt-4 text-deriva-muted/50">
            Dados armazenados em SQLite (via IndexedDB).<br/>
            Use Exportar/Importar no Histórico para backup.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 border-deriva-danger/20">
        <h2 className="text-lg font-bold text-deriva-danger mb-2">Zona de Perigo</h2>
        <p className="text-sm text-deriva-muted mb-4">Apagar todos os dados registrados.</p>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-deriva-danger/10 text-deriva-danger border border-deriva-danger/30 rounded-lg text-sm hover:bg-deriva-danger/20 transition-colors"
        >
          Apagar Tudo
        </button>
      </div>
    </div>
  );
}

// ============ UTILS ============
function formatTimeSince(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diff = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diff < 1) return 'agora';
  if (diff < 60) return `${diff} min`;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hours}h ${mins}min`;
}

export default App;
