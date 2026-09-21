# 🔧 Correcções de Bugs - Teste de Terreno

## ✅ Erros Corrigidos

### Erro 1: `adicionarRegisto` - Cannot read properties of null

**Problema:**
```javascript
const input = document.getElementById(`novo-${tipo.slice(0, -1)}`);
```

**Causa:**
- A lógica `tipo.slice(0, -1)` para remover o "s" final **não funciona correctamente** para todos os tipos
- Alguns inputs usam prefixo `nova-` e outros `novo-`
- Exemplos de falhas:
  - `descobertas` → `descoberta` → procura `novo-descoberta` mas o input é `nova-descoberta` ❌
  - `pensamentos` → `pensament` → procura `novo-pensament` mas o input é `novo-pensamento` ❌
  - `atmosfera` → `atmosfer` → procura `novo-atmosfer` mas o input é `nova-atmosfera` ❌

**Solução:**
Criar um mapeamento explícito dos IDs dos inputs:

```javascript
const inputMap = {
  descobertas: 'nova-descoberta',
  pensamentos: 'novo-pensamento',
  encontros: 'novo-encontro',
  frases: 'nova-frase',
  objetos: 'novo-objeto',
  atmosfera: 'nova-atmosfera',
  desejos: 'novo-desejo',
  acasos: 'novo-acaso'
};

const inputId = inputMap[tipo];
const input = document.getElementById(inputId);

// Verificação de null
if (!input) {
  console.error('Input não encontrado:', inputId);
  return;
}
```

**Ficheiro:** `public/app.js` - Função `adicionarRegisto`

---

### Erro 2: Botão não muda de "Segui este →" para "✓ Concluído"

**Problema:**
O prompt era **imediatamente substituído** por um novo quando clicavas "Segui este →", impedindo que o botão mudasse para "✓ Concluído".

**Causa:**
A função `seguirPrompt` fazia duas coisas ao mesmo tempo:
1. Marcava o prompt como activo
2. Substituía-o por um novo

Como o prompt era substituído imediatamente, quando `renderPrompts()` era chamado, o prompt original já não existia na lista, então `isAtivo` nunca era `true`.

**Solução:**
Dividir a função em duas:

#### Função `ativarPrompt(promptId)`
- Marca o prompt como activo (destaca visualmente)
- Inicia o timer
- **NÃO substitui** o prompt
- Botão muda para "✓ Concluído"

#### Função `concluirPrompt(promptId)`
- Regista o prompt como concluído no diário
- Calcula a duração
- **Substitui** o prompt por um novo
- Limpa o timer
- Botão volta para "Segui este →"

**Fluxo correcto:**
```
1. Vês 5 prompts com botão "Segui este →"
2. Clicas num → prompt fica verde/destacado, botão muda para "✓ Concluído"
3. Os outros 4 ficam opacos
4. Timer mostra: "⏱️ Em execução há 3 min"
5. Quando acabares, clicas em "✓ Concluído"
6. O prompt é registado no diário e substituído por um novo
7. O novo prompt aparece com botão "Segui este →"
```

**Ficheiro:** `public/app.js` - Funções `ativarPrompt` e `concluirPrompt`

---

### Erro 3: Timer do prompt activo não actualiza

**Problema:**
O timer mostrava o tempo decorrido mas **não actualizava automaticamente**.

**Causa:**
O timer era calculado apenas quando `renderPrompts()` era chamado, mas não havia nenhum mecanismo para chamar essa função periodicamente.

**Solução:**
Adicionar um `setInterval` que actualiza o timer a cada segundo:

```javascript
let timerInterval = null;

function ativarPrompt(promptId) {
  // ...
  
  // Iniciar intervalo para actualizar o timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    renderPrompts();
  }, 1000);
  
  // ...
}

function concluirPrompt(promptId) {
  // ...
  
  // Limpar prompt ativo e parar o timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // ...
}
```

**Ficheiro:** `public/app.js` - Variável `timerInterval` e funções `ativarPrompt`/`concluirPrompt`

---

### Erro 4: `descobertas is not defined`

**Problema:**
```
ReferenceError: descobertas is not defined
    at renderDescobertas (app.js:659:25)
```

**Causa:**
- A variável `descobertas` foi substituída por `registos.descobertas`
- Mas a função `renderDescobertas` ainda tentava aceder à variável antiga
- Além disso, várias referências a `deriva.descobertas` não foram actualizadas para `deriva.registos?.descobertas`

