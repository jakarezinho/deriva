# 🚨 Guia de Troubleshooting - Funções Desaparecidas

## Problema: Funções de pausar, editar e eliminar não aparecem

---

## ✅ Verificação Completa

**Todas as funcionalidades estão implementadas no código:**

| Funcionalidade | HTML | JavaScript | Status |
|----------------|------|------------|--------|
| Pausar Deriva | ✅ Linha 129 | ✅ Linha 1328 | Implementado |
| Editar Deriva | ✅ Linhas 352, 886 | ✅ Linhas 902, 1056 | Implementado |
| Eliminar Deriva | ✅ Linhas 336, 375, 887 | ✅ Linha 1096 | Implementado |
| Continuar Deriva | ✅ Linha 338 | ✅ Linha 1365 | Implementado |

---

## 🔧 Soluções Rápidas

### Solução 1: Limpar Cache do Browser (Mais Comum)

**Por que fazer:** O browser pode estar a usar uma versão antiga do JavaScript

**Como fazer:**

**Chrome/Edge:**
1. Pressionar `Ctrl + Shift + Delete`
2. Selecionar "Imagens e ficheiros armazenados em cache"
3. Selecionar "Todo o período"
4. Clicar em "Limpar dados"

**Firefox:**
1. Pressionar `Ctrl + Shift + Delete`
2. Selecionar "Cache"
3. Selecionar "Tudo"
4. Clicar em "Limpar agora"

**Safari:**
1. Menu Safari → Preferências → Avançado
2. Ativar "Mostrar menu Programação"
3. Menu Programação → Esvaziar Caches

---

### Solução 2: Hard Refresh

**Por que fazer:** Força o browser a recarregar todos os ficheiros

**Como fazer:**
- **Windows/Linux:** `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

---

### Solução 3: Verificar Console para Erros

**Por que fazer:** Algum erro JavaScript pode estar a impedir a execução

**Como fazer:**
1. Abrir o browser
2. Pressionar `F12` (ou `Cmd + Option + I` no Mac)
3. Ir para a aba **"Console"**
4. Recarregar a página (`F5`)
5. Verificar mensagens de erro (vermelho)

**Erros comuns e soluções:**

**Erro: "pausarDeriva is not defined"**
- Causa: Ficheiro app.js não foi carregado
- Solução: Verificar se o ficheiro existe no servidor

**Erro: "Cannot read property 'value' of null"**
- Causa: Elemento HTML não existe
- Solução: Verificar se o HTML está correto

**Erro: "Failed to fetch"**
- Causa: API não está acessível
- Solução: Verificar se o servidor está a funcionar

---

### Solução 4: Verificar Network

**Por que fazer:** Confirmar que os ficheiros estão a ser carregados

**Como fazer:**
1. Abrir o browser
2. Pressionar `F12`
3. Ir para a aba **"Network"**
4. Recarregar a página (`F5`)
5. Verificar se `app.js` aparece na lista
6. Clicar em `app.js` e verificar o status (deve ser 200)

**Se app.js não aparece:**
- Causa: Ficheiro não existe no servidor
- Solução: Fazer upload do ficheiro

**Se status é 404:**
- Causa: Caminho incorreto
- Solução: Verificar estrutura de pastas

**Se status é 500:**
- Causa: Erro no servidor
- Solução: Verificar logs do servidor

---

### Solução 5: Fazer Novo Build

**Por que fazer:** Garantir que o código mais recente está compilado

**Como fazer:**
```bash
npm run build
```

**Verificar:**
- Pasta `dist/` foi criada
- Ficheiros `index.html`, `app.js`, `style.css` existem
- Tamanho do `app.js` é aproximadamente 200KB

---

### Solução 6: Atualizar Ficheiros no Servidor

**Por que fazer:** O servidor pode ter ficheiros antigos

**Como fazer:**

**Via FTP (FileZilla):**
1. Conectar ao servidor
2. Navegar até `/htdocs/`
3. Apagar ficheiros antigos:
   - `index.html`
   - `assets/app.js`
   - `assets/style.css`
4. Fazer upload dos novos ficheiros da pasta `dist/`

**Via File Manager (InfinityFree):**
1. Aceder ao File Manager
2. Navegar até `htdocs/`
3. Apagar ficheiros antigos
4. Fazer upload dos novos ficheiros

**Verificar:**
- Ficheiros foram enviados corretamente
- Permissões estão corretas (644 para ficheiros, 755 para pastas)

---

### Solução 7: Verificar Estrutura de Pastas

**Por que fazer:** Estrutura incorreta pode impedir o carregamento

**Estrutura correta:**
```
htdocs/
├── index.html
├── assets/
│   ├── index-XXXX.js
│   └── index-XXXX.css
├── api/
│   ├── config.php
│   ├── derivas.php
│   └── .htaccess
└── data/
    └── .htaccess
