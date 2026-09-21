# 🎯 Melhorias Implementadas - Teste de Terreno

## ✅ Problemas Resolvidos

### 1. Prompt Ativo Destacado Visualmente

**O que foi implementado:**
- O prompt que estás a seguir agora fica **destacado em verde** com borda brilhante
- Os outros prompts ficam **opacos** (50% de transparência)
- Aparece um **contador de tempo** mostrando há quanto tempo estás no prompt
- O botão muda de "Segui este →" para "✓ Concluído"

**Como funciona:**
```
1. Clicas em "Segui este →" num prompt
2. O prompt fica verde e destacado
3. Aparece: "⏱️ Em execução há 3 min"
4. Os outros prompts ficam opacos
5. Quando segues outro prompt, o anterior é marcado como concluído
```

**Código:**
- CSS: `.prompt-card.ativo` e `.prompt-card.inativo`
- JavaScript: Variáveis `promptAtivo` e `promptAtivoInicio`
- Função: `getTempoDecorrido()` para mostrar o tempo

---

### 2. Diário de Bordo

**O que foi implementado:**
- Novo botão **📜** na página da deriva
- Lista cronológica de todos os prompts seguidos
- Cada entrada mostra:
  - Hora do prompt
  - Ícone da categoria
  - Texto do prompt
  - Tempo gasto (ou "Em execução" se for o atual)
- O prompt atual fica destacado em verde

**Como aceder:**
1. Clica no botão **📜** durante a deriva
2. O diário abre com todos os prompts seguidos
3. Clica no **✕** para fechar

**Exemplo visual:**
```
┌─────────────────────────────────────────┐
│ 📜 Diário de Bordo                      │
├─────────────────────────────────────────┤
│ 10:40 │ 🧭 "Siga o cheiro mais..."     │  ← ATUAL (verde)
│       │    ⏱️ Em execução há 3 min      │
├─────────────────────────────────────────┤
│ 10:35 │ 💬 "Pergunte a um estranho..." │  ← Concluído
│       │    ✓ Segui durante 5 min        │
├─────────────────────────────────────────┤
│ 10:23 │ 🚶 "Vire à direita sem..."     │  ← Concluído
│       │    ✓ Segui durante 12 min       │
└─────────────────────────────────────────┘
```

**Código:**
- HTML: Secção `#diario-bordo`
- CSS: `.diario-list`, `.diario-item`, `.diario-item.atual`
- JavaScript: Funções `toggleDiario()` e `renderDiario()`

---

### 3. Estado PAUSAR

**O que foi implementado:**
- Novo botão **⏸️ Pausar** na página da deriva
- 3 estados da deriva: `em_curso`, `pausada`, `finalizada`
- Derivas pausadas aparecem **separadas** no histórico
- Botão **"Continuar →"** para retomar a deriva

**Fluxo de PAUSAR:**
```
1. Estás no meio de uma deriva
2. Clicas em "⏸️ Pausar"
3. Confirma: "Pausar deriva? Podes continuar mais tarde."
4. A deriva é guardada no servidor com estado "pausada"
5. Voltas à página inicial
```

**Fluxo de CONTINUAR:**
```
1. Vais ao Histórico
2. Vês a secção "⏸️ Derivas Pausadas"
3. Clicas em "Continuar →"
4. A deriva é restaurada: prompts, registos, humor, clima, trajeto
5. Continuas exatamente onde paraste
```

**No histórico:**
- Derivas pausadas aparecem com ícone **⏸️** e borda amarela
- Têm botão **"Continuar →"**
- Derivas finalizadas aparecem com ícone **✓** e borda verde

**Código:**
- HTML: Botão `.btn-warning`, secção `#pausadas-section`
- CSS: `.btn-warning`, `.historico-item.pausada`, `.btn-continue`
- JavaScript: Funções `pausarDeriva()` e `continuarDeriva()`
- Backend: Campo `estado` na tabela `derivas`

---

### 4. Novos Campos de Registos com Tabs

**O que foi implementado:**
- Sistema de **tabs** para organizar os registos
- 8 categorias de registos:
  1. 🔍 **Descobertas** (já existia)
  2. 💭 **Pensamentos** - Pensamentos errantes
  3. 🎭 **Encontros** - Pessoas, animais, situações
  4. 🗣️ **Frases** - Frases ouvidas
  5. 🎁 **Objetos** - Objetos encontrados
  6. 🌡️ **Atmosfera** - Atmosfera do lugar
  7. 💫 **Desejos** - Desejos despertados
  8. 🎲 **Acasos** - Acasos significativos

