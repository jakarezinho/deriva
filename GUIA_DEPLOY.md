# 🚀 Deploy no InfinityFree - Guia Definitivo

## ✅ O que foi criado

A aplicação agora tem **duas camadas de armazenamento**:

1. **API PHP + SQLite no servidor** (recomendado) - dados acessíveis de qualquer dispositivo
2. **SQLite no navegador** (fallback) - dados ficam apenas no browser usado

O frontend **detecta automaticamente** qual modo usar.

---

## 📦 Arquivos para Upload

### Estrutura final no servidor:

```
htdocs/
├── index.html              ← de dist/
├── assets/                 ← de dist/assets/
├── api/                    ← de public/api/
│   ├── config.php
│   ├── derivas.php
│   └── .htaccess
├── data/                   ← crie vazia
│   └── .htaccess
└── check.php               ← de public/
```

---

## 🔧 Passo a Passo

### 1. Gerar o build
```bash
npm run build
```

### 2. Criar conta no InfinityFree
- Acesse: https://www.infinityfree.net
- Crie um hosting account gratuito
- Anote o domínio (ex: `minhaderiva.infinityfreeapp.com`)

### 3. Upload dos arquivos

**Via File Manager (mais fácil):**
1. Painel → Control Panel → File Manager
2. Navegue até `htdocs/`
3. Envie os arquivos na estrutura acima

**Via FTP (FileZilla):**
- Host: `ftpupload.net` (ou o indicado no painel)
- User: `epiz_XXXXXXX`
- Password: (a que você definiu)
- Pasta: `/htdocs/`

### 4. Configurar permissões
No File Manager, clique com botão direito na pasta `data/`:
- **Permissions:** `755` ou `775`

### 5. Verificar instalação
Acesse no navegador:
```
http://seusite.infinityfreeapp.com/check.php
```

Deve mostrar tudo ✓ verde.

### 6. Acessar a aplicação
```
http://seusite.infinityfreeapp.com
```

Pronto! 🎉

---

## 🔄 Como funciona

### Modo Automático
O frontend detecta automaticamente:
- Se a API PHP está disponível → usa **servidor** (dados em SQLite no servidor)
- Se não está → usa **navegador** (dados em IndexedDB)

### Vantagens do Modo Servidor
✅ Dados acessíveis de qualquer dispositivo  
✅ Backup centralizado  
✅ Não perde dados ao limpar cache  

### Vantagens do Modo Navegador
✅ Funciona offline  
✅ Mais rápido (sem requisições HTTP)  
✅ Não depende do servidor  

---

## 💾 Backup

### Via Interface
Use o botão "Exportar" no Histórico → salva JSON com tudo.

### Via FTP
Baixe periodicamente o arquivo `data/derivas.db`.

---

## 🆘 Problemas Comuns

### "Banco não inicializado"
- Verifique permissões da pasta `data/` (755)
- Acesse `check.php` para diagnóstico

### "API não disponível"
- Confirme que os arquivos PHP foram enviados
- Verifique se o PHP tem SQLite habilitado (padrão no InfinityFree)

### Dados não salvam
- Abra console do navegador (F12)
- Verifique erros na aba Network
- Confirme que `/api/derivas.php` responde

---

## 📊 Estrutura dos Arquivos

### Frontend (dist/)
- `index.html` - Página principal
- `assets/` - CSS e JavaScript compilados

### Backend (public/api/)
- `config.php` - Configuração do banco SQLite
- `derivas.php` - API REST completa
- `.htaccess` - Segurança e CORS

### Dados (public/data/)
- `.htaccess` - Bloqueia acesso direto ao banco
- `derivas.db` - Banco SQLite (criado automaticamente)

### Utilitários (public/)
- `check.php` - Verificação do ambiente

---

## 🔐 Segurança

✅ `.htaccess` bloqueia acesso direto ao banco SQLite  
✅ `.htaccess` protege arquivos de configuração  
✅ CORS configurado para permitir acesso do frontend  
✅ Validação de dados na API  

---

## 📞 Suporte

Se precisar de ajuda:
1. Acesse `check.php` e copie o resultado
2. Abra console do navegador (F12) e copie erros
3. Verifique aba Network para requisições à API

---

**Boa deriva! ◉**
