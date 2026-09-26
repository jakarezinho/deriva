# 🐛 Correção de Bug - Modal de Registo Bloqueado

## Data: 2026-01-15

---

## ❌ Problema Reportado

**Sintoma:**
Ao criar uma descoberta e adicionar um registo, o sistema bloqueia com a mensagem:
```
"Selecione um tipo de registo"
```
E não é possível concluir a operação, mesmo após selecionar um tipo.

---

## 🔍 Diagnóstico

### Causa Raiz

O código tinha **duas variáveis diferentes** para armazenar o mesmo dado:

```javascript
// Variável 1: Usada durante a criação de descoberta
let registoCriacaoTemp = {
    tipo: null,
    conteudo: ''
};

// Variável 2: Usada para registos em descobertas existentes
let registoAtual = {
    descobertaId: null,
    tipo: null,
    conteudo: '',
    modo: 'existente'
};
```

### O Conflito

**Função `selecionarTipo()`:**
```javascript
function selecionarTipo(tipo) {
    registoAtual.tipo = tipo;  // ❌ Atualiza apenas registoAtual
    // ...
}
```

**Função `guardarRegistoCriacao()`:**
```javascript
function guardarRegistoCriacao() {
    if (!registoCriacaoTemp.tipo) {  // ❌ Verifica registoCriacaoTemp
        alert('Selecione um tipo de registo');
        return;
    }
    // ...
}
```

**Resultado:**
1. Utilizador clica num tipo → `selecionarTipo()` atualiza `registoAtual.tipo`
2. Utilizador clica em "Guardar" → `guardarRegistoCriacao()` verifica `registoCriacaoTemp.tipo`
3. `registoCriacaoTemp.tipo` está `null` → Mensagem de erro aparece
4. Loop infinito: não consegue guardar o registo

---

## ✅ Solução Implementada

### 1. Unificar a Atualização do Tipo

**Antes:**
```javascript
function selecionarTipo(tipo) {
    registoAtual.tipo = tipo;
    // ...
}
```

**Depois:**
```javascript
function selecionarTipo(tipo) {
    // Atualizar ambas as variáveis para compatibilidade
    registoAtual.tipo = tipo;
    registoCriacaoTemp.tipo = tipo;
    // ...
}
```

### 2. Corrigir a Validação

**Antes:**
```javascript
function guardarRegistoCriacao() {
    if (!registoCriacaoTemp.tipo) {
        alert('Selecione um tipo de registo');
        return;
    }
    // ...
}
```

**Depois:**
```javascript
function guardarRegistoCriacao() {
    // Usar registoAtual.tipo que é atualizado por selecionarTipo()
    const tipo = registoAtual.tipo;
    const conteudo = document.getElementById('registo-conteudo').value.trim();
    
    if (!tipo) {
        alert('Selecione um tipo de registo');
        return;
    }
    // ...
}
```

### 3. Resetar Ambas as Variáveis

**Função `adicionarRegistoCriacao()`:**
```javascript
function adicionarRegistoCriacao() {
    // Resetar ambas as variáveis
    registoCriacaoTemp = {
        tipo: null,
        conteudo: ''
    };
    registoAtual.tipo = null;
    registoAtual.conteudo = '';
    // ...
}
```

**Função `guardarRegistoCriacao()`:**
```javascript
function guardarRegistoCriacao() {
    // ...
    
    // Resetar estado
    registoAtual.tipo = null;
    registoCriacaoTemp.tipo = null;
    
    // ...
}
```

**Função `abrirModalRegisto()`:**
```javascript
function abrirModalRegisto(descobertaId) {
    registoAtual.descobertaId = descobertaId;
    registoAtual.tipo = null;
    registoAtual.conteudo = '';
    registoAtual.modo = 'existente';
    
    // Também resetar registoCriacaoTemp
    registoCriacaoTemp.tipo = null;
    registoCriacaoTemp.conteudo = '';
    // ...
}
```

---

## 📊 Fluxo Corrigido

### Cenário: Criar Descoberta com Registos

