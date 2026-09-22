# 🚀 Deploy Rápido - InfinityFree (Sem Build)

## Guia Passo a Passo - 5 Minutos

---

## 📋 Pré-requisitos

- ✅ Conta no InfinityFree (gratuita)
- ✅ Ficheiros do projeto (pasta `public/`)
- ✅ Cliente FTP (FileZilla) OU acesso ao File Manager

---

## 🎯 Método 1: File Manager (Mais Fácil)

### Passo 1: Aceder ao File Manager

1. Login em https://www.infinityfree.net
2. Ir para **"Accounts"**
3. Selecionar a tua conta
4. Clicar em **"Control Panel"**
5. Clicar em **"File Manager"**

### Passo 2: Navegar para htdocs

1. No File Manager, navegar até `htdocs/`
2. Esta é a pasta raiz do teu site

### Passo 3: Upload dos Ficheiros

1. Clicar em **"Upload"** (botão no topo)
2. Selecionar **TODOS** os ficheiros da pasta `public/`:
   ```
   ✓ index.html
   ✓ style.css
   ✓ app.js
   ✓ prompts.js
   ✓ check.php
   ✓ api/ (pasta inteira)
     ├── config.php
     └── derivas.php
   ```
3. Aguardar upload completar

### Passo 4: Criar Pasta data

1. No File Manager, clicar em **"+ Folder"**
2. Nome: `data`
3. Clicar em **"Create"**

### Passo 5: Configurar Permissões

1. Clicar com botão direito na pasta `data/`
2. Selecionar **"Permissions"** ou **"Chmod"**
3. Definir como **755**
4. Clicar em **"Save"**

### Passo 6: Testar

1. Abrir browser
2. Aceder: `http://teusite.infinityfreeapp.com/check.php`
3. Verificar se tudo está ✓ verde
4. Aceder: `http://teusite.infinityfreeapp.com`
5. **Pronto!** 🎉

---

## 🎯 Método 2: FTP com FileZilla (Mais Rápido para Atualizações)

### Passo 1: Obter Credenciais FTP

1. Login em https://www.infinityfree.net
2. Ir para **"Accounts"**
3. Selecionar a tua conta
4. Clicar em **"FTP Details"**
5. Anotar:
   - **FTP Host:** ftpupload.net (ou similar)
   - **FTP Username:** epiz_XXXXXXX
   - **FTP Password:** (a tua password)

### Passo 2: Configurar FileZilla

1. Abrir FileZilla
2. Preencher campos no topo:
   ```
   Host: ftpupload.net
   Username: epiz_XXXXXXX
   Password: (tua password)
   Port: 21
   ```
3. Clicar em **"Quickconnect"**

### Passo 3: Navegar para htdocs

1. No painel direito (servidor), navegar até `/htdocs/`
2. No painel esquerdo (local), navegar até à pasta `public/`

### Passo 4: Upload dos Ficheiros

1. Selecionar **TODOS** os ficheiros da pasta `public/` no painel esquerdo
2. Arrastar para o painel direito (servidor)
3. Aguardar upload completar

### Passo 5: Criar Pasta data

1. No painel direito, clicar com botão direito
2. Selecionar **"Create directory"**
3. Nome: `data`
4. Clicar em **"OK"**

### Passo 6: Configurar Permissões

1. Clicar com botão direito na pasta `data/`
2. Selecionar **"File permissions..."**
3. Definir valor numérico: **755**
4. Clicar em **"OK"**

### Passo 7: Testar

1. Abrir browser
2. Aceder: `http://teusite.infinityfreeapp.com/check.php`
3. Verificar se tudo está ✓ verde
4. Aceder: `http://teusite.infinityfreeapp.com`
5. **Pronto!** 🎉

---

## 🔄 Como Atualizar (Sem Build)

### Quando editas um ficheiro localmente:

```bash
# 1. Editar o ficheiro
nano public/app.js
# ou usar VS Code, Sublime, etc.

# 2. Enviar para o servidor
# Opção A: FTP (FileZilla)
# - Arrastar ficheiro editado para o servidor

# Opção B: File Manager
# - Upload do ficheiro editado
# - Confirmar substituição

# 3. Pronto! Não há build necessário
```

### Exemplo: Atualizar app.js

1. Editar `public/app.js` localmente
2. Abrir FileZilla
3. Arrastar `app.js` para `/htdocs/`
4. Confirmar substituição
5. Refresh no browser (Ctrl+F5)
6. **Pronto!** ✅

