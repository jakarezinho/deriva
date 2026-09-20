# 🚀 Deploy no InfinityFree — Guia Completo

## 📋 O que é InfinityFree?
InfinityFree é um serviço de hospedagem **gratuito** com suporte a PHP + MySQL. 
Para a Deriva, temos **duas opções**:

| Opção | Onde roda o SQLite | Vantagens | Desvantagens |
|-------|-------------------|-----------|--------------|
| **A) Frontend only** | No navegador (IndexedDB) | Simples, funciona offline | Dados ficam só no browser usado |
| **B) PHP + SQLite** | No servidor | Dados acessíveis de qualquer dispositivo | Requer PHP (já incluso no Infinity) |

---

## 🅰️ OPÇÃO A: Deploy Simples (Frontend Only)

### Passo 1: Gerar o build
```bash
npm run build
```
Isso gera a pasta `dist/` com todos os arquivos prontos.

### Passo 2: Acessar o InfinityFree
1. Crie conta em https://www.infinityfree.net
2. Crie um novo hosting account (ex: `epiz_XXXXXXX`)
3. Anote o domínio gratuito (ex: `deriva.infinityfreeapp.com`)

### Passo 3: Upload dos arquivos
**Via File Manager (mais fácil):**
1. Acesse o painel → "Control Panel" → "File Manager"
2. Navegue até `htdocs/`
3. Faça upload de **todo o conteúdo** da pasta `dist/`:
   ```
   htdocs/
   ├── index.html
   └── assets/
       ├── index-XXXX.css
       └── index-XXXX.js
   ```

**Via FTP (FileZilla):**
- Host: `ftpupload.net` ou o host indicado no painel
- Usuário: `epiz_XXXXXXX`
- Senha: a que você definiu
- Pasta: `/htdocs/`

### Passo 4: Acessar
Abra `http://seusite.infinityfreeapp.com` — pronto! 🎉

---

## 🅱️ OPÇÃO B: Deploy com PHP + SQLite no Servidor (Recomendado)

Esta versão armazena os dados **no servidor**, permitindo acesso de qualquer dispositivo.

### Passo 1: Copiar arquivos para o servidor

Estrutura final no servidor:
```
htdocs/
├── index.html          ← Frontend (build do React)
├── assets/             ← CSS e JS do build
│   ├── index-XXXX.css
│   └── index-XXXX.js
├── api/
│   ├── config.php      ← Configuração do banco
│   ├── derivas.php     ← API REST
│   └── .htaccess       ← Proteção
└── data/
    ├── .htaccess       ← Bloqueia acesso direto
    └── derivas.db      ← SQLite (criado automaticamente)
```

### Passo 2: Upload via File Manager ou FTP

1. Faça upload da pasta `dist/` para `htdocs/`
2. Crie a pasta `htdocs/api/` e envie os arquivos PHP
3. Crie a pasta `htdocs/data/` (será onde o SQLite ficará)

### Passo 3: Permissões
No File Manager, clique com botão direito na pasta `data/`:
- **Permissions:** `755` ou `775` (precisa ser writável pelo PHP)

### Passo 4: Testar
Acesse `http://seusite.infinityfreeapp.com/api/derivas.php`
Deve retornar `[]` (array vazio) se tudo estiver correto.

---

## ⚠️ Limitações do InfinityFree

- **Não permite** acesso direto a arquivos `.db` (bom, protege o SQLite)
- **Limite:** 50.000 visitas/dia (mais que suficiente para uso pessoal)
- **PHP 7.4+** disponível (necessário para SQLite)
- **SSL gratuito** via Let's Encrypt (ative no painel)

---

## 🔐 Segurança

O arquivo `.htaccess` dentro de `data/` bloqueia acesso direto ao banco:
```apache
Order deny,allow
Deny from all
```

O arquivo `.htaccess` dentro de `api/` permite apenas acesso via PHP:
```apache
<FilesMatch "\.(db|sqlite)$">
    Order deny,allow
    Deny from all
</FilesMatch>
```

---

## 🔄 Backup dos dados

### Opção 1: Via interface
Use o botão "Exportar" no Histórico → salva um JSON com tudo.

### Option 2: Via FTP
Baixe periodicamente o arquivo `data/derivas.db`.

### Opção 3: Script automático
Crie um cron job (se disponível) para copiar o `.db` para um backup.

---

## 🆘 Problemas comuns

### "Banco não inicializado"
- Verifique se o `data/` tem permissão de escrita
- Confira se o PHP tem a extensão SQLite habilitada (padrão no InfinityFree)

### "403 Forbidden" ao acessar /api/
- Verifique se o `.htaccess` está correto
- Confirme que o arquivo PHP tem permissão `644`

### Dados não salvam
- Abra o console do navegador (F12) para ver erros
- Verifique se a pasta `data/` é writável
- Teste: `http://seusite.com/api/derivas.php?test=1`

---

## 📞 Suporte

Se precisar de ajuda, abra o console do navegador (F12 → Console)
e copie as mensagens de erro para diagnóstico.

---

**Boa deriva! ◉**
