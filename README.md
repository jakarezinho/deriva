# 🚶 Deriva Urbana - Aplicação Web Situacionista

## Aplicação web para prática de deriva urbana baseada na teoria de Guy Debord

---

## ⚡ Início Rápido (5 minutos)

### 1. Deploy no InfinityFree (ou qualquer hosting PHP)

```bash
# Copiar pasta public/ para o servidor
# Criar pasta data/ com permissão 755
# Aceder: http://teusite.com
```

**✅ Pronto! Sem Node.js, sem build, sem complicações.**

---

## 🎯 O Que É Isto?

Uma aplicação web **100% standalone** para praticar **deriva urbana** - uma técnica situacionista de exploração da cidade sem destino fixo, baseada na teoria de Guy Debord (1956).

### Características Principais

- ✅ **150 prompts situacionistas** em 7 categorias
- ✅ **Mapa interativo** com rastreamento GPS
- ✅ **Diário de bordo** cronológico
- ✅ **8 tipos de registos** (descobertas, pensamentos, encontros, etc.)
- ✅ **Persistência dual** (localStorage + SQLite no servidor)
- ✅ **Design responsivo** e tema escuro
- ✅ **Zero dependências** (apenas Leaflet via CDN)

---

## 📁 Estrutura do Projeto

```
public/                      ← 🚀 FICHEIROS PARA DEPLOY
├── index.html               ← Frontend (HTML5 puro)
├── style.css                ← Estilos (CSS3 puro)
├── app.js                   ← Lógica (JavaScript ES6+)
├── prompts.js               ← 150 prompts situacionistas
├── check.php                ← Verificação do ambiente
├── api/
│   ├── config.php           ← Configuração SQLite
│   └── derivas.php          ← API REST completa
└── data/
    └── derivas.db           ← Base de dados (auto-criado)
```

**Total:** ~125 KB | **Ficheiros:** 9 | **Build necessário:** ❌ NÃO

---

## 🚀 Como Usar

### Método 1: Abrir Localmente (Teste)
```bash
cd public/
# Abrir index.html no browser
```

### Método 2: Servidor Local (Teste Completo)
```bash
cd public/
php -S localhost:8000
# Aceder: http://localhost:8000
```

### Método 3: Servidor Remoto (Produção)
```bash
# Via FTP: Copiar pasta public/ para /htdocs/
# Criar pasta data/ com permissão 755
# Aceder: http://teusite.com
```

**Guia completo:** [DEPLOY_SEM_BUILD.md](DEPLOY_SEM_BUILD.md)

---

## 🎨 Funcionalidades

### Gestão de Derivas
- ✅ Iniciar, pausar, continuar, finalizar
- ✅ Editar e eliminar derivas
- ✅ Persistência automática
- ✅ Export/Import JSON

### Sistema de Prompts
- ✅ 150 prompts em 7 categorias
- ✅ Filtro por categoria
- ✅ Prompt ativo destacado
- ✅ Timer em tempo real
- ✅ Diário de bordo

### Registos da Deriva
- 🔍 Descobertas
- 💭 Pensamentos errantes
- 🎭 Encontros
- 🗣️ Frases ouvidas
- 🎁 Objetos encontrados
- 🌡️ Atmosfera do lugar
- 💫 Desejos despertados
- 🎲 Acasos significativos

### Geolocalização
- ✅ Rastreamento GPS contínuo
- ✅ Mapa Leaflet interativo
- ✅ Visualização do trajeto
- ✅ Cálculo de distância

---

## 📚 Documentação

### Guias Principais
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - Início rápido
- **[DEPLOY_SEM_BUILD.md](DEPLOY_SEM_BUILD.md)** - Deploy sem build
- **[CONFIRMACAO_STANDALONE.md](CONFIRMACAO_STANDALONE.md)** - Confirmação standalone

### Técnicos
- **[ESTRUTURA_FINAL.md](ESTRUTURA_FINAL.md)** - Estrutura completa
- **[RELATORIO_TECNICO.md](RELATORIO_TECNICO.md)** - Arquitetura e lógica
- **[RELATORIO_FUNCIONALIDADES.md](RELATORIO_FUNCIONALIDADES.md)** - Funções implementadas

### Funcionalidades
- **[RASTREAMENTO_TRAJETO.md](RASTREAMENTO_TRAJETO.md)** - GPS e mapa
- **[PERSISTENCIA_DERIVA.md](PERSISTENCIA_DERIVA.md)** - localStorage
- **[MELHORIAS_IMPLEMENTADAS.md](MELHORIAS_IMPLEMENTADAS.md)** - Melhorias