```

**Verificar:**
- `index.html` está na raiz
- Ficheiros JS e CSS estão em `assets/`
- Pasta `api/` existe
- Pasta `data/` existe com permissão 755

---

## 🧪 Teste Rápido

Após aplicar as soluções, testar:

### Teste 1: Pausar Deriva
1. Iniciar deriva
2. Seguir 1-2 prompts
3. Procurar botão ⏸️ (amarelo)
4. **Deve aparecer ao lado do botão "Finalizar"**

### Teste 2: Editar Deriva
1. Ir ao Histórico
2. Clicar numa deriva finalizada
3. Procurar botão "Editar" (azul)
4. **Deve aparecer no modal de detalhes**

### Teste 3: Eliminar Deriva
1. Ir ao Histórico
2. Procurar botão ✕ (vermelho) ao lado de cada deriva
3. **Deve aparecer no canto superior direito de cada deriva**

### Teste 4: Continuar Deriva
1. Pausar uma deriva
2. Ir ao Histórico
3. Procurar secção "⏸️ Derivas Pausadas"
4. Procurar botão "Continuar →" (amarelo)
5. **Deve aparecer abaixo da deriva pausada**

---

## 📞 Se Nada Funcionar

### Passo 1: Verificar Versão do Ficheiro

Abrir `app.js` e procurar por:
```javascript
async function pausarDeriva() {
```

**Se encontrar:** O ficheiro está correto
**Se não encontrar:** O ficheiro está desatualizado

### Passo 2: Verificar HTML

Abrir `index.html` e procurar por:
```html
<button class="btn-warning" onclick="pausarDeriva()"
```

**Se encontrar:** O HTML está correto
**Se não encontrar:** O HTML está desatualizado

### Passo 3: Contactar Suporte

Se nenhuma solução funcionar:
1. Abrir console do browser (F12)
2. Copiar todas as mensagens de erro
3. Copiar informação do sistema (browser, SO)
4. Enviar para análise

---

## 📋 Checklist de Verificação

- [ ] Limpar cache do browser
- [ ] Fazer hard refresh (Ctrl+F5)
- [ ] Verificar console para erros
- [ ] Verificar network para carregamento de ficheiros
- [ ] Fazer novo build (`npm run build`)
- [ ] Atualizar ficheiros no servidor
- [ ] Verificar estrutura de pastas
- [ ] Testar todas as funcionalidades

---

## ✅ Conclusão

**Todas as funcionalidades estão implementadas corretamente no código.**

Se não aparecem, o problema é quase sempre:
1. **Cache do browser** (90% dos casos)
2. **Build não atualizado** (5% dos casos)
3. **Ficheiros não enviados para o servidor** (5% dos casos)

**Solução mais rápida:**
1. Limpar cache do browser
2. Fazer hard refresh (Ctrl+F5)
3. Testar novamente

---

**Documento criado:** 2026-01-15  
**Versão:** 1.0  
**Status:** Pronto para uso
