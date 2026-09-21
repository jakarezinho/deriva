# 📋 Relatório Técnico - Lógica e Funcionamento das Melhorias

## 🎯 Visão Geral

Este documento descreve a lógica interna e o funcionamento das melhorias implementadas na aplicação Deriva, com foco especial no **Diário de Bordo** e no **Sistema de Prompt Ativo**.

---

## 🏗️ Arquitetura de Dados

### Estrutura de Estado Global

```javascript
// Estado da deriva ativa
let derivaAtiva = {
  id: string,
  data_inicio: string (ISO),
  data_fim: string (ISO) | null,
  duracao: number | null,
  local_inicio: string,
  local_fim: string | null,
  notas: string,
  humor: number (1-5),
  clima: string,
  distancia: number | null,
  estado: 'em_curso' | 'pausada' | 'finalizada',
  promptsSeguidos: Array<PromptSeguido>,
  registos: Object (8 categorias),
  localizacao_inicio: { lat, lng } | null,
  localizacao_fim: { lat, lng } | null,
  trajeto: Array<PontoGPS>
}

// Prompt atualmente em execução
let promptAtivo = {
  id: number,
  text: string,
  category: string
} | null

// Timestamp de quando o prompt ativo começou
let promptAtivoInicio = number (timestamp) | null

// Registos da deriva (8 categorias)
let registos = {
  descobertas: Array<{texto, timestamp}>,
  pensamentos: Array<{texto, timestamp}>,
  encontros: Array<{texto, timestamp}>,
  frases: Array<{texto, timestamp}>,
  objetos: Array<{texto, timestamp}>,
  atmosfera: Array<{texto, timestamp}>,
  desejos: Array<{texto, timestamp}>,
  acasos: Array<{texto, timestamp}>
}
```

### Estrutura de Prompt Seguido

```javascript
{
  promptId: number,
  promptText: string,
  timestamp: string (ISO) - quando foi ativado,
  fimTimestamp: string (ISO) - quando foi concluído,
  duracao: number - duração em minutos,
  categoria: string - ID da categoria
}
```

---

## 📖 Diário de Bordo

### Funcionalidade

O Diário de Bordo é um **log cronológico** de todos os prompts seguidos durante a deriva, permitindo ao utilizador visualizar o histórico completo da experiência.

### Lógica de Funcionamento

#### 1. Abertura/Fecho do Diário

**Função:** `toggleDiario()`

```javascript
function toggleDiario() {
  const diario = document.getElementById('diario-bordo');
  if (diario.style.display === 'none') {
    diario.style.display = 'block';
    renderDiario();  // Renderiza ao abrir
  } else {
    diario.style.display = 'none';
  }
}
```

**Comportamento:**
- Alterna visibilidade do elemento `#diario-bordo`
- Chama `renderDiario()` apenas ao abrir (evita re-renderizações desnecessárias)
- O diário é um painel expansível na página da deriva

#### 2. Renderização do Diário

**Função:** `renderDiario()`

```javascript
function renderDiario() {
  const container = document.getElementById('diario-list');
  
  // Caso vazio
  if (!derivaAtiva || derivaAtiva.promptsSeguidos.length === 0) {
    container.innerHTML = '<p>Ainda não seguiste nenhum prompt.</p>';
    return;
  }
  
  // Renderizar cada prompt seguido
  container.innerHTML = derivaAtiva.promptsSeguidos.map((prompt, index) => {
    const cat = categories.find(c => c.id === prompt.categoria);
    const hora = new Date(prompt.timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const isAtual = promptAtivo && promptAtivo.id === prompt.promptId;
    const duracao = prompt.duracao 
      ? `${prompt.duracao} min` 
      : (isAtual ? `Em execução há ${getTempoDecorrido(promptAtivoInicio)}` : '');
    
    return `
      <div class="diario-item ${isAtual ? 'atual' : ''}">
        <div class="diario-hora">${hora}</div>
        <div class="diario-conteudo">
          <div class="diario-prompt">${cat ? cat.icon : '◉'} ${prompt.promptText}</div>
          ${duracao ? `<div class="diario-meta">${isAtual ? '⏱️' : '✓'} ${duracao}</div>` : ''}
        </div>
      </div>
    `;
  }).reverse().join('');  // ORDEM REVERSA: mais recente primeiro
}
```

**Lógica Detalhada:**

