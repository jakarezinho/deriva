// Estado global
let derivaAtiva = null;
let currentPrompts = [];
let usedPromptIds = [];
let selectedCategory = '';
let descobertas = [];
let humor = 3;
let clima = '';
let startTime = '';
let localizacaoAtual = null;
let mapa = null;
let markers = [];
let watchId = null;

// Chave para localStorage
const DERIVA_ATIVA_KEY = 'deriva_ativa';

// ============ PERSISTÊNCIA LOCAL ============

function salvarEstadoDeriva() {
  if (!derivaAtiva) {
    localStorage.removeItem(DERIVA_ATIVA_KEY);
    return;
  }
  
  const estado = {
    derivaAtiva,
    currentPrompts,
    usedPromptIds,
    selectedCategory,
    descobertas,
    humor,
    clima,
    startTime,
    pontosTrajeto,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(DERIVA_ATIVA_KEY, JSON.stringify(estado));
    console.log('Estado da deriva guardado no localStorage');
  } catch (error) {
    console.error('Erro ao guardar estado da deriva:', error);
  }
}

function restaurarEstadoDeriva() {
  try {
    const estadoStr = localStorage.getItem(DERIVA_ATIVA_KEY);
    if (!estadoStr) return false;
    
    const estado = JSON.parse(estadoStr);
    
    // Verificar se o estado não é muito antigo (mais de 24 horas)
    const idade = Date.now() - estado.timestamp;
    const horas = idade / (1000 * 60 * 60);
    
    if (horas > 24) {
      console.log('Estado da deriva muito antigo, ignorando');
      localStorage.removeItem(DERIVA_ATIVA_KEY);
      return false;
    }
    
    // Restaurar estado
    derivaAtiva = estado.derivaAtiva;
    currentPrompts = estado.currentPrompts || [];
    usedPromptIds = estado.usedPromptIds || [];
    selectedCategory = estado.selectedCategory || '';
    descobertas = estado.descobertas || [];
    humor = estado.humor || 3;
    clima = estado.clima || '';
    startTime = estado.startTime || '';
    pontosTrajeto = estado.pontosTrajeto || [];
    
    console.log('Estado da deriva restaurado do localStorage');
    return true;
  } catch (error) {
    console.error('Erro ao restaurar estado da deriva:', error);
    localStorage.removeItem(DERIVA_ATIVA_KEY);
    return false;
  }
}

function limparEstadoDeriva() {
  localStorage.removeItem(DERIVA_ATIVA_KEY);
  console.log('Estado da deriva limpo do localStorage');
}

// API
const API_URL = 'api/derivas.php';

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
});