**Solução:**

1. **Remover função obsoleta:**
```javascript
// Função renderDescobertas removida - agora usa renderRegistos()
```

2. **Substituir chamadas:**
```javascript
// Antes
renderDescobertas();

// Depois
renderRegistos();
```

3. **Actualizar referências a `deriva.descobertas`:**
```javascript
// Antes
${deriva.descobertas.length > 0 ? `...` : ''}

// Depois
${deriva.registos?.descobertas?.length > 0 ? `...` : ''}
```

4. **Corrigir reset de estado:**
```javascript
// Antes
descobertas = [];

// Depois
registos = {
  descobertas: [],
  pensamentos: [],
  encontros: [],
  frases: [],
  objetos: [],
  atmosfera: [],
  desejos: [],
  acasos: []
};
```

**Ficheiros:** `public/app.js` - Múltiplas funções e referências

---

## 📋 Resumo das Correcções

| # | Erro | Causa | Solução | Linhas afectadas |
|---|------|-------|---------|------------------|
| 1 | `adicionarRegisto` null | Mapeamento incorrecto de inputs | Mapeamento explícito + null check | ~1224 |
| 2 | Botão não muda | Prompt substituído imediatamente | Separar `ativarPrompt` e `concluirPrompt` | ~581-620 |
| 3 | Timer não actualiza | Falta `setInterval` | Adicionar intervalo de 1 segundo | ~547-580 |
| 4 | `descobertas` undefined | Variável removida mas referências mantidas | Actualizar todas as referências para `registos.descobertas` | Múltiplas |

---

## 🎯 Fluxo Corrigido do Prompt

### Antes (incorrecto):
```
1. Clicas "Segui este →"
2. Prompt é marcado como activo
3. Prompt é IMEDIATAMENTE substituído por novo
4. renderPrompts() é chamado
5. O prompt original já não existe na lista
6. Botão nunca mostra "✓ Concluído"
```

### Depois (correcto):
```
1. Clicas "Segui este →"
2. ativarPrompt() é chamado
3. Prompt é marcado como activo (verde/destacado)
4. Timer inicia (actualiza a cada segundo)
5. Botão muda para "✓ Concluído"
6. Outros prompts ficam opacos
7. Continuas a seguir o prompt...
8. Clicas "✓ Concluído"
9. concluirPrompt() é chamado
10. Prompt é registado no diário
11. Timer é parado
12. Prompt é substituído por novo
13. Novo prompt aparece com "Segui este →"
```

---

## 🧪 Testes Recomendados

### Teste 1: Adicionar registos nas tabs
1. Inicia uma deriva
2. Vai para cada tab (Descobertas, Pensamentos, Encontros, etc.)
3. Adiciona um registo em cada uma
4. **Esperado:** Todos os registos são adicionados sem erros

### Teste 2: Prompt activo
1. Inicia uma deriva
2. Clicas "Segui este →" num prompt
3. **Esperado:** Prompt fica verde, botão muda para "✓ Concluído", timer começa
4. Espera 10 segundos
5. **Esperado:** Timer mostra "⏱️ Em execução há 10s"
6. Clicas "✓ Concluído"
7. **Esperado:** Prompt é registado no diário e substituído por novo

### Teste 3: Diário de bordo
1. Segue 3 prompts
2. Abre o diário (📜)
3. **Esperado:** Vês os 3 prompts com hora, texto e duração

### Teste 4: Pausar e continuar
1. Inicia deriva e segue alguns prompts
2. Clicas "⏸️ Pausar"
3. Recarrega a página
4. **Esperado:** Deriva é restaurada com todos os prompts e registos

### Teste 5: Editar deriva
1. Vai ao histórico
2. Clicas numa deriva
3. Clicas "Editar"
4. **Esperado:** Vês as descobertas correctamente carregadas

---

## 📁 Ficheiros Modificados

- `public/app.js` - Todas as correcções de bugs

---

## ✅ Status

**Todos os erros reportados foram corrigidos!**

- ✅ `adicionarRegisto` funciona correctamente para todas as tabs
- ✅ Botão muda de "Segui este →" para "✓ Concluído"
- ✅ Timer actualiza automaticamente a cada segundo
- ✅ Não há mais erros de `descobertas is not defined`
- ✅ Fluxo do prompt activo funciona correctamente

**Build:** Compilado com sucesso ✓

---

**Pronto para testar no terreno!** 🚀