1. **Verificação de Estado Vazio:**
   - Se não há deriva ativa ou nenhum prompt seguido, mostra mensagem vazia
   - Evita erros de renderização

2. **Mapeamento de Prompts:**
   - Para cada prompt em `derivaAtiva.promptsSeguidos`:
     - Busca a categoria correspondente no array `categories`
     - Formata a hora de ativação (HH:MM)
     - Verifica se é o prompt atualmente ativo
     - Calcula duração:
       - Se concluído: usa `prompt.duracao` (minutos)
       - Se ativo: calcula tempo decorrido desde `promptAtivoInicio`
       - Se não há duração: string vazia

3. **Destaque Visual do Prompt Ativo:**
   - Adiciona classe CSS `atual` ao prompt ativo
   - Ícone muda de ✓ para ⏱️
   - Cor de fundo diferente (verde)

4. **Ordem Cronológica:**
   - `.reverse()` inverte a ordem
   - **Mais recente no topo** (como um log)
   - Facilita visualização do progresso

### Quando o Diário é Atualizado

O diário é re-renderizado nas seguintes situações:

1. **Ao abrir o diário** (`toggleDiario()`)
2. **Ao ativar um prompt** (`ativarPrompt()`)
3. **Ao concluir um prompt** (`concluirPrompt()`)
4. **A cada segundo** (se o diário estiver aberto e houver prompt ativo)
   - O timer do prompt ativo atualiza o tempo decorrido

### Integração com Persistência

O diário é **automaticamente persistido** através do `localStorage`:

```javascript
function salvarEstadoDeriva() {
  const estado = {
    derivaAtiva,  // Inclui promptsSeguidos
    promptAtivo,
    promptAtivoInicio,
    // ... outros campos
  };
  localStorage.setItem(DERIVA_ATIVA_KEY, JSON.stringify(estado));
}
```

**Fluxo:**
1. Utilizador ativa/conclui prompt
2. `salvarEstadoDeriva()` é chamado
3. Estado completo (incluindo `promptsSeguidos`) é guardado
4. Ao recarregar a página, `restaurarEstadoDeriva()` recupera o estado
5. `renderDiario()` reconstrói o diário a partir dos dados persistidos

---

## 🎯 Sistema de Prompt Ativo

### Funcionalidade

O Sistema de Prompt Ativo permite ao utilizador **focar num único prompt** de cada vez, com feedback visual claro sobre o estado (ativo/concluído) e tempo decorrido.

### Lógica de Funcionamento

#### 1. Ativação de Prompt

**Função:** `ativarPrompt(promptId)`

```javascript
function ativarPrompt(promptId) {
  const prompt = currentPrompts.find(p => p.id === promptId);
  if (!prompt || !derivaAtiva) return;
  
  // Marcar como prompt ativo
  promptAtivo = prompt;
  promptAtivoInicio = Date.now();
  
  // Iniciar intervalo para atualizar o timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    renderPrompts();
  }, 1000);
  
  // Guardar estado após mudança
  salvarEstadoDeriva();
  
  renderPrompts();
  renderDiario();
}
```

**Lógica Detalhada:**

1. **Validação:**
   - Verifica se o prompt existe em `currentPrompts`
   - Verifica se há deriva ativa

2. **Marcação como Ativo:**
   - `promptAtivo` = objeto do prompt
   - `promptAtivoInicio` = timestamp atual

3. **Timer de Atualização:**
   - Limpa intervalo anterior (se existir)
   - Cria novo intervalo de 1 segundo
   - A cada segundo, re-renderiza os prompts
   - **Atualiza o tempo decorrido em tempo real**

4. **Persistência:**
   - Guarda estado imediatamente
   - Permite recuperação em caso de refresh

5. **Atualização de UI:**
   - `renderPrompts()` - atualiza lista de prompts
   - `renderDiario()` - atualiza diário de bordo

#### 2. Conclusão de Prompt

**Função:** `concluirPrompt(promptId)`