async function initApp() {
  try {
    // Testar API
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API não disponível');
    
    // Verificar se existe uma deriva em curso no localStorage
    const temDerivaRestaurada = restaurarEstadoDeriva();
    
    if (temDerivaRestaurada) {
      console.log('Deriva em curso encontrada, restaurando...');
      // Mostrar interface de deriva ativa
      document.getElementById('deriva-start').style.display = 'none';
      document.getElementById('deriva-active').style.display = 'block';
      
      // Restaurar UI
      renderPrompts();
      renderDescobertas();
      updateDerivaInfo();
      
      // Reiniciar geolocalização
      iniciarGeolocalizacao();
      
      // Mostrar notificação
      setTimeout(() => {
        alert('Deriva anterior restaurada! Pode continuar a sua deriva.');
      }, 500);
    }
    
    // Carregar dados
    await loadConfig();
    await loadDerivas();
    await loadStats();
    
    // Renderizar categorias
    renderCategories();
    renderFilterButtons();
    renderHumorButtons();
    renderClimaButtons();
    
    // Configurar Page Visibility API
    configurarPageVisibility();
    
    // Esconder loading
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error('Erro ao inicializar:', error);
    document.getElementById('loading').innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <p style="color: #f87171; margin-bottom: 0.5rem;">Erro ao conectar à API</p>
        <p style="color: #6b6b80; font-size: 0.875rem; margin-bottom: 1rem;">${error.message}</p>
        <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: rgba(192, 132, 252, 0.1); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 0.5rem; cursor: pointer;">Tentar novamente</button>
      </div>
    `;
  }
}

// Page Visibility API - guardar estado quando a página fica invisível
function configurarPageVisibility() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && derivaAtiva) {
      console.log('Página ficou invisível, guardando estado da deriva...');
      salvarEstadoDeriva();
    }
  });
  
  // Também guardar antes de fechar a página
  window.addEventListener('beforeunload', () => {
    if (derivaAtiva) {
      salvarEstadoDeriva();
    }
  });
}

// Abandonar deriva sem salvar
function abandonarDeriva() {
  if (confirm('Tem certeza que deseja abandonar esta deriva? Todos os dados serão perdidos.')) {
    // Parar geolocalização
    pararGeolocalizacao();
    
    // Limpar estado
    derivaAtiva = null;
    currentPrompts = [];
    usedPromptIds = [];
    descobertas = [];
    humor = 3;
    clima = '';
    pontosTrajeto = [];
    
    // Limpar localStorage
    limparEstadoDeriva();
    
    // Resetar UI
    document.getElementById('deriva-start').style.display = 'block';
    document.getElementById('deriva-active').style.display = 'none';
    document.getElementById('notas-deriva').value = '';
  }
}

// Navegação
function showPage(page) {
  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Mostrar página selecionada
  document.getElementById(`page-${page}`).classList.add('active');
  
  // Atualizar botões de navegação
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === page) {
      btn.classList.add('active');
    }
  });
  
  // Scroll para o topo
  window.scrollTo(0, 0);
  
  // Atualizar conteúdo específico
  if (page === 'historico') {
    loadDerivas();
    loadStats();
  } else if (page === 'mapa') {
    setTimeout(() => initMapa(), 100);
  }
}

// Config
async function loadConfig() {
  try {
    const response = await fetch(`${API_URL}?config=1`);
    const config = await response.json();
    
    document.getElementById('config-nome').value = config.nomeDerivante || '';
    document.getElementById('config-cidade').value = config.cidadeBase || '';
    document.getElementById('config-tema').value = config.temaPreferido || '';
    
    // Atualizar CTA
    if (config.nomeDerivante && config.nomeDerivante !== 'Derivante') {
      document.getElementById('cta-text').textContent = `Boa caminhada, ${config.nomeDerivante}.`;
    }
  } catch (error) {
    console.error('Erro ao carregar config:', error);
  }
}

async function salvarConfig() {
  const config = {
    nomeDerivante: document.getElementById('config-nome').value,
    cidadeBase: document.getElementById('config-cidade').value,
    temaPreferido: document.getElementById('config-tema').value
  };
  
  try {
    const response = await fetch(`${API_URL}?config=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (response.ok) {
      alert('Configurações salvas!');
      await loadConfig();
    } else {
      throw new Error('Erro ao salvar');
    }
  } catch (error) {
    alert('Erro ao salvar configurações: ' + error.message);
  }
}

