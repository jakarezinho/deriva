# 🚀 Guia Rápido - Instalação em 5 Minutos

## Sem Node.js, sem npm, sem complicação!

---

## 📋 O que você precisa

1. ✅ Conta no InfinityFree (gratuita)
2. ✅ Os arquivos deste projeto (pasta `public/`)
3. ✅ 5 minutos do seu tempo

---

## 🎯 Passo a Passo

### 1️⃣ Criar conta no InfinityFree

1. Acesse: https://www.infinityfree.net
2. Clique em **"Sign Up"** (canto superior direito)
3. Preencha seus dados e verifique o email
4. No painel, clique em **"Accounts"** → **"Create Account"**
5. Escolha um subdomínio (ex: `minhaderiva.infinityfreeapp.com`)
6. Aguarde a criação (pode levar alguns minutos)

---

### 2️⃣ Fazer upload dos arquivos

**Método mais fácil - File Manager:**

1. No painel do InfinityFree, vá em **"Control Panel"**
2. Clique em **"File Manager"**
3. Navegue até a pasta `htdocs/`
4. Clique em **"Upload"** (botão no topo)
5. Faça upload de **TODOS** estes arquivos:

```
📁 Arquivos para upload:
├── index.html
├── style.css
├── prompts.js
├── app.js
├── check.php
├── 📁 api/
│   ├── config.php
│   ├── derivas.php
│   └── .htaccess
└── 📁 data/
    └── .htaccess
```

**Dica:** Você pode fazer upload de um arquivo ZIP com tudo dentro e extrair no servidor.

---

### 3️⃣ Configurar permissões

1. No File Manager, encontre a pasta `data/`
2. Clique com o botão direito nela
3. Selecione **"Permissions"** ou **"Chmod"**
4. Digite **755** ou marque as caixas:
   - ✅ Read (para Owner, Group, Public)
   - ✅ Write (apenas para Owner)
   - ✅ Execute (para Owner, Group, Public)
5. Clique em **"Save"** ou **"Change Permissions"**

---

### 4️⃣ Verificar instalação

Abra no navegador:
```
http://seusite.infinityfreeapp.com/check.php
```

Você deve ver uma página com várias verificações:
- ✅ Versão do PHP
- ✅ Extensão SQLite3
- ✅ Diretório data/
- ✅ Criação de banco SQLite
- ✅ Arquivo da API
- ✅ Frontend

Se tudo estiver verde, está pronto! 🎉

---

### 5️⃣ Usar a aplicação

Acesse:
```
http://seusite.infinityfreeapp.com
```

Pronto! Você pode começar a derivar! ◉

---

## 🔄 Como fazer upload via FTP (alternativa)

Se preferir usar FTP:

1. Baixe o FileZilla: https://filezilla-project.org
2. No InfinityFree, vá em **"Accounts"** → seu domínio → **"FTP Details"**
3. Anote:
   - **FTP Host**: `ftpupload.net` (ou similar)
   - **FTP Username**: `epiz_XXXXXXX`
   - **FTP Password**: (a que você definiu)
4. No FileZilla:
   - Host: (o FTP Host)
   - Username: (o FTP Username)
   - Password: (a senha)
   - Port: 21
5. Clique em **"Quickconnect"**
6. Navegue até `/htdocs/` no painel direito
7. Arraste todos os arquivos do painel esquerdo para o direito

---

## ❓ Problemas?

### "Erro ao conectar à API"
- Verifique se todos os arquivos foram enviados
- Confirme que a pasta `data/` tem permissão 755
- Acesse `check.php` para ver o diagnóstico

### "403 Forbidden"
- Verifique se o `.htaccess` foi enviado
- Confirme que os arquivos PHP têm permissão 644

### Página em branco
- Abra o console do navegador (F12)
- Veja se há erros de JavaScript
- Confirme que `index.html`, `style.css`, `prompts.js` e `app.js` estão na raiz

---

## 💡 Dicas

### Backup dos dados
- Use o botão "Exportar" no Histórico da aplicação
- Ou baixe o arquivo `data/derivas.db` via FTP

### Atualizar a aplicação
- Substitua os arquivos `index.html`, `style.css`, `app.js`
- Os dados no banco **não são perdidos**

### Acessar de outro dispositivo
- Os dados ficam no servidor, então você pode acessar de qualquer lugar
- Basta usar o mesmo URL

---

## 📞 Precisa de ajuda?

1. Acesse `check.php` e copie o resultado
2. Abra o console do navegador (F12) → aba Console
3. Copie as mensagens de erro
4. Verifique a aba Network para ver as requisições

---

## 🎉 Pronto!

Agora você tem sua aplicação de Deriva Urbana rodando no InfinityFree!

**Boa deriva! ◉**