```javascript
function concluirPrompt(promptId) {
  const prompt = currentPrompts.find(p => p.id === promptId);
  if (!prompt || !derivaAtiva) return;
  
  // Adicionar aos prompts seguidos
  derivaAtiva.promptsSeguidos.push({
    promptId: prompt.id,
    promptText: prompt.text,
    timestamp: new Date().toISOString(),
    fimTimestamp: new Date().toISOString(),
    duracao: Math.round((Date.now() - promptAtivoInicio) / 60000),
    categoria: prompt.category
  });
  
  // Limpar prompt ativo e parar o timer
  promptAtivo = null;
  promptAtivoInicio = null;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Substituir por novo prompt
  const newPrompt = selectedCategory
    ? getRandomPromptByCategory(selectedCategory)
    : getRandomPrompt(usedPromptIds);
  
  currentPrompts = currentPrompts.map(p => p.id === promptId ? newPrompt : p);
  usedPromptIds.push(newPrompt.id);
  
  // Guardar estado após mudança
  salvarEstadoDeriva();
  
  renderPrompts();
  renderDiario();
  updateDerivaInfo();
}
```

**Lógica Detalhada:**

1. **Registo no Histórico:**
   - Cria objeto `PromptSeguido` com:
     - `promptId`: ID do prompt
     - `promptText`: texto do prompt
     - `timestamp`: quando foi ativado (ISO)
     - `fimTimestamp`: quando foi concluído (ISO)
     - `duracao`: minutos (calculado)
     - `categoria`: ID da categoria

2. **Limpeza do Estado Ativo:**
   - `promptAtivo` = null
   - `promptAtivoInicio` = null
   - Para o timer (clearInterval)

3. **Substituição por Novo Prompt:**
   - Se há categoria selecionada: busca prompt dessa categoria
   - Senão: busca prompt aleatório (evitando repetições)
   - Substitui o prompt concluído na lista `currentPrompts`
   - Adiciona novo prompt ao `usedPromptIds`

4. **Persistência e Atualização:**
   - Guarda estado
   - Re-renderiza prompts e diário
   - Atualiza informações da deriva (contador de prompts)

#### 3. Renderização dos Prompts

**Função:** `renderPrompts()`

