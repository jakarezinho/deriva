# ✅ Confirmação: Projeto 100% Standalone

## Data: 2026-01-15

---

## 🎯 Status: TOTALMENTE STANDALONE

**O projeto NÃO requer:**
- ❌ Node.js
- ❌ npm
- ❌ npm run build
- ❌ Compilação
- ❌ Transpilação
- ❌ Bundlers (Webpack, Vite, etc.)

---

## 📁 Estrutura de Ficheiros Standalone

```
public/
├── index.html          ← HTML puro (abrir diretamente no browser)
├── style.css           ← CSS puro (estilos)
├── app.js              ← JavaScript puro (lógica da aplicação)
├── prompts.js          ← JavaScript puro (150 prompts situacionistas)
├── check.php           ← PHP puro (verificação do ambiente)
├── api/
│   ├── config.php      ← PHP puro (configuração SQLite)
│   └── derivas.php     ← PHP puro (API REST)
└── data/
    └── .htaccess       ← Apache config (segurança)
```

---

## 🚀 Como Usar (Sem Build)

### Opção 1: Abrir Localmente (Teste)

```bash
# Basta abrir o ficheiro HTML no browser
cd public/
# Abrir index.html no browser (duplo clique)
```

**Nota:** A API PHP não funciona localmente sem servidor web.

### Opção 2: Servidor Web Local (Teste Completo)

**Usando PHP built-in server:**
```bash
cd public/
php -S localhost:8000
```

Acessar: `http://localhost:8000`

**Usando XAMPP/WAMP/MAMP:**
1. Copiar pasta `public/` para `htdocs/` (XAMPP) ou `www/` (WAMP)
2. Iniciar Apache
3. Aceder: `http://localhost/public/`

### Opção 3: Servidor Remoto (Produção)

**InfinityFree ou qualquer hosting com PHP:**

1. **Via FTP (FileZilla):**
   ```
   Conectar ao servidor
   Navegar até /htdocs/
   Upload de TODA a pasta public/
   ```

2. **Via File Manager:**
   ```
   Aceder ao File Manager do hosting
   Navegar até htdocs/
   Upload de todos os ficheiros da pasta public/
   ```

3. **Aceder:**
   ```
   http://seusite.infinityfreeapp.com
   ```

---

## ✅ Tecnologias Utilizadas

| Tecnologia | Versão | Tipo | Necessita Build? |
|------------|--------|------|------------------|
| HTML5 | - | Markup | ❌ Não |
| CSS3 | - | Styles | ❌ Não |
| JavaScript | ES6+ | Script | ❌ Não |
| PHP | 7.4+ | Server-side | ❌ Não |
| SQLite3 | - | Database | ❌ Não |
| Leaflet | 1.9.4 | Maps (CDN) | ❌ Não |

---

## 📦 Ficheiros Detalhados

### Frontend (Browser)

**index.html** (4.5 KB)
- HTML5 puro
- Estrutura semântica
- Responsivo (mobile-first)
- Acessível (ARIA labels)

**style.css** (24 KB)
- CSS3 puro
- Variáveis CSS
- Flexbox/Grid
- Animações CSS
- Tema escuro

**app.js** (50 KB)
- JavaScript ES6+ puro
- Sem frameworks (React, Vue, Angular)
- Sem bibliotecas externas (exceto Leaflet via CDN)
- Funcionalidades:
  - Gestão de derivas (CRUD)
  - Sistema de prompts
  - Diário de bordo
  - Tabs de registos
  - Geolocalização
  - Mapa Leaflet
  - Persistência localStorage

**prompts.js** (15 KB)
- 150 prompts situacionistas
- 7 categorias
- Funções de seleção aleatória

### Backend (Servidor)

**check.php** (3 KB)
- Verificação do ambiente
- Teste de PHP, SQLite, permissões
- Diagnóstico de problemas

**api/config.php** (2 KB)
- Configuração do banco SQLite
- Headers CORS
- Funções helper

**api/derivas.php** (25 KB)
- API REST completa
- Endpoints:
  - GET /api/derivas.php (listar)
  - GET /api/derivas.php?id=XXX (detalhes)
  - POST /api/derivas.php (criar)
  - PUT /api/derivas.php (atualizar)
  - DELETE /api/derivas.php?id=XXX (eliminar)
  - GET /api/derivas.php?stats=1 (estatísticas)
  - GET /api/derivas.php?config=1 (configuração)
  - POST /api/derivas.php?config=1 (salvar config)
  - POST /api/derivas.php?export=1 (exportar)
  - POST /api/derivas.php?import=1 (importar)
  - POST /api/derivas.php?ponto=1 (salvar ponto GPS)
  - GET /api/derivas.php?ponto=1&id=XXX (obter trajeto)

---

## 🗄️ Base de Dados

**SQLite** (ficheiro `data/derivas.db`)
- Criado automaticamente na primeira execução
- Não requer instalação
- Não requer configuração
- Armazenado no servidor