**Como funciona:**
```
┌─────────────────────────────────────────┐
│ [🔍 Descobertas] [💭 Pensamentos] [...] │  ← Tabs
├─────────────────────────────────────────┤
│ (input) [O que você encontrou?] [+]    │
├─────────────────────────────────────────┤
│ • Fonte antiga na praça                 │
│ • Gato preto cruzou a rua               │
│ • Porta azul com números romanos        │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Cada tab tem o seu próprio input e lista
- Podes adicionar e remover registos
- Todos os registos são guardados com timestamp
- Os registos são salvos no servidor com a deriva

**Código:**
- HTML: Secção `.tabs` e `.tab-content` para cada categoria
- CSS: `.tabs`, `.tab-btn`, `.tab-content`, `.registo-item`
- JavaScript: Funções `showTab()`, `adicionarRegisto()`, `removerRegisto()`, `renderRegistos()`
- Backend: Campo `registos` (JSON) na tabela `derivas`

---

## 📊 Estrutura de Dados Atualizada

### Tabela `derivas` (SQLite)

**Novos campos:**
```sql
estado TEXT DEFAULT "finalizada"  -- em_curso, pausada, finalizada
registos TEXT                     -- JSON com todos os registos
```

**Estrutura do campo `registos`:**
```json
{
  "descobertas": [
    {"texto": "Fonte antiga", "timestamp": "2026-01-15T10:30:00Z"}
  ],
  "pensamentos": [
    {"texto": "Esta rua parece-me com...", "timestamp": "2026-01-15T10:35:00Z"}
  ],
  "encontros": [...],
  "frases": [...],
  "objetos": [...],
  "atmosfera": [...],
  "desejos": [...],
  "acasos": [...]
}
```

---

## 🎨 Interface Atualizada

### Página da Deriva

**Novos botões:**
```
┌─────────────────────────────────────────┐
│ [📜 Diário] [⏸️ Pausar] [✕] [✓ Finalizar]│
└─────────────────────────────────────────┘
```

**Novo layout:**
```
1. Header com botões
2. Diário de Bordo (expansível)
3. Lista de prompts (com destaque no ativo)
4. Botões de ação (novo prompt, ver todos)
5. Tabs de registos (8 categorias)
```

### Página do Histórico

**Nova estrutura:**
```
┌─────────────────────────────────────────┐
│ ⏸️ Derivas Pausadas                     │
├─────────────────────────────────────────┤
│ ⏸️ 15/01/2026 - Praça da Sé            │
│    5 prompts | 30 min                   │
│    [Continuar →]                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓ Derivas Finalizadas                   │
├─────────────────────────────────────────┤
│ ✓ 14/01/2026 - Centro Histórico        │
│    12 prompts | 2h15 | 3.5 km          │
│    Humor: ●●●○○                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Ficheiros Modificados

### Frontend
- `public/index.html` - Nova estrutura com tabs, diário, botões
- `public/style.css` - Estilos para tabs, diário, prompt ativo, pausar
- `public/app.js` - Lógica de prompt ativo, diário, pausar, tabs, registos

### Backend
- `public/api/config.php` - Novos campos na tabela `derivas`
- `public/api/derivas.php` - Suporte a `estado` e `registos` no CRUD

---

## 📱 Experiência do Utilizador

### Cenário 1: Deriva Normal
```
1. Inicias deriva
2. Segues prompts (cada um fica destacado)
3. Adicionas registos nas tabs
4. Vês o diário de bordo
5. Finalizas deriva
```

### Cenário 2: Deriva Pausada
```
1. Inicias deriva
2. Segues alguns prompts
3. Precisas de ir almoçar
4. Clicas em "⏸️ Pausar"
5. Deriva é guardada
6. Mais tarde, vais ao Histórico
7. Clicas em "Continuar →"
8. Deriva é restaurada
9. Continuas onde paraste
10. Finalizas deriva
```

### Cenário 3: Consulta do Diário
```
1. Estás no meio de uma deriva
2. Queres ver o que já fizeste
3. Clicas em "📜 Diário"
4. Vês lista cronológica
5. Vês tempo gasto em cada prompt
6. Fecha o diário
7. Continuas a deriva
```

---

## 💡 Dicas de Uso

### Para melhor experiência:

1. **Usa o diário** para ver o teu progresso
2. **Pausa** quando precisares de parar temporariamente
3. **Explora as tabs** para captar diferentes dimensões da deriva
4. **Observa o prompt ativo** para saberes qual é a tua "missão" atual
5. **Continua derivas pausadas** para não perder o contexto

### Para derivas longas:

- **Pausa** antes de refeições ou compromissos
- **Consulta o diário** para ver o progresso
- **Usa diferentes tabs** para registos variados
- **Observa o timer** do prompt ativo para gerir o tempo

---

## 🎯 Conceito Situacionista

Estas melhorias aproximam ainda mais a app do espírito situacionista:

### Prompt Ativo
- Foca a atenção no **momento presente**
- Cria uma **"missão" clara** para cada fase da deriva
- Reforça a ideia de **situação construída**

### Diário de Bordo
- Documenta a **experiência cronológica**
- Permite **reflexão** sobre o percurso
- Cria um **arquivo psicogeográfico** pessoal

### Estado Pausar
- Respeita o **ritmo natural** da deriva
- Permite **derivas multi-sessão**
- Reconhece que a deriva pode ser **interrompida e retomada**

### Novos Registos
- Captura a **experiência multissensorial**
- Regista **dimensões subjetivas** da cidade
- Cria um **mapa emocional** do espaço urbano

---

## 🚀 Próximos Passos (Opcional)

Se quiseres melhorar ainda mais:

1. **Notas por prompt** - Adicionar campo de notas em cada prompt do diário
2. **Fotos nos registos** - Permitir anexar fotos aos registos
3. **Exportar diário** - Gerar PDF do diário de bordo
4. **Estatísticas por categoria** - Ver quais tabs usas mais
5. **Sugestões de prompts** - Baseadas nos registos que fazes

---

**Todas as melhorias estão implementadas e funcionais!** 🎉

Testa no terreno e diverte-te a derivar! ◉