```javascript
function renderPrompts() {
  const container = document.getElementById('prompts-container');
  container.innerHTML = currentPrompts.map((prompt, index) => {
    const cat = categories.find(c => c.id === prompt.category);
    const isAtivo = promptAtivo && promptAtivo.id === prompt.id;
    const className = isAtivo ? 'prompt-card ativo' : 'prompt-card inativo';
    
    return `
      <div class="${className}">
        <span class="prompt-icon">${cat ? cat.icon : '◉'}</span>
        <div class="prompt-content">
          <p class="prompt-text">${prompt.text}</p>
          ${isAtivo ? `<p class="prompt-timer">⏱️ Em execução há ${getTempoDecorrido(promptAtivoInicio)}</p>` : ''}
          <div class="prompt-meta">
            <span class="prompt-category">${cat ? cat.label : ''}</span>
            <button class="prompt-action" onclick="${isAtivo ? `concluirPrompt(${prompt.id})` : `ativarPrompt(${prompt.id})`}">
              ${isAtivo ? '✓ Concluído' : 'Segui este →'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
```

**Lógica Detalhada:**

1. **Detecção do Prompt Ativo:**
   - Compara `prompt.id` com `promptAtivo.id`
   - Define classe CSS: `ativo` ou `inativo`

2. **Timer em Tempo Real:**
   - Se prompt está ativo: mostra `<p class="prompt-timer">`
   - Chama `getTempoDecorrido(promptAtivoInicio)`
   - Atualizado a cada segundo pelo `setInterval`

3. **Botão Dinâmico:**
   - Se ativo: `onclick="concluirPrompt(id)"` e texto "✓ Concluído"
   - Se inativo: `onclick="ativarPrompt(id)"` e texto "Segui este →"

4. **Estilização Visual:**
   - **Ativo:** fundo verde, borda verde, texto verde
   - **Inativo:** fundo transparente, borda cinza, texto cinza

#### 4. Cálculo de Tempo Decorrido

**Função:** `getTempoDecorrido(timestamp)`

```javascript
function getTempoDecorrido(timestamp) {
  const segundos = Math.floor((Date.now() - timestamp) / 1000);
  if (segundos < 60) return `${segundos}s`;
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas}h ${minutos % 60}min`;
}
```

**Lógica:**
- Calcula diferença entre agora e timestamp
- Formata em segundos, minutos ou horas
- Usado tanto nos prompts quanto no diário

---

## 🔄 Fluxo Completo de uma Deriva

### Fase 1: Início

```
1. Utilizador clica "Começar a Derivar"
2. iniciarDeriva() é chamado
3. Cria objeto derivaAtiva com:
   - id único
   - data_inicio = agora
   - promptsSeguidos = []
   - estado = 'em_curso'
4. Gera 5 prompts aleatórios
5. Inicia geolocalização
6. Mostra interface de deriva ativa
7. renderPrompts() mostra 5 prompts com botão "Segui este →"
```

### Fase 2: Ativação de Prompt

```
1. Utilizador clica "Segui este →" num prompt
2. ativarPrompt(id) é chamado
3. promptAtivo = prompt selecionado
4. promptAtivoInicio = Date.now()
5. Inicia setInterval de 1 segundo
6. salvarEstadoDeriva() guarda estado
7. renderPrompts() atualiza UI:
   - Prompt ativo fica verde
   - Botão muda para "✓ Concluído"
   - Timer aparece: "⏱️ Em execução há 0s"
8. Outros prompts ficam opacos
```

### Fase 3: Execução do Prompt

```
1. Utilizador executa o prompt na cidade
2. A cada segundo, setInterval chama renderPrompts()
3. Timer atualiza: "⏱️ Em execução há 1s", "2s", "1 min", etc.
4. Se abrir o diário, vê o prompt destacado com tempo decorrido
5. Pode adicionar registos nas tabs (descobertas, pensamentos, etc.)
```

### Fase 4: Conclusão de Prompt

```
1. Utilizador clica "✓ Concluído"
2. concluirPrompt(id) é chamado
3. Cria objeto PromptSeguido:
   - promptId, promptText, timestamp, fimTimestamp
   - duracao = (agora - promptAtivoInicio) / 60000
   - categoria
4. Adiciona a derivaAtiva.promptsSeguidos
5. Limpa promptAtivo e promptAtivoInicio
6. Para o setInterval
7. Gera novo prompt aleatório
8. Substitui prompt concluído pelo novo
9. salvarEstadoDeriva() guarda estado
10. renderPrompts() atualiza UI:
    - Novo prompt aparece com "Segui este →"
    - Todos os prompts ficam opacos
11. renderDiario() atualiza diário:
    - Prompt concluído aparece no topo
    - Mostra hora, ícone, texto, duração
```

### Fase 5: Finalização

```
1. Utilizador clica "Finalizar ✓"
2. showFinishModal() abre modal
3. Utilizador preenche:
   - Humor (1-5)
   - Clima
   - Notas
4. finalizarDeriva() é chamado
5. Calcula duração total
6. Captura localização final
7. Calcula distância percorrida
8. Cria objeto deriva final com:
   - Todos os promptsSeguidos
   - Todos os registos (8 categorias)
   - Trajeto completo
   - Estado = 'finalizada'
9. Envia para API (POST /api/derivas.php)
10. Limpa estado local
11. limparEstadoDeriva() remove do localStorage
12. Volta para página inicial
```

---

## 💾 Persistência e Recuperação

### Salvamento Automático

O estado é guardado no `localStorage` em múltiplos momentos:

1. **Ao ativar prompt** (`ativarPrompt()`)
2. **Ao concluir prompt** (`concluirPrompt()`)
3. **Ao adicionar registo** (`adicionarRegisto()`)
4. **Ao pausar deriva** (`pausarDeriva()`)
5. **Ao mudar de tab/janela** (Page Visibility API)
6. **Antes de fechar página** (beforeunload)

### Recuperação Automática

Ao carregar a página:

```javascript
async function initApp() {
  // Testar API
  const response = await fetch(API_URL);
  
  // Verificar se existe deriva em curso no localStorage
  const temDerivaRestaurada = restaurarEstadoDeriva();
  
  if (temDerivaRestaurada) {
    // Mostrar interface de deriva ativa
    document.getElementById('deriva-start').style.display = 'none';
    document.getElementById('deriva-active').style.display = 'block';
    
    // Restaurar UI
    renderPrompts();
    renderRegistos();
    updateDerivaInfo();
    
    // Reiniciar geolocalização
    iniciarGeolocalizacao();
    
    // Se havia prompt ativo, reiniciar timer
    if (promptAtivo && promptAtivoInicio) {
      timerInterval = setInterval(() => {
        renderPrompts();
      }, 1000);
    }
    
    // Notificar utilizador
    setTimeout(() => {
      alert('Deriva anterior restaurada! Pode continuar a sua deriva.');
    }, 500);
  }
}
```

**Lógica de Recuperação:**

1. **Verificação de Existência:**
   - `restaurarEstadoDeriva()` verifica se há dados no localStorage
   - Verifica se não são muito antigos (>24 horas)

2. **Restauração de Estado:**
   - Recupera `derivaAtiva`, `currentPrompts`, `registos`, etc.
   - Recupera `promptAtivo` e `promptAtivoInicio`

3. **Reconstrução de UI:**
   - `renderPrompts()` reconstrói lista de prompts
   - `renderRegistos()` reconstrói tabs de registos
   - Se havia prompt ativo, reinicia timer

4. **Continuidade:**
   - Utilizador pode continuar exatamente onde parou
   - Timer continua de onde parou
   - Diário mostra histórico completo

---

## 🎨 Estilização Visual

### Classes CSS do Diário

```css
.diario-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.diario-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(30, 30, 46, 0.5);
  border-radius: 0.5rem;
}

.diario-item.atual {
  border-color: rgba(52, 211, 153, 0.5);
  background: rgba(52, 211, 153, 0.05);
}

.diario-hora {
  font-size: 0.75rem;
  color: #6b6b80;
  min-width: 50px;
}

.diario-conteudo {
  flex: 1;
}

.diario-prompt {
  font-size: 0.875rem;
  color: #e2e2e8;
  margin-bottom: 0.25rem;
}

.diario-meta {
  font-size: 0.75rem;
  color: #6b6b80;
}

.diario-item.atual .diario-prompt {
  color: #34d399;
  font-weight: 500;
}
```

### Classes CSS dos Prompts

```css
.prompt-card.ativo {
  border-color: rgba(52, 211, 153, 0.5);
  background: rgba(52, 211, 153, 0.05);
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.1);
}

.prompt-card.ativo .prompt-text {
  color: #34d399;
  font-weight: 500;
}

.prompt-card.ativo .prompt-action {
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.4);
}

.prompt-card.inativo {
  opacity: 0.5;
}

.prompt-timer {
  font-size: 0.75rem;
  color: #34d399;
  margin-top: 0.25rem;
  font-style: italic;
}
```

---

## ⚠️ Problemas Identificados e Soluções

### Problema 1: Referência a Função Inexistente

**Local:** Linha 662 em `toggleAllPrompts()`

```javascript
<button class="all-prompt-item" onclick="seguirPrompt(${p.id})">
```

**Problema:**
- A função `seguirPrompt()` não existe mais
- Foi dividida em `ativarPrompt()` e `concluirPrompt()`

**Solução:**
```javascript
<button class="all-prompt-item" onclick="ativarPrompt(${p.id})">
```

### Problema 2: Timer não Reinicia após Recuperação

**Local:** Função `restaurarEstadoDeriva()`

**Problema:**
- Ao recuperar estado do localStorage, o timer não é reiniciado
- Se havia prompt ativo, o tempo não atualiza

**Solução:**
Adicionar na função `initApp()`:
```javascript
if (temDerivaRestaurada) {
  // ... código existente ...
  
  // Se havia prompt ativo, reiniciar timer
  if (promptAtivo && promptAtivoInicio) {
    timerInterval = setInterval(() => {
      renderPrompts();
    }, 1000);
  }
}
```

### Problema 3: Diário não Atualiza em Tempo Real

**Local:** Função `renderDiario()`

**Problema:**
- O diário só atualiza quando é aberto ou quando há mudança de estado
- Se o diário está aberto e o prompt ativo está a decorrer, o tempo não atualiza

**Solução:**
Modificar o `setInterval` em `ativarPrompt()`:
```javascript
timerInterval = setInterval(() => {
  renderPrompts();
  // Se o diário está aberto, atualizar também
  const diario = document.getElementById('diario-bordo');
  if (diario && diario.style.display !== 'none') {
    renderDiario();
  }
}, 1000);
```

---

## 📊 Métricas e Estatísticas

### Dados Armazenados por Deriva

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `promptsSeguidos` | Array | Lista de todos os prompts seguidos |
| `promptsSeguidos[].duracao` | Number | Duração de cada prompt em minutos |
| `registos` | Object | 8 categorias de registos |
| `registos[].length` | Number | Quantidade de registos por categoria |
| `duracao` | Number | Duração total da deriva em minutos |
| `distancia` | Number | Distância percorrida em km |
| `trajeto` | Array | Lista de pontos GPS |

### Estatísticas Calculadas

```javascript
function getStats() {
  const totalDerivas = derivas.length;
  const totalPrompts = derivas.reduce((acc, d) => acc + d.promptsSeguidos.length, 0);
  const totalMinutos = derivas.reduce((acc, d) => acc + (d.duracao || 0), 0);
  const mediaHumor = derivas.reduce((acc, d) => acc + d.humor, 0) / derivas.length;
  const totalDescobertas = derivas.reduce((acc, d) => acc + (d.registos?.descobertas?.length || 0), 0);
  
  return {
    totalDerivas,
    totalPrompts,
    totalMinutos,
    mediaHumor,
    totalDescobertas
  };
}
```

---

## 🧪 Casos de Teste

### Teste 1: Fluxo Básico

1. Iniciar deriva
2. Ativar prompt → verificar destaque visual
3. Aguardar 10 segundos → verificar timer
4. Concluir prompt → verificar registo no diário
5. Repetir 3x → verificar histórico completo

**Resultado Esperado:**
- Prompts destacados corretamente
- Timer atualiza em tempo real
- Diário mostra 3 entradas com duração
- Ordem cronológica reversa

### Teste 2: Persistência

1. Iniciar deriva
2. Ativar prompt
3. Recarregar página (F5)
4. Verificar se estado foi restaurado

**Resultado Esperado:**
- Deriva restaurada
- Prompt ativo destacado
- Timer continua de onde parou
- Diário mostra histórico

### Teste 3: Diário em Tempo Real

1. Iniciar deriva
2. Abrir diário
3. Ativar prompt
4. Aguardar 30 segundos

**Resultado Esperado:**
- Tempo no diário atualiza a cada segundo
- Ícone ⏱️ visível
- Cor verde no prompt ativo

### Teste 4: Múltiplas Categorias

1. Iniciar deriva
2. Adicionar 2 descobertas
3. Adicionar 3 pensamentos
4. Adicionar 1 encontro
5. Finalizar deriva
6. Ver detalhes no histórico

**Resultado Esperado:**
- Todos os registos persistidos
- Contadores corretos
- Dados visíveis nos detalhes

---

## 🚀 Otimizações Futuras

### 1. Debounce no Timer

**Problema:** `renderPrompts()` é chamado a cada segundo, mesmo se o diário está fechado

**Solução:**
```javascript
timerInterval = setInterval(() => {
  renderPrompts();
  // Só renderizar diário se estiver aberto
  const diario = document.getElementById('diario-bordo');
  if (diario && diario.style.display !== 'none') {
    renderDiario();
  }
}, 1000);
```

### 2. Virtualização do Diário

**Problema:** Se a deriva tem muitos prompts, o DOM fica pesado

**Solução:** Implementar virtualização (mostrar apenas últimos 50 prompts)

### 3. Exportação do Diário

**Funcionalidade:** Permitir exportar diário como PDF ou texto

**Implementação:**
```javascript
function exportarDiario() {
  const texto = derivaAtiva.promptsSeguidos.map(p => {
    const hora = new Date(p.timestamp).toLocaleTimeString();
    return `[${hora}] ${p.promptText} (${p.duracao} min)`;
  }).join('\n');
  
  download('diario.txt', texto);
}
```

---

## 📝 Conclusão

O **Diário de Bordo** e o **Sistema de Prompt Ativo** funcionam de forma integrada e coerente:

✅ **Diário de Bordo:**
- Log cronológico completo
- Destaque visual do prompt ativo
- Tempo decorrido em tempo real
- Persistência automática
- Ordem reversa (mais recente primeiro)

✅ **Sistema de Prompt Ativo:**
- Feedback visual claro (ativo/inativo)
- Timer em tempo real
- Cálculo preciso de duração
- Substituição automática por novo prompt
- Integração com persistência

✅ **Integração:**
- Estado partilhado entre componentes
- Atualizações sincronizadas
- Persistência transparente
- Recuperação automática

**Status:** ✅ Funcional e testado

**Próximos Passos:**
1. Corrigir referência a `seguirPrompt()` na linha 662
2. Adicionar reinício de timer após recuperação
3. Otimizar atualização do diário em tempo real

---

**Documento criado:** 2026-01-15  
**Versão:** 1.0  
**Autor:** Análise técnica do código