**Tabelas:**
- `derivas` - Dados principais das derivas
- `prompts_seguidos` - Prompts seguidos em cada deriva
- `descobertas` - Descobertas durante a deriva
- `pontos_trajeto` - Pontos GPS do trajeto
- `config` - Configurações do utilizador

---

## 🌐 Dependências Externas (CDN)

Apenas **Leaflet** (mapas) é carregado via CDN:

```html
<!-- No index.html -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

**Vantagens:**
- ✅ Não requer download/installação
- ✅ Sempre atualizado
- ✅ Cache do browser
- ✅ Funciona offline após primeiro carregamento

**Alternativa offline:**
Download dos ficheiros Leaflet e colocar na pasta `public/`:
```bash
wget https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
wget https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
```

---

## 📋 Requisitos do Servidor

### Mínimo:
- ✅ PHP 7.4 ou superior
- ✅ Extensão SQLite3 habilitada
- ✅ Permissão de escrita na pasta `data/`
- ✅ 10 MB de espaço em disco

### Recomendado:
- ✅ PHP 8.0+
- ✅ HTTPS (para geolocalização)
- ✅ 50 MB de espaço em disco

### InfinityFree:
- ✅ PHP 7.4+ incluído
- ✅ SQLite3 habilitado por padrão
- ✅ HTTPS gratuito (Let's Encrypt)
- ✅ 1 GB de espaço

---

## 🚫 O que NÃO é necessário

- ❌ Node.js
- ❌ npm
- ❌ npm install
- ❌ npm run build
- ❌ package.json
- ❌ package-lock.json
- ❌ node_modules/
- ❌ Webpack
- ❌ Vite
- ❌ Rollup
- ❌ Babel
- ❌ TypeScript
- ❌ React
- ❌ Vue
- ❌ Angular
- ❌ jQuery
- ❌ Bootstrap
- ❌ Tailwind CSS

---

## 🎯 Vantagens do Projeto Standalone

### 1. Simplicidade
- ✅ Sem instalação complexa
- ✅ Sem dependências
- ✅ Sem configuração
- ✅ Funciona imediatamente

### 2. Portabilidade
- ✅ Copiar e colar em qualquer servidor
- ✅ Funciona em qualquer hosting com PHP
- ✅ Sem preocupações com versões de Node
- ✅ Sem conflitos de dependências

### 3. Performance
- ✅ Sem overhead de build
- ✅ Ficheiros otimizados manualmente
- ✅ Carregamento rápido
- ✅ Sem bundles pesados

### 4. Manutenção
- ✅ Código legível e direto
- ✅ Sem camadas de abstração
- ✅ Fácil de debugar
- ✅ Fácil de modificar

### 5. Longevidade
- ✅ Não depende de versões específicas de Node
- ✅ Não depende de frameworks que podem ser descontinuados
- ✅ HTML/CSS/JS são standards web estáveis
- ✅ Funciona em qualquer browser moderno

---

## 📊 Comparação: Standalone vs Build

| Aspecto | Standalone (Atual) | Com Build (React/Vite) |
|---------|-------------------|------------------------|
| **Instalação** | Copiar ficheiros | npm install + build |
| **Tamanho** | ~100 KB total | ~500 KB+ (bundles) |
| **Complexidade** | Baixa | Alta |
| **Dependências** | 0 (apenas CDN Leaflet) | 100+ pacotes npm |
| **Tempo de setup** | 5 minutos | 30+ minutos |
| **Manutenção** | Fácil | Complexa |
| **Portabilidade** | Total | Limitada |
| **Performance** | Rápida | Overhead de runtime |

---

## 🔧 Como Atualizar o Projeto

### Sem Build (Método Atual):

```bash
# 1. Editar os ficheiros diretamente
nano public/app.js

# 2. Enviar para o servidor via FTP
# Ou copiar manualmente

# 3. Pronto! Não há build necessário
```

### Com Build (Se algum dia precisar):

```bash
# 1. Instalar Node.js
# 2. npm install
# 3. npm run build
# 4. Copiar pasta dist/ para o servidor
# 5. Muito mais complexo!
```

---

## ✅ Checklist de Verificação

- [x] Ficheiros HTML/CSS/JS puros
- [x] Sem package.json
- [x] Sem node_modules/
- [x] Sem configuração de build
- [x] Funciona diretamente no browser
- [x] Funciona em qualquer servidor PHP
- [x] Sem dependências de Node.js
- [x] Sem frameworks JavaScript
- [x] Código legível e manutenível
- [x] Documentação completa

---

## 📞 Conclusão

**O projeto é 100% standalone e não requer `npm run build`.**

Todos os ficheiros na pasta `public/` podem ser:
- ✅ Abertos diretamente no browser (HTML)
- ✅ Enviados diretamente para o servidor (FTP)
- ✅ Editados diretamente (sem compilação)
- ✅ Usados imediatamente (sem instalação)

**Para fazer deploy:**
1. Copiar pasta `public/` para o servidor
2. Configurar permissões da pasta `data/` (755)
3. Aceder ao URL do site
4. Pronto!

---

**Documento criado:** 2026-01-15  
**Versão:** 1.0  
**Status:** ✅ Confirmado - Projeto 100% Standalone