### Resolução de Problemas
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problemas comuns
- **[RELATORIO_ERROS_CORRECOES.md](RELATORIO_ERROS_CORRECOES.md)** - Bugs corrigidos

---

## 🔧 Tecnologias

| Tecnologia | Tipo | Necessita Build? |
|------------|------|------------------|
| HTML5 | Markup | ❌ Não |
| CSS3 | Styles | ❌ Não |
| JavaScript ES6+ | Script | ❌ Não |
| PHP 7.4+ | Server-side | ❌ Não |
| SQLite3 | Database | ❌ Não |
| Leaflet 1.9.4 | Maps (CDN) | ❌ Não |

**Dependências:** ZERO (apenas Leaflet via CDN)  
**Build:** NÃO necessário  
**Node.js:** NÃO necessário

---

## 📊 Estatísticas

- **Ficheiros:** 9
- **Tamanho total:** ~125 KB
- **Linhas de código:** ~3000
- **Prompts:** 150
- **Categorias:** 7
- **Funcionalidades:** 25+
- **Tempo de deploy:** 5 minutos

---

## ✅ Requisitos

### Servidor
- ✅ PHP 7.4+ (recomendado 8.0+)
- ✅ Extensão SQLite3
- ✅ Permissão de escrita na pasta `data/`
- ✅ 10 MB de espaço

### Browser
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Hosting
- ✅ InfinityFree (gratuito)
- ✅ Qualquer hosting com PHP
- ✅ Servidor local (XAMPP, WAMP, MAMP)

---

## 🎯 Casos de Uso

### Pessoal
- Derivas urbanas individuais
- Registo de experiências
- Mapeamento de trajetos
- Diário psicogeográfico

### Educacional
- Ensino de psicogeografia
- Estudos urbanos
- Workshops de deriva
- Projetos artísticos

### Comunitário
- Grupos de deriva
- Exploração urbana
- Mapeamento colaborativo

---

## 🔐 Segurança

- ✅ .htaccess protege base de dados
- ✅ CORS configurado
- ✅ Validação de inputs
- ✅ Prepared statements (SQL injection)
- ✅ HTTPS recomendado (para GPS)

---

## 🐛 Troubleshooting

### Problema: Funções não aparecem
**Solução:** Limpar cache do browser + Hard refresh (Ctrl+F5)

### Problema: API não conecta
**Solução:** Verificar `check.php` e permissões da pasta `data/`

### Problema: Mapa não carrega
**Solução:** Verificar conexão internet (Leaflet via CDN)

**Guia completo:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📖 Conceito Situacionista

### Base Teórica
- **Guy Debord** - Théorie de la Dérive (1956)
- **Psicogeografia** - Estudo da influência do ambiente nas emoções
- **Détournement** - Reapropriação de elementos culturais

### Aplicação
Os 150 prompts funcionam como **"situações construídas"** - dispositivos que quebram a rotina perceptiva e abrem novas possibilidades de experiência na cidade.

---

## 🔄 Manutenção

### Atualizar Frontend
```bash
# 1. Editar ficheiro localmente
nano public/app.js

# 2. Enviar para servidor via FTP
# 3. Refresh no browser (Ctrl+F5)
# Pronto! Sem build necessário
```

### Backup
```bash
# Via FTP: Descer todos os ficheiros
# Via Interface: Botão "Exportar" no Histórico
# Via SQLite: Copiar data/derivas.db
```

---

## 📞 Suporte

1. **Verificar check.php** - `http://teusite.com/check.php`
2. **Verificar Console** - F12 → Console
3. **Verificar Network** - F12 → Network
4. **Consultar documentação** - Pasta DOCUMENTACAO/

---

## 🎉 Resumo

**Deriva Urbana** é uma aplicação web completa e funcional, desenvolvida com tecnologias standard da web, totalmente standalone, sem necessidade de build ou dependências complexas.

**Pronto para:**
- ✅ Deploy imediato (5 minutos)
- ✅ Uso pessoal
- ✅ Modificação fácil
- ✅ Manutenção simples

**Tempo de desenvolvimento:** ~10 horas  
**Linhas de código:** ~3000  
**Dependências:** 0  
**Build necessário:** ❌ NÃO

---

## 📄 Licença

Este projeto é de uso pessoal e educacional.

**Inspirado em:** Guy Debord - Théorie de la Dérive (1956)

---

**Criado:** 2026-01-15  
**Versão:** 1.0  
**Status:** ✅ Completo e Funcional

---

## 🚀 Começar Agora

```bash
# 1. Copiar pasta public/ para o servidor
# 2. Criar pasta data/ com permissão 755
# 3. Aceder: http://teusite.com
# 4. Começar a derivar! ◉
```

**Boa deriva!** 🚶‍♂️🗺️
