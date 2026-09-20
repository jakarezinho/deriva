# 🚀 Deriva Urbana - Com Mapa e Edição

## ✅ Projeto 100% Standalone

**Sem Node.js, sem npm, sem build!**

Apenas HTML, CSS, JavaScript puro + PHP com SQLite.

### 🎯 Funcionalidades Principais

✅ **150 prompts situacionistas** em 7 categorias  
✅ **Mapa interativo** com Leaflet mostrando todas as derivas  
✅ **Geolocalização automática** durante as derivas  
✅ **Editar derivas** completas (local, humor, notas, etc)  
✅ **Eliminar derivas** individualmente ou em massa  
✅ **SQLite no servidor** - dados acessíveis de qualquer dispositivo  
✅ **Export/Import** - backup em JSON  
✅ **Design responsivo** - funciona em desktop e mobile  
✅ **Sem dependências** - funciona direto no navegador

---

## 📦 O que você tem

```
public/
├── index.html          ← Página principal
├── style.css           ← Estilos
├── prompts.js          ← 150 prompts situacionistas
├── app.js              ← Lógica da aplicação
├── api/
│   ├── config.php      ← Configuração do banco
│   ├── derivas.php     ← API REST
│   └── .htaccess       ← Segurança
├── data/
│   └── .htaccess       ← Protege o banco
└── check.php           ← Verificação do ambiente
```

---

## 🔧 Como instalar no InfinityFree

### Passo 1: Criar conta
1. Acesse https://www.infinityfree.net
2. Crie uma conta gratuita
3. Crie um hosting account (ex: `minhaderiva.infinityfreeapp.com`)

### Passo 2: Upload dos arquivos

**Via File Manager (mais fácil):**
1. No painel, vá em "Control Panel" → "File Manager"
2. Navegue até `htdocs/`
3. Faça upload de **TODA a pasta `public/`**:
   - `index.html`
   - `style.css`
   - `prompts.js`
   - `app.js`
   - Pasta `api/` (com todos os arquivos)
   - Pasta `data/` (crie vazia)
   - `check.php`

**Via FTP (FileZilla):**
- Host: `ftpupload.net` (ou o indicado no painel)
- User: `epiz_XXXXXXX`
- Password: (a que você definiu)
- Pasta: `/htdocs/`

### Passo 3: Configurar permissões
1. No File Manager, clique com botão direito na pasta `data/`
2. Selecione "Permissions" ou "Chmod"
3. Defina como **755** ou **775**

### Passo 4: Verificar instalação
Acesse no navegador:
```
http://seusite.infinityfreeapp.com/check.php
```

Deve mostrar tudo ✓ verde.

### Passo 5: Usar a aplicação
```
http://seusite.infinityfreeapp.com
```

Pronto! 🎉

---

## ✨ Funcionalidades

✅ **150 prompts situacionistas** em 7 categorias  
✅ **SQLite no servidor** - dados acessíveis de qualquer dispositivo  
✅ **CRUD completo** - criar, ler, editar, excluir derivas  
✅ **Export/Import** - backup em JSON  
✅ **Design responsivo** - funciona em desktop e mobile  
✅ **Sem dependências** - HTML/CSS/JS puro  

---

## 📊 Estrutura do banco de dados

O SQLite armazena:
- **derivas** - sessões de deriva
- **prompts_seguidos** - prompts utilizados em cada deriva
- **descobertas** - achados durante a deriva
- **config** - configurações do usuário

---

## 🔐 Segurança

- `.htaccess` bloqueia acesso direto ao banco SQLite
- `.htaccess` protege arquivos de configuração
- Validação de dados na API
- CORS configurado corretamente

---

## 💾 Backup

### Via interface
Use o botão "Exportar" no Histórico → salva JSON com tudo.

### Via FTP
Baixe periodicamente o arquivo `data/derivas.db`.

---

## 🆘 Problemas comuns

### "Erro ao conectar à API"
- Verifique se os arquivos PHP foram enviados
- Confirme que a pasta `data/` tem permissão 755
- Acesse `check.php` para diagnóstico

### "Banco não inicializado"
- Verifique permissões da pasta `data/`
- Confirme que o PHP tem SQLite habilitado (padrão no InfinityFree)

### Dados não salvam
- Abra o console do navegador (F12)
- Verifique erros na aba Network
- Confirme que `/api/derivas.php` responde

---

## 📞 Suporte

Se precisar de ajuda:
1. Acesse `check.php` e copie o resultado
2. Abra o console do navegador (F12) e copie os erros
3. Verifique a aba Network para ver as requisições à API

---

## 🎨 Personalização

### Mudar cores
Edite o arquivo `style.css` - as cores principais estão no topo.

### Adicionar prompts
Edite o arquivo `prompts.js` - adicione mais objetos ao array `prompts`.

### Mudar textos
Edite o arquivo `index.html` - todos os textos estão lá.

---

## 📝 Notas técnicas

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (ES6+)
- **Backend**: PHP 7.4+ com SQLite3
- **Banco**: SQLite (arquivo `data/derivas.db`)
- **API**: RESTful com endpoints para CRUD completo
- **Compatibilidade**: Funciona em todos os navegadores modernos

---

## 🎯 Conceito

Inspirado em "Théorie de la Dérive" de Guy Debord (1956):

> "A deriva é um modo de comportamento experimental ligado às condições da sociedade urbana: técnica do trânsito passageiro em uma ambiência variável."

Os prompts funcionam como **situações construídas** - dispositivos que quebram a rotina perceptiva e abrem novas possibilidades de experiência na cidade.

---

**Boa deriva! ◉**