// Derivas
async function loadDerivas() {
  try {
    const response = await fetch(API_URL);
    const derivas = await response.json();
    
    document.getElementById('total-derivas').textContent = `${derivas.length} deriva${derivas.length !== 1 ? 's' : ''} registrada${derivas.length !== 1 ? 's' : ''}`;
    
    const container = document.getElementById('historico-list');
    
    if (derivas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">◉</div>
          <p class="empty-text">Nenhuma deriva registrada ainda.</p>
          <p class="empty-subtext">Saia e comece a caminhar sem rumo.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = derivas.map(deriva => `
      <div class="historico-item" onclick="showDetalhes('${deriva.id}')">
        <div class="historico-header">
          <div>
            <div class="historico-date">
              ${formatDate(deriva.data_inicio)}
              ${deriva.clima ? `<span class="historico-clima">${deriva.clima}</span>` : ''}
            </div>
            ${deriva.local_inicio ? `<p class="historico-local">${deriva.local_inicio}</p>` : ''}
            <div class="historico-meta">
              <span>${deriva.promptsSeguidos.length} prompts</span>
              ${deriva.duracao ? `<span>${deriva.duracao} min</span>` : ''}
              ${deriva.distancia ? `<span>${deriva.distancia.toFixed(2)} km</span>` : ''}
              <span>Humor: ${'●'.repeat(deriva.humor)}${'○'.repeat(5 - deriva.humor)}</span>
            </div>
          </div>
          <button class="historico-delete" onclick="event.stopPropagation(); confirmarExclusao('${deriva.id}')">✕</button>
        </div>
        ${deriva.notas ? `<p class="historico-notas">"${deriva.notas}"</p>` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar derivas:', error);
  }
}

async function loadStats() {
  try {
    const response = await fetch(`${API_URL}?stats=1`);
    const stats = await response.json();
    
    // Stats do histórico
    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-box">
        <div class="stat-value">${stats.totalDerivas}</div>
        <div class="stat-label">Derivas</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.totalPrompts}</div>
        <div class="stat-label">Prompts</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${Math.round(stats.totalMinutos / 60)}h</div>
        <div class="stat-label">Tempo</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.mediaHumor}</div>
        <div class="stat-label">Humor</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.totalDescobertas}</div>
        <div class="stat-label">Descobertas</div>
      </div>
    `;
    
    // Stats da home
    if (stats.totalDerivas > 0) {
      document.getElementById('stats-home').style.display = 'block';
      document.getElementById('stats-grid-home').innerHTML = `
        <div class="stat-box">
          <div class="stat-value">${stats.totalDerivas}</div>
          <div class="stat-label">Derivas</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats.totalPrompts}</div>
          <div class="stat-label">Prompts seguidos</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${Math.round(stats.totalMinutos / 60)}h</div>
          <div class="stat-label">Tempo total</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${stats.mediaHumor}</div>
          <div class="stat-label">Humor médio</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erro ao carregar stats:', error);
  }
}

// Renderização
function renderCategories() {
  const container = document.getElementById('categories-grid');
  container.innerHTML = categories.map(cat => `
    <div class="category-item">
      <span class="category-icon">${cat.icon}</span>
      <div>
        <div class="category-label">${cat.label}</div>
        <div class="category-count">${prompts.filter(p => p.category === cat.id).length} prompts</div>
      </div>
    </div>
  `).join('');
}

function renderFilterButtons() {
  const container = document.getElementById('filter-buttons');
  container.innerHTML = `
    <button class="filter-btn ${!selectedCategory ? 'active' : ''}" onclick="selectCategory('')">Todas</button>
    ${categories.map(cat => `
      <button class="filter-btn ${selectedCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
        ${cat.icon} ${cat.label}
      </button>
    `).join('')}
  `;
}

function selectCategory(category) {
  selectedCategory = category;
  renderFilterButtons();
}

function renderHumorButtons() {
  const container = document.getElementById('humor-buttons');
  container.innerHTML = [1, 2, 3, 4, 5].map(n => `
    <button class="humor-btn ${humor === n ? 'active' : ''}" onclick="setHumor(${n})">${n}</button>
  `).join('');
}

function setHumor(value) {
  humor = value;
  renderHumorButtons();
}

function renderClimaButtons() {
  const climas = ['☀️ Sol', '⛅ Nublado', '🌧️ Chuva', '🌫️ Neblina', '🌬️ Vento', '❄️ Frio'];
  const container = document.getElementById('clima-buttons');
  container.innerHTML = climas.map(c => `
    <button class="clima-btn ${clima === c ? 'active' : ''}" onclick="setClima('${c}')">${c}</button>
  `).join('');
}

function setClima(value) {
  clima = value;
  renderClimaButtons();
}

// Deriva
async function iniciarDeriva() {
  derivaAtiva = {
    id: generateId(),
    data_inicio: new Date().toISOString(),
    promptsSeguidos: [],
    descobertas: []
  };
  
  startTime = derivaAtiva.data_inicio;
  currentPrompts = getRandomPrompts(5);
  usedPromptIds = currentPrompts.map(p => p.id);
  descobertas = [];
  
  // Iniciar geolocalização
  iniciarGeolocalizacao();
  
  // Capturar localização inicial
  const localizacaoInicio = await capturarLocalizacaoAtual();
  if (localizacaoInicio) {
    derivaAtiva.localizacao_inicio = localizacaoInicio;
  }
  
  // Guardar estado inicial
  salvarEstadoDeriva();
  
  // Mostrar interface de deriva ativa
  document.getElementById('deriva-start').style.display = 'none';
  document.getElementById('deriva-active').style.display = 'block';
  
  renderPrompts();
  updateDerivaInfo();
}

function renderPrompts() {
  const container = document.getElementById('prompts-container');
  container.innerHTML = currentPrompts.map((prompt, index) => {
    const cat = categories.find(c => c.id === prompt.category);
    return `
      <div class="prompt-card">
        <span class="prompt-icon">${cat ? cat.icon : '◉'}</span>
        <div class="prompt-content">
          <p class="prompt-text">${prompt.text}</p>
          <div class="prompt-meta">
            <span class="prompt-category">${cat ? cat.label : ''}</span>
            <button class="prompt-action" onclick="seguirPrompt(${prompt.id})">Segui este →</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function seguirPrompt(promptId) {
  const prompt = currentPrompts.find(p => p.id === promptId);
  if (!prompt || !derivaAtiva) return;
  
  // Adicionar aos prompts seguidos
  derivaAtiva.promptsSeguidos.push({
    promptId: prompt.id,
    promptText: prompt.text,
    timestamp: new Date().toISOString()
  });
  
  // Substituir por novo prompt
  const newPrompt = selectedCategory
    ? getRandomPromptByCategory(selectedCategory)
    : getRandomPrompt(usedPromptIds);
  
  currentPrompts = currentPrompts.map(p => p.id === promptId ? newPrompt : p);
  usedPromptIds.push(newPrompt.id);
  
  // Guardar estado após mudança
  salvarEstadoDeriva();
  
  renderPrompts();
  updateDerivaInfo();
}

function adicionarPrompt() {
  const newPrompt = selectedCategory
    ? getRandomPromptByCategory(selectedCategory)
    : getRandomPrompt(usedPromptIds);
  
  currentPrompts.push(newPrompt);
  usedPromptIds.push(newPrompt.id);
  
  renderPrompts();
}

function toggleAllPrompts() {
  const container = document.getElementById('all-prompts');
  const isVisible = container.style.display !== 'none';
  
  if (!isVisible) {
    const listContainer = document.getElementById('all-prompts-list');
    listContainer.innerHTML = prompts.map(p => {
      const cat = categories.find(c => c.id === p.category);
      return `
        <button class="all-prompt-item" onclick="seguirPrompt(${p.id})">
          ${cat ? cat.icon : '◉'} ${p.text}
        </button>
      `;
    }).join('');
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

function adicionarDescoberta() {
  const input = document.getElementById('nova-descoberta');
  const text = input.value.trim();
  
  if (text) {
    descobertas.push(text);
    input.value = '';
    // Guardar estado após mudança
    salvarEstadoDeriva();
    renderDescobertas();
  }
}

function renderDescobertas() {
  const container = document.getElementById('descobertas-list');
  container.innerHTML = descobertas.map(d => `
    <span class="descoberta-tag">${d}</span>
  `).join('');
}

function updateDerivaInfo() {
  const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000);
  document.getElementById('deriva-info').textContent = 
    `${derivaAtiva.promptsSeguidos.length} prompts seguidos • ${elapsed} min`;
}

// Finalizar deriva
function showFinishModal() {
  document.getElementById('modal-finish').style.display = 'flex';
}

function closeFinishModal() {
  document.getElementById('modal-finish').style.display = 'none';
}

async function finalizarDeriva() {
  if (!derivaAtiva) return;
  
  const endTime = new Date();
  const start = new Date(derivaAtiva.data_inicio);
  const duracao = Math.round((endTime.getTime() - start.getTime()) / 60000);
  
  const notas = document.getElementById('notas-deriva').value;
  const localInicio = document.getElementById('local-inicio').value;
  
  // Parar geolocalização
  pararGeolocalizacao();
  
  // Capturar localização final
  const localizacaoFim = await capturarLocalizacaoAtual();
  
  // Salvar último ponto do trajeto se existir
  if (localizacaoAtual && derivaAtiva) {
    await salvarPontoTrajeto(localizacaoAtual);
  }
  
  // Calcular distância total percorrida
  let distanciaTotal = 0;
  if (pontosTrajeto.length > 1) {
    for (let i = 1; i < pontosTrajeto.length; i++) {
      distanciaTotal += calcularDistancia(
        pontosTrajeto[i-1].lat,
        pontosTrajeto[i-1].lng,
        pontosTrajeto[i].lat,
        pontosTrajeto[i].lng
      );
    }
  }
  
  const derivaFinal = {
    ...derivaAtiva,
    data_fim: endTime.toISOString(),
    duracao,
    notas,
    humor,
    clima,
    local_inicio: localInicio,
    localizacao_fim: localizacaoFim,
    distancia: distanciaTotal > 0 ? distanciaTotal : null,
    descobertas
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(derivaFinal)
    });
    
    if (response.ok) {
      // Resetar estado
      derivaAtiva = null;
      currentPrompts = [];
      usedPromptIds = [];
      descobertas = [];
      humor = 3;
      clima = '';
      
      // Limpar estado do localStorage
      limparEstadoDeriva();
      
      // Resetar UI
      document.getElementById('deriva-start').style.display = 'block';
      document.getElementById('deriva-active').style.display = 'none';
      document.getElementById('notas-deriva').value = '';
      
      closeFinishModal();
      alert('Deriva salva com sucesso!');
      
      // Atualizar stats
      await loadStats();
    } else {
      throw new Error('Erro ao salvar');
    }
  } catch (error) {
    alert('Erro ao salvar deriva: ' + error.message);
  }
}

// Detalhes
async function showDetalhes(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`);
    const deriva = await response.json();
    
    const content = document.getElementById('detalhes-content');
    content.innerHTML = `
      <div class="detalhes-section">
        <span class="detalhes-label">Data</span>
        <p class="detalhes-value">${formatDate(deriva.data_inicio)} ${deriva.clima || ''}</p>
      </div>
      
      ${deriva.local_inicio ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Início</span>
          <p class="detalhes-value">${deriva.local_inicio}</p>
        </div>
      ` : ''}
      
      ${deriva.duracao ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Duração</span>
          <p class="detalhes-value">${deriva.duracao} minutos</p>
        </div>
      ` : ''}
      
      ${deriva.distancia ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Distância Percorrida</span>
          <p class="detalhes-value">${deriva.distancia.toFixed(2)} km</p>
        </div>
      ` : ''}
      
      ${deriva.trajeto && deriva.trajeto.length > 0 ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Pontos do Trajeto</span>
          <p class="detalhes-value">${deriva.trajeto.length} pontos registrados</p>
        </div>
      ` : ''}
      
      <div class="detalhes-section">
        <span class="detalhes-label">Humor</span>
        <p class="detalhes-value">${'●'.repeat(deriva.humor)}${'○'.repeat(5 - deriva.humor)}</p>
      </div>
      
      ${deriva.promptsSeguidos.length > 0 ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Prompts Seguidos (${deriva.promptsSeguidos.length})</span>
          <div class="detalhes-prompts">
            ${deriva.promptsSeguidos.map(p => `
              <div class="detalhes-prompt">${p.promptText}</div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${deriva.descobertas.length > 0 ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Descobertas</span>
          <div class="detalhes-descobertas">
            ${deriva.descobertas.map(d => `
              <span class="detalhes-descoberta">${d}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${deriva.notas ? `
        <div class="detalhes-section">
          <span class="detalhes-label">Notas</span>
          <p class="detalhes-notas">"${deriva.notas}"</p>
        </div>
      ` : ''}
      
      <div class="detalhes-actions">
        <button class="btn-primary" onclick="showEditModal('${deriva.id}')">Editar</button>
        <button class="btn-danger" onclick="confirmarExclusao('${deriva.id}')">Excluir</button>
      </div>
    `;
    
    document.getElementById('modal-detalhes').style.display = 'flex';
  } catch (error) {
    alert('Erro ao carregar detalhes: ' + error.message);
  }
}

function closeDetalhesModal() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

// Editar
async function showEditModal(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`);
    const deriva = await response.json();
    
    closeDetalhesModal();
    
    const content = document.getElementById('edit-content');
    content.innerHTML = `
      <form class="edit-form" onsubmit="salvarEdicao(event, '${deriva.id}')">
        <div class="form-group">
          <label class="label">Local de início</label>
          <input type="text" id="edit-local-inicio" value="${deriva.local_inicio || ''}" class="input">
        </div>
        
        <div class="form-group">
          <label class="label">Local de fim</label>
          <input type="text" id="edit-local-fim" value="${deriva.local_fim || ''}" class="input">
        </div>
        
        <div class="form-group">
          <label class="label">Duração (minutos)</label>
          <input type="number" id="edit-duracao" value="${deriva.duracao || ''}" class="input">
        </div>
        
        <div class="form-group">
          <label class="label">Distância percorrida (km)</label>
          <input type="number" step="0.01" id="edit-distancia" value="${deriva.distancia || ''}" class="input">
        </div>
        
        <div class="form-group">
          <label class="label">Humor (1-5)</label>
          <div class="humor-buttons" id="edit-humor-buttons">
            ${[1, 2, 3, 4, 5].map(n => `
              <button type="button" class="humor-btn ${deriva.humor === n ? 'active' : ''}" onclick="setEditHumor(${n})">${n}</button>
            `).join('')}
          </div>
        </div>
        
        <div class="form-group">
          <label class="label">Clima</label>
          <div class="clima-buttons" id="edit-clima-buttons">
            ${['☀️ Sol', '⛅ Nublado', '🌧️ Chuva', '🌫️ Neblina', '🌬️ Vento', '❄️ Frio'].map(c => `
              <button type="button" class="clima-btn ${deriva.clima === c ? 'active' : ''}" onclick="setEditClima('${c}')">${c}</button>
            `).join('')}
          </div>
        </div>
        
        <div class="form-group">
          <label class="label">Notas</label>
          <textarea id="edit-notas" class="textarea">${deriva.notas || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="label">Descobertas (${deriva.descobertas.length})</label>
          <div class="descobertas-input">
            <input type="text" id="edit-nova-descoberta" placeholder="Adicionar descoberta" class="input">
            <button type="button" class="btn-accent" onclick="addEditDescoberta()">+</button>
          </div>
          <div class="edit-descobertas" id="edit-descobertas-list">
            ${deriva.descobertas.map((d, i) => `
              <div class="edit-descoberta">
                <span>${d}</span>
                <button type="button" onclick="removeEditDescoberta(${i})">×</button>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${deriva.promptsSeguidos.length > 0 ? `
          <div class="form-group">
            <label class="label">Prompts Seguidos (${deriva.promptsSeguidos.length})</label>
            <div class="edit-prompts" id="edit-prompts-list">
              ${deriva.promptsSeguidos.map((p, i) => `
                <div class="edit-prompt">
                  <span class="edit-prompt-text">${p.promptText}</span>
                  <button type="button" class="edit-prompt-remove" onclick="removeEditPrompt(${i})">×</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="closeEditModal()">Cancelar</button>
          <button type="submit" class="btn-success">Salvar Alterações</button>
        </div>
      </form>
    `;
    
    // Armazenar dados para edição
    window.editDeriva = deriva;
    window.editHumor = deriva.humor;
    window.editClima = deriva.clima;
    window.editDescobertas = [...deriva.descobertas];
    window.editPrompts = [...deriva.promptsSeguidos];
    
    document.getElementById('modal-edit').style.display = 'flex';
  } catch (error) {
    alert('Erro ao carregar para edição: ' + error.message);
  }
}

function setEditHumor(value) {
  window.editHumor = value;
  document.querySelectorAll('#edit-humor-buttons .humor-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === value);
  });
}

function setEditClima(value) {
  window.editClima = value;
  document.querySelectorAll('#edit-clima-buttons .clima-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === value);
  });
}

function addEditDescoberta() {
  const input = document.getElementById('edit-nova-descoberta');
  const text = input.value.trim();
  
  if (text) {
    window.editDescobertas.push(text);
    input.value = '';
    renderEditDescobertas();
  }
}

function removeEditDescoberta(index) {
  window.editDescobertas.splice(index, 1);
  renderEditDescobertas();
}

function renderEditDescobertas() {
  const container = document.getElementById('edit-descobertas-list');
  container.innerHTML = window.editDescobertas.map((d, i) => `
    <div class="edit-descoberta">
      <span>${d}</span>
      <button type="button" onclick="removeEditDescoberta(${i})">×</button>
    </div>
  `).join('');
}

function removeEditPrompt(index) {
  window.editPrompts.splice(index, 1);
  const container = document.getElementById('edit-prompts-list');
  container.innerHTML = window.editPrompts.map((p, i) => `
    <div class="edit-prompt">
      <span class="edit-prompt-text">${p.promptText}</span>
      <button type="button" class="edit-prompt-remove" onclick="removeEditPrompt(${i})">×</button>
    </div>
  `).join('');
}

async function salvarEdicao(event, id) {
  event.preventDefault();
  
  const deriva = {
    ...window.editDeriva,
    local_inicio: document.getElementById('edit-local-inicio').value,
    local_fim: document.getElementById('edit-local-fim').value,
    duracao: parseInt(document.getElementById('edit-duracao').value) || null,
    distancia: parseFloat(document.getElementById('edit-distancia').value) || null,
    humor: window.editHumor,
    clima: window.editClima,
    notas: document.getElementById('edit-notas').value,
    descobertas: window.editDescobertas,
    promptsSeguidos: window.editPrompts
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deriva)
    });
    
    if (response.ok) {
      closeEditModal();
      await loadDerivas();
      alert('Deriva atualizada!');
    } else {
      throw new Error('Erro ao salvar');
    }
  } catch (error) {
    alert('Erro ao salvar: ' + error.message);
  }
}

function closeEditModal() {
  document.getElementById('modal-edit').style.display = 'none';
}

// Excluir
async function confirmarExclusao(id) {
  if (confirm('Tem certeza que deseja excluir esta deriva? Esta ação não pode ser desfeita.')) {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        closeDetalhesModal();
        await loadDerivas();
        await loadStats();
        alert('Deriva excluída!');
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  }
}

// Export/Import
async function exportarDados() {
  try {
    const response = await fetch(`${API_URL}?export=1`, {
      method: 'POST'
    });
    const data = await response.json();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `derivas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Erro ao exportar: ' + error.message);
  }
}

function importarDados() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          
          const response = await fetch(`${API_URL}?import=1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await loadDerivas();
            await loadStats();
            alert('Dados importados com sucesso!');
          } else {
            throw new Error('Erro ao importar');
          }
        } catch (error) {
          alert('Erro ao importar: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };
  
  input.click();
}

// Apagar tudo
async function apagarTudo() {
  if (confirm('Tem certeza? Isso apagará TODAS as derivas registradas. Esta ação é irreversível.')) {
    try {
      // Buscar todas as derivas
      const response = await fetch(API_URL);
      const derivas = await response.json();
      
      // Excluir uma por uma
      for (const deriva of derivas) {
        await fetch(`${API_URL}?id=${deriva.id}`, { method: 'DELETE' });
      }
      
      await loadDerivas();
      await loadStats();
      alert('Todos os dados foram apagados!');
    } catch (error) {
      alert('Erro ao apagar: ' + error.message);
    }
  }
}

// Utilitários
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Calcular distância entre dois pontos (fórmula de Haversine) em km
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ============ GEOLOCALIZAÇÃO ============

let pontosTrajeto = []; // Array para armazenar os pontos do trajeto durante a deriva

function iniciarGeolocalizacao() {
  if (!navigator.geolocation) {
    console.warn('Geolocalização não suportada');
    return;
  }
  
  pontosTrajeto = []; // Resetar pontos do trajeto
  
  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      localizacaoAtual = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };
      
      // Adicionar ao array de pontos do trajeto
      pontosTrajeto.push({
        lat: localizacaoAtual.lat,
        lng: localizacaoAtual.lng,
        accuracy: localizacaoAtual.accuracy,
        timestamp: localizacaoAtual.timestamp
      });
      
      // Salvar ponto no servidor (a cada 30 segundos ou se for o primeiro ponto)
      if (derivaAtiva && (pontosTrajeto.length === 1 || pontosTrajeto.length % 6 === 0)) {
        await salvarPontoTrajeto(localizacaoAtual);
      }
      
      console.log('Localização atualizada:', localizacaoAtual, 'Pontos:', pontosTrajeto.length);
    },
    (error) => {
      console.warn('Erro na geolocalização:', error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

async function salvarPontoTrajeto(ponto) {
  if (!derivaAtiva) return;
  
  try {
    await fetch(`${API_URL}?ponto=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deriva_id: derivaAtiva.id,
        latitude: ponto.lat,
        longitude: ponto.lng,
        accuracy: ponto.accuracy,
        timestamp: ponto.timestamp
      })
    });
    
    // Guardar estado local após salvar ponto
    salvarEstadoDeriva();
  } catch (error) {
    console.warn('Erro ao salvar ponto do trajeto:', error.message);
  }
}

function pararGeolocalizacao() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function capturarLocalizacaoAtual() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.warn('Erro ao capturar localização:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

// ============ MAPA LEAFLET ============

async function initMapa() {
  const mapContainer = document.getElementById('mapa-derivs');
  if (!mapContainer) return;
  
  // Se o mapa já existe, apenas invalidar o tamanho
  if (mapa) {
    mapa.invalidateSize();
    await carregarDerivasNoMapa();
    return;
  }
  
  // Criar mapa centrado no Brasil
  mapa = L.map('mapa-derivs').setView([-15.7801, -47.9292], 4);
  
  // Adicionar tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mapa);
  
  // Carregar derivas no mapa
  await carregarDerivasNoMapa();
}

async function carregarDerivasNoMapa() {
  if (!mapa) return;
  
  try {
    const response = await fetch(API_URL);
    const derivas = await response.json();
    
    // Limpar markers e linhas existentes
    markers.forEach(marker => mapa.removeLayer(marker));
    markers = [];
    
    if (derivas.length === 0) {
      document.getElementById('mapa-info').style.display = 'block';
      document.getElementById('mapa-info').innerHTML = '<p style="color: #6b6b80;">Nenhuma deriva registrada ainda. Comece sua primeira deriva!</p>';
      return;
    }
    
    // Adicionar markers e linhas para cada deriva
    const bounds = L.latLngBounds();
    let hasCoordinates = false;
    
    derivas.forEach(deriva => {
      // Desenhar trajeto completo se existir
      if (deriva.trajeto && deriva.trajeto.length > 1) {
        const latlngs = deriva.trajeto.map(p => [p.lat, p.lng]);
        
        // Desenhar linha do trajeto
        const polyline = L.polyline(latlngs, {
          color: '#c084fc',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10'
        }).addTo(mapa);
        
        // Popup na linha com informações
        polyline.bindPopup(`
          <div style="min-width: 200px;">
            <strong style="color: #c084fc; font-size: 1rem;">${formatDate(deriva.data_inicio)}</strong><br>
            ${deriva.local_inicio ? `<em style="color: #6b6b80;">${deriva.local_inicio}</em><br>` : ''}
            ${deriva.clima ? `<span>${deriva.clima}</span><br>` : ''}
            <span style="color: #6b6b80;">${deriva.promptsSeguidos.length} prompts</span><br>
            ${deriva.duracao ? `<span style="color: #6b6b80;">${deriva.duracao} min</span><br>` : ''}
            ${deriva.distancia ? `<span style="color: #6b6b80;">${deriva.distancia.toFixed(2)} km percorridos</span><br>` : ''}
            <span>Humor: ${'●'.repeat(deriva.humor)}${'○'.repeat(5 - deriva.humor)}</span><br>
            <br><span style="color: #6b6b80;">${deriva.trajeto.length} pontos registrados</span>
          </div>
        `);
        
        markers.push(polyline);
        
        // Adicionar todos os pontos ao bounds
        latlngs.forEach(latlng => {
          bounds.extend(latlng);
          hasCoordinates = true;
        });
      }
      
      // Se tem localização de início
      if (deriva.localizacao_inicio && deriva.localizacao_inicio.lat && deriva.localizacao_inicio.lng) {
        const marker = L.marker([
          deriva.localizacao_inicio.lat,
          deriva.localizacao_inicio.lng
        ]).addTo(mapa);
        
        // Popup com informações da deriva
        const popupContent = `
          <div style="min-width: 200px;">
            <strong style="color: #c084fc; font-size: 1rem;">${formatDate(deriva.data_inicio)}</strong><br>
            ${deriva.local_inicio ? `<em style="color: #6b6b80;">${deriva.local_inicio}</em><br>` : ''}
            ${deriva.clima ? `<span>${deriva.clima}</span><br>` : ''}
            <span style="color: #6b6b80;">${deriva.promptsSeguidos.length} prompts</span><br>
            ${deriva.duracao ? `<span style="color: #6b6b80;">${deriva.duracao} min</span><br>` : ''}
            ${deriva.distancia ? `<span style="color: #6b6b80;">${deriva.distancia.toFixed(2)} km percorridos</span><br>` : ''}
            <span>Humor: ${'●'.repeat(deriva.humor)}${'○'.repeat(5 - deriva.humor)}</span><br>
            ${deriva.descobertas.length > 0 ? `<br><strong>Descobertas:</strong><br>${deriva.descobertas.slice(0, 3).map(d => `• ${d}`).join('<br>')}` : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
        bounds.extend([deriva.localizacao_inicio.lat, deriva.localizacao_inicio.lng]);
        hasCoordinates = true;
      }
      
      // Se tem localização de fim
      if (deriva.localizacao_fim && deriva.localizacao_fim.lat && deriva.localizacao_fim.lng) {
        const marker = L.marker([
          deriva.localizacao_fim.lat,
          deriva.localizacao_fim.lng
        ], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background: #34d399; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(mapa);
        
        marker.bindPopup(`<strong>Fim da deriva</strong><br>${formatDate(deriva.data_fim || deriva.data_inicio)}`);
        markers.push(marker);
        bounds.extend([deriva.localizacao_fim.lat, deriva.localizacao_fim.lng]);
        hasCoordinates = true;
      }
    });
    
    if (hasCoordinates) {
      mapa.fitBounds(bounds, { padding: [50, 50] });
      document.getElementById('mapa-info').style.display = 'none';
    } else {
      document.getElementById('mapa-info').style.display = 'block';
      document.getElementById('mapa-info').innerHTML = '<p style="color: #6b6b80;">Nenhuma deriva com localização registrada. Ative a geolocalização durante a deriva!</p>';
    }
  } catch (error) {
    console.error('Erro ao carregar derivas no mapa:', error);
  }
}
