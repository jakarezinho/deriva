# 🔄 Guia de Migração - v1.0 para v2.0

## ⚠️ Mudança Importante

A versão 2.0 tem uma **estrutura completamente diferente** da v1.0. A base de dados e os ficheiros não são compatíveis.

---

## 🎯 O Que Mudou

### Removido
- ❌ Sistema de prompts aleatórios
- ❌ Tempo de duração
- ❌ Categorias de prompts
- ❌ Diário de bordo de prompts
- ❌ Tabs de registos (pensamentos, encontros, etc.)
- ❌ Pausar/Continuar deriva

### Adicionado
- ✅ Sistema de descobertas com fotos
- ✅ Upload de fotos com compressão
- ✅ Miniaturas no mapa
- ✅ Arquivo de derivas
- ✅ Geolocalização por descoberta

---

## 📊 Comparação

| Funcionalidade | v1.0 | v2.0 |
|----------------|------|------|
| Prompts aleatórios | ✅ | ❌ |
| Descobertas com fotos | ❌ | ✅ |
| Mapa com marcadores | ✅ (início/fim) | ✅ (todas descobertas) |
| Diário de bordo | ✅ (prompts) | ❌ |
| Arquivo de derivas | ❌ | ✅ |
| GPS por descoberta | ❌ | ✅ |
| Upload de fotos | ❌ | ✅ |
| Pausar deriva | ✅ | ❌ |
| Editar deriva | ✅ | ✅ |
| Eliminar deriva | ✅ | ✅ |

---

## 🗄️ Migração da Base de Dados

### Opção 1: Começar do Zero (Recomendado)

```bash
# Backup da base antiga
cp data/derivas.db data/derivas.db.backup

# Apagar base antiga
rm data/derivas.db

# A base será recriada automaticamente na próxima execução
```

**Vantagem:** Base limpa, sem dados antigos  
**Desvantagem:** Perde todas as derivas anteriores

### Opção 2: Manter Base Antiga (Não Recomendado)

A base antiga tem tabelas que não são usadas na v2.0:
- `prompts_seguidos` (não usada)
- `pontos_trajeto` (não usado)
- `config` (não usado)

**Problema:** A nova tabela `descobertas` é diferente da antiga.

**Solução:** Não é possível migrar automaticamente. Os dados antigos não serão visíveis na v2.0.

---

## 📸 Migração de Fotos

### v1.0
- Não havia upload de fotos
- Apenas texto e localização

### v2.0
- Upload de fotos com compressão
- Miniaturas automáticas
- Marcadores no mapa

**Conclusão:** Não há fotos para migrar.

---

## 🔄 Passo a Passo da Migração

### 1. Backup Completo

```bash
# Backup da base de dados
cp data/derivas.db data/derivas.db.backup

# Backup de ficheiros
tar -czf backup_v1.tar.gz public/
```

### 2. Atualizar Ficheiros

```bash
# Substituir ficheiros antigos pelos novos
# Frontend
cp nova_versao/public/index.html public/
cp nova_versao/public/style.css public/
cp nova_versao/public/app.js public/

# Backend
cp nova_versao/public/api/config.php public/api/
cp nova_versao/public/api/derivas.php public/api/
cp nova_versao/public/api/descobertas.php public/api/
cp nova_versao/public/api/upload.php public/api/

# Remover ficheiros antigos
rm public/prompts.js
```

### 3. Criar Estrutura de Pastas

```bash
# Criar pastas para fotos
mkdir -p data/fotos/original
mkdir -p data/fotos/thumb

# Definir permissões
chmod 755 data/fotos/
chmod 755 data/fotos/original/
chmod 755 data/fotos/thumb/
```

### 4. Atualizar .htaccess

```bash
# Substituir .htaccess
cp nova_versao/public/api/.htaccess public/api/
cp nova_versao/public/data/.htaccess public/data/
```

### 5. Apagar Base Antiga (Opcional)

```bash
# Apagar base antiga
rm data/derivas.db

# Ou manter como backup
mv data/derivas.db data/derivas.db.old
```

### 6. Testar

```bash
# Aceder ao site
http://teusite.com

# Verificar:
# - Página carrega sem erros
# - Botão "+ Nova Deriva" funciona
# - Upload de fotos funciona
# - Mapa mostra marcadores
```

---

## 📋 Checklist de Migração

- [ ] Backup da base de dados antiga
- [ ] Backup dos ficheiros antigos
- [ ] Substituir frontend (index.html, style.css, app.js)
- [ ] Substituir backend (api/*.php)
- [ ] Remover prompts.js
- [ ] Criar pastas data/fotos/original/ e data/fotos/thumb/
- [ ] Definir permissões 755 nas pastas
- [ ] Atualizar .htaccess
- [ ] Apagar base antiga (opcional)
- [ ] Testar criação de deriva
- [ ] Testar upload de foto
- [ ] Testar mapa
- [ ] Testar arquivo

---

## 🆘 Problemas na Migração

### "Base de dados incompatível"
**Causa:** Estrutura das tabelas mudou  
**Solução:** Apagar data/derivas.db e deixar recriar

### "Erro ao enviar foto"
**Causa:** Pastas de fotos não existem ou sem permissão  
**Solução:** Criar pastas e definir permissões 755

### "Mapa não mostra marcadores"
**Causa:** Leaflet não carrega  
**Solução:** Verificar conexão internet (CDN)

### "GPS não funciona"
**Causa:** HTTP em vez de HTTPS  
**Solução:** Ativar HTTPS no servidor

---

## 💾 Exportar Dados Antigos (Opcional)

Se quiseres manter os dados da v1.0:

### 1. Exportar como JSON

```bash
# Aceder ao site antigo
http://teusite.com

# Ir ao Histórico
# Clicar em "↓ Exportar"
# Guardar ficheiro JSON
```

### 2. Importar na v2.0 (Não Suportado)

**Nota:** A v2.0 não suporta importação de dados da v1.0 devido à diferença de estrutura.

**Alternativa:** Manualmente recriar as derivas importantes na v2.0.

---

## 🎯 Recomendação

**Para a maioria dos utilizadores:**

1. ✅ Fazer backup da base antiga
2. ✅ Apagar base antiga
3. ✅ Começar do zero com v2.0
4. ✅ Recriar derivas importantes manualmente

**Porquê?**
- Estrutura completamente diferente
- Não há forma automática de migrar
- v2.0 é mais simples e focada
- Dados antigos não são compatíveis

---

## 📞 Suporte

Se tiveres problemas na migração:

1. Verificar GUIA_IMPLEMENTACAO.md
2. Verificar check.php
3. Verificar logs de erro do PHP
4. Verificar consola do browser (F12)

---

**Versão:** 2.0  
**Data:** 2026-01-15  
**Status:** ✅ Guia de Migração Completo