```
1. Utilizador clica em "✍️ Notas" ou "📷 Tirar Foto"
   ↓
2. Modal de criação abre
   - descobertaAtual.registos = []
   - registoAtual.tipo = null
   - registoCriacaoTemp.tipo = null
   ↓
3. Utilizador clica em "+ Adicionar Registo"
   ↓
4. Modal de registo abre (modo criação)
   - Botão "Guardar" → guardarRegistoCriacao()
   ↓
5. Utilizador clica num tipo (ex: 👁️ Sensorial)
   ↓
6. selecionarTipo('sensorial') é chamado
   - registoAtual.tipo = 'sensorial' ✓
   - registoCriacaoTemp.tipo = 'sensorial' ✓
   ↓
7. Utilizador escreve conteúdo
   ↓
8. Utilizador clica em "💾 Guardar"
   ↓
9. guardarRegistoCriacao() é chamado
   - Verifica registoAtual.tipo → 'sensorial' ✓
   - Lê conteúdo do textarea ✓
   - Adiciona a descobertaAtual.registos ✓
   - Reseta ambas as variáveis ✓
   - Fecha modal ✓
   - Atualiza lista de registos na UI ✓
   ↓
10. Utilizador pode adicionar mais registos ou guardar a descoberta
```

---

## 🧪 Como Testar

### Teste 1: Adicionar Registo Durante Criação

1. Criar nova deriva
2. Clicar em "✍️ Notas"
3. Escrever notas
4. Clicar em "+ Adicionar Registo"
5. **Selecionar tipo** (ex: 👁️ Sensorial)
6. **Escrever conteúdo** (ex: "O som da água")
7. Clicar em "💾 Guardar"
8. ✅ **Registo aparece na lista**
9. Clicar em "💾 Guardar" (descoberta)
10. ✅ **Descoberta é criada com registos**
11. ✅ **Badges aparecem na galeria**

### Teste 2: Múltiplos Registos

1. Criar nova deriva
2. Clicar em "✍️ Notas"
3. Clicar em "+ Adicionar Registo"
4. Adicionar registo 1 (👁️ Sensorial)
5. Clicar em "+ Adicionar Registo" novamente
6. Adicionar registo 2 (💭 Pensamento)
7. Clicar em "+ Adicionar Registo" novamente
8. Adicionar registo 3 (💬 Frase)
9. ✅ **Todos os registos aparecem na lista**
10. Guardar descoberta
11. ✅ **Todos os registos são guardados**

### Teste 3: Remover Registo Durante Criação

1. Adicionar 2-3 registos
2. Clicar em 🗑️ num registo
3. ✅ **Registo é removido da lista**
4. Guardar descoberta
5. ✅ **Apenas os registos restantes são guardados**

### Teste 4: Adicionar Registo a Descoberta Existente

1. Criar deriva com descoberta
2. Clicar na descoberta (marcador ou lista)
3. Clicar em "+ Registo"
4. Selecionar tipo
5. Escrever conteúdo
6. Clicar em "💾 Guardar"
7. ✅ **Registo é adicionado à descoberta**
8. ✅ **Modal de detalhes atualiza**

---

## 📁 Ficheiros Modificados

### public/app.js

**Funções Corrigidas:**
- ✅ `selecionarTipo()` - Atualiza ambas as variáveis
- ✅ `guardarRegistoCriacao()` - Usa `registoAtual.tipo` e reseta estado
- ✅ `adicionarRegistoCriacao()` - Reseta ambas as variáveis
- ✅ `abrirModalRegisto()` - Reseta ambas as variáveis

**Linhas Alteradas:** ~30 linhas

---

## 🎯 Lições Aprendidas

### 1. Evitar Duplicação de Estado

**Problema:** Ter duas variáveis para o mesmo dado causa inconsistências.

**Solução:** 
- Usar uma única fonte de verdade
- Ou garantir que ambas são sempre atualizadas em conjunto

### 2. Reset Completo do Estado

**Problema:** Não resetar todas as variáveis relacionadas causa comportamento inesperado.

**Solução:**
- Identificar todas as variáveis relacionadas
- Resetar todas ao abrir/fechar modais

### 3. Testar Fluxos Completos

**Problema:** Bug só aparecia em fluxos específicos (criação com registos).

**Solução:**
- Testar todos os cenários de uso
- Testar combinações de funcionalidades

---

## ✅ Status

**Bug:** ✅ Corrigido  
**Build:** ✅ Compilado com sucesso  
**Testes:** ✅ Todos os cenários funcionam

---

## 🚀 Próximos Passos

1. Testar no terreno
2. Verificar se há outros bugs similares
3. Considerar refatorar para eliminar `registoCriacaoTemp` completamente
4. Adicionar testes automatizados para prevenir regressões

---

**Versão:** 2.1.2  
**Data:** 2026-01-15  
**Status:** ✅ Bug Corrigido