---

## 📊 Estrutura Final no Servidor

```
htdocs/
├── index.html              ← Frontend
├── style.css               ← Estilos
├── app.js                  ← Lógica JavaScript
├── prompts.js              ← 150 prompts situacionistas
├── check.php               ← Verificação do ambiente
├── api/
│   ├── config.php          ← Configuração SQLite
│   ├── derivas.php         ← API REST
│   └── .htaccess           ← Segurança
└── data/
    ├── .htaccess           ← Proteção do banco
    └── derivas.db          ← Base de dados (criado automaticamente)
```

---

## ✅ Verificação Pós-Deploy

### Checklist:

- [ ] `http://teusite.com/check.php` mostra tudo ✓ verde
- [ ] `http://teusite.com` carrega a página inicial
- [ ] Conseguir iniciar uma deriva
- [ ] Conseguir seguir prompts
- [ ] Conseguir adicionar registos
- [ ] Conseguir finalizar deriva
- [ ] Deriva aparece no histórico
- [ ] Mapa funciona (se GPS ativado)

### Se algo não funciona:

1. **Verificar check.php**
   - Aceder: `http://teusite.com/check.php`
   - Verificar erros (vermelho)
   - Corrigir problemas indicados

2. **Verificar Console do Browser**
   - Pressionar F12
   - Ir para aba "Console"
   - Verificar erros JavaScript

3. **Verificar Network**
   - Pressionar F12
   - Ir para aba "Network"
   - Verificar se ficheiros carregam (status 200)

4. **Verificar Permissões**
   - Pasta `data/` deve ter permissão 755
   - Ficheiros PHP devem ter permissão 644

---

## 🆘 Problemas Comuns

### Problema: "Erro ao conectar à API"

**Causa:** Ficheiros PHP não foram enviados

**Solução:**
1. Verificar se pasta `api/` existe no servidor
2. Verificar se `config.php` e `derivas.php` existem
3. Reenviar ficheiros via FTP

### Problema: "Banco não inicializado"

**Causa:** Pasta `data/` não tem permissão de escrita

**Solução:**
1. Verificar permissões da pasta `data/`
2. Definir como 755
3. Tentar novamente

### Problema: "403 Forbidden"

**Causa:** `.htaccess` não foi enviado

**Solução:**
1. Verificar se `.htaccess` existe em `api/` e `data/`
2. Reenviar ficheiros
3. Verificar se "Show hidden files" está ativo no File Manager

### Problema: Página em branco

**Causa:** Erro JavaScript ou HTML

**Solução:**
1. Abrir Console (F12)
2. Verificar erros
3. Verificar se `index.html` foi enviado corretamente
4. Verificar se `app.js` e `style.css` estão na raiz

---

## 💡 Dicas

### Dica 1: HTTPS

Para usar geolocalização, precisas de HTTPS:

1. No painel InfinityFree, ir para **"SSL Certificates"**
2. Clicar em **"Let's Encrypt SSL"**
3. Selecionar o teu domínio
4. Clicar em **"Issue"**
5. Aguardar ativação (pode levar alguns minutos)

### Dica 2: Backup

Fazer backup regular:

**Via FTP:**
1. Descer todos os ficheiros do servidor
2. Guardar cópia local

**Via Interface:**
1. Usar botão "Exportar" no Histórico
2. Guardar ficheiro JSON

### Dica 3: Atualizações Rápidas

Para atualizações frequentes:

1. Manter FileZilla aberto
2. Editar ficheiros localmente
3. Arrastar para o servidor
4. Refresh no browser (Ctrl+F5)
5. **Sem build necessário!**

---

## 📞 Suporte

Se precisares de ajuda:

1. **Verificar check.php**
   - `http://teusite.com/check.php`
   - Copiar resultado

2. **Verificar Console**
   - F12 → Console
   - Copiar erros

3. **Verificar Network**
   - F12 → Network
   - Copiar status dos ficheiros

---

## ✅ Resumo

**Deploy sem build em 3 passos:**

1. ✅ Copiar pasta `public/` para `htdocs/`
2. ✅ Criar pasta `data/` com permissão 755
3. ✅ Aceder ao site

**Atualização sem build em 2 passos:**

1. ✅ Editar ficheiro localmente
2. ✅ Enviar para o servidor via FTP

**Tempo total: 5 minutos** ⚡

---

**Documento criado:** 2026-01-15  
**Versão:** 1.0  
**Status:** ✅ Pronto para uso
