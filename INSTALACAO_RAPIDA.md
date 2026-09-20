# 🚀 Guia Rápido de Instalação - InfinityFree

## 📦 O que você precisa

1. **Conta no InfinityFree** (gratuita) - https://www.infinityfree.net
2. **Os arquivos do projeto** (pasta `dist/` + arquivos PHP)
3. **Cliente FTP** (opcional) - FileZilla, WinSCP, etc.

---

## 🔧 Passo a Passo

### 1. Criar conta no InfinityFree

1. Acesse https://www.infinityfree.net e clique em "Sign Up"
2. Preencha seus dados e verifique o email
3. No painel, clique em **"Accounts"** → **"Create Account"**
4. Escolha um subdomínio (ex: `minhaderiva.infinityfreeapp.com`)
5. Aguarde a criação (pode levar alguns minutos)

### 2. Preparar os arquivos

Você tem **duas opções**:

#### Opção A: Modo Offline (mais simples)
Apenas o frontend, dados ficam no navegador.

```bash
# Gere o build
npm run build
```

Arquivos necessários:
- `dist/index.html`
- `dist/assets/*`

#### Opção B: Modo Servidor (recomendado)
Frontend + API PHP, dados ficam no servidor.

Arquivos necessários:
- `dist/index.html`
- `dist/assets/*`
- `public/api/derivas.php`
- `public/api/config.php`
- `public/api/.htaccess`
- `public/data/.htaccess`
- `public/check.php`

### 3. Upload dos arquivos

#### Via File Manager (mais fácil)

1. No painel do InfinityFree, vá em **"Control Panel"** → **"File Manager"**
2. Navegue até a pasta `htdocs/`
3. Faça upload dos arquivos:

**Para Opção A (Offline):**
```
htdocs/
├── index.html          ← de dist/
└── assets/             ← de dist/assets/
    ├── index-XXXX.css
    └── index-XXXX.js
```

**Para Opção B (Servidor):**
```
htdocs/
├── index.html          ← de dist/
├── assets/             ← de dist/assets/
├── api/                ← de public/api/
│   ├── config.php
│   ├── derivas.php
│   └── .htaccess
├── data/               ← crie vazia
│   └── .htaccess       ← de public/data/
└── check.php           ← de public/
```

#### Via FTP (FileZilla)

1. No painel do InfinityFree, vá em **"Accounts"** → seu domínio → **"FTP Details"**
2. Anote:
   - **FTP Host**: `ftpupload.net` (ou similar)
   - **FTP Username**: `epiz_XXXXXXX`
   - **FTP Password**: (a que você definiu)
3. Abra o FileZilla e conecte
4. Navegue até `/htdocs/` no servidor remoto
5. Arraste os arquivos para upload

### 4. Configurar permissões

**Importante para Opção B:**

1. No File Manager, clique com botão direito na pasta `data/`
2. Selecione **"Permissions"** ou **"Chmod"**
3. Defina como **755** ou **775**
4. Salve

### 5. Verificar instalação

Acesse no navegador:

```
http://seusite.infinityfreeapp.com/check.php
```

Este script verifica:
- ✓ Versão do PHP (requer 7.4+)
- ✓ Extensão SQLite3
- ✓ Permissões da pasta data/
- ✓ Capacidade de criar banco
- ✓ Arquivos da API

**Se tudo estiver OK**, você verá uma mensagem verde de sucesso.

### 6. Acessar a aplicação

```
http://seusite.infinityfreeapp.com
```

Pronto! 🎉

---

## 🔄 Atualizações

### Atualizar apenas o frontend

1. Gere um novo build: `npm run build`
2. Substitua os arquivos em `htdocs/` e `htdocs/assets/`
3. Os dados no servidor **não são afetados**

### Atualizar a API

1. Substitua os arquivos em `htdocs/api/`
2. Os dados no servidor **não são afetados**

---

## 💾 Backup dos Dados

### Opção A (Offline)
Use o botão "Exportar" no Histórico da aplicação.

### Opção B (Servidor)
1. Via FTP, baixe o arquivo `data/derivas.db`
2. Ou use o botão "Exportar" na aplicação

---

## 🆘 Problemas Comuns

### "Banco não inicializado"
- Verifique se a pasta `data/` tem permissão 755
- Acesse `check.php` para diagnóstico

### "403 Forbidden"
- Verifique se o `.htaccess` está correto
- Confirme que os arquivos PHP têm permissão 644

### Dados não salvam
- Abra o console do navegador (F12)
- Verifique os erros na aba "Network"
- Confirme que a API está acessível em `/api/derivas.php`

### "API não disponível"
- O frontend detecta automaticamente se a API existe
- Se não encontrar, usa o modo offline (IndexedDB)
- Verifique se os arquivos PHP foram enviados corretamente

---

## 📊 Estrutura Final

```
htdocs/
├── index.html              ← Frontend
├── assets/                 ← CSS e JS
│   ├── index-XXXX.css
│   └── index-XXXX.js
├── api/                    ← Backend PHP
│   ├── config.php          ← Configuração do banco
│   ├── derivas.php         ← API REST
│   └── .htaccess           ← Segurança
├── data/                   ← Banco de dados
│   ├── .htaccess           ← Bloqueia acesso direto
│   └── derivas.db          ← SQLite (criado automaticamente)
└── check.php               ← Verificação do ambiente
```

---

## 🔐 Segurança

- ✅ `.htaccess` bloqueia acesso direto ao banco SQLite
- ✅ `.htaccess` protege arquivos de configuração
- ✅ CORS configurado para permitir acesso do frontend
- ✅ Validação de dados na API

---

## 📞 Suporte

Se precisar de ajuda:
1. Acesse `check.php` e copie o resultado
2. Abra o console do navegador (F12) e copie os erros
3. Verifique a aba "Network" para ver as requisições à API

---

**Boa deriva! ◉**
