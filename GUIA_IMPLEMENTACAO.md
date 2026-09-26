# 🚀 Guia de Implementação - Deriva Urbana v2.0

## ✅ Fase 1 e 2 Completas

---

## 📋 O Que Foi Implementado

### Fase 1: Base ✅
- [x] Nova estrutura do banco de dados (derivas + descobertas)
- [x] CRUD de derivas (criar, listar, arquivar, reativar, eliminar)
- [x] Interface básica de deriva ativa
- [x] Botão "Localizar-me" com GPS
- [x] Sistema de arquivo de derivas

### Fase 2: Fotos ✅
- [x] Upload de fotos para servidor
- [x] Processamento no browser (compressão adaptativa)
- [x] Correção de orientação EXIF
- [x] Geração de miniaturas (200x200px)
- [x] Marcadores no mapa com fotos
- [x] Janela flutuante (foto + notas)
- [x] Galeria de descobertas

---

## 🎯 Como Testar

### 1. Deploy no Servidor

```bash
# Copiar pasta public/ para /htdocs/
# Criar pastas:
mkdir -p data/fotos/original
mkdir -p data/fotos/thumb

# Definir permissões
chmod 755 data/
chmod 755 data/fotos/
chmod 755 data/fotos/original/
chmod 755 data/fotos/thumb/

# Aceder
http://teusite.com
```

### 2. Testar Funcionalidades

#### Criar Deriva
1. Clicar em "+ Nova Deriva"
2. Dar um título (ou deixar em branco)
3. Verificar que aparece no header

#### Adicionar Descoberta
1. Clicar em "📍 Localizar-me" → ver coordenadas
2. Clicar em "📷 Tirar Foto" → tirar foto
3. Escrever notas
4. Clicar em "💾 Guardar"
5. Verificar que aparece no mapa e na lista

#### Ver Detalhes
1. Clicar numa miniatura (mapa ou lista)
2. Ver foto grande + notas + localização
3. Clicar em "✕" para fechar

#### Arquivar Deriva
1. Clicar em "📁 Arquivar"
2. Confirmar
3. Verificar que vai para o Arquivo

#### Reativar Deriva
1. Ir para "📁 Arquivo"
2. Clicar em "Reativar" numa deriva
3. Verificar que volta a ser ativa

---

## 📊 Estrutura Final

### Ficheiros Criados/Modificados

**Frontend:**
- ✅ `public/index.html` - Nova interface
- ✅ `public/style.css` - Novos estilos
- ✅ `public/app.js` - Nova lógica

**Backend:**
- ✅ `public/api/config.php` - Nova estrutura BD
- ✅ `public/api/derivas.php` - CRUD derivas
- ✅ `public/api/descobertas.php` - CRUD descobertas
- ✅ `public/api/upload.php` - Upload de fotos

**Segurança:**
- ✅ `public/api/.htaccess` - Proteção API
- ✅ `public/data/.htaccess` - Proteção dados

**Documentação:**
- ✅ `NOVA_VERSAO.md` - Guia da v2.0
- ✅ `GUIA_IMPLEMENTACAO.md` - Este ficheiro

**Removido:**
- ❌ `public/prompts.js` - Não é mais necessário

---

## 🗄️ Base de Dados

### Nova Estrutura

```sql
-- Derivas
CREATE TABLE derivas (
    id TEXT PRIMARY KEY,
    titulo TEXT,
    data_criacao TEXT NOT NULL,
    estado TEXT DEFAULT "ativa",
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Descobertas
CREATE TABLE descobertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deriva_id TEXT NOT NULL,
    notas TEXT,
    latitude REAL,
    longitude REAL,
    foto_path TEXT,
    foto_thumb_path TEXT,
    orientacao INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
);
```

### Migração

**⚠️ IMPORTANTE:** A base de dados antiga (com prompts) não é compatível.

**Opções:**
1. **Apagar base antiga:**
   ```bash
   rm data/derivas.db
   # Será recriada automaticamente
   ```

2. **Backup primeiro:**
   ```bash
   cp data/derivas.db data/derivas.db.backup
   rm data/derivas.db
   ```

---

## 📸 Processamento de Fotos

### Fluxo Completo

```
1. Utilizador tira foto
   ↓
2. Browser lê EXIF (orientação)
   ↓
3. Canvas redimensiona (compressão adaptativa)
   ↓
4. Aplica rotação correta
   ↓
5. Gera miniatura 200x200px
   ↓
6. Envia foto processada para servidor
   ↓
7. Servidor guarda em:
   - data/fotos/original/ (foto processada)
   - data/fotos/thumb/ (miniatura)
   ↓
8. Retorna URLs para o frontend
   ↓
9. Frontend mostra no mapa e lista
```

### Compressão Adaptativa

| Tamanho Original | Fator | Resultado |
|------------------|-------|-----------|
| >5MB | 50% | ~2.5MB |
| >2MB | 65% | ~1.3MB |
| >1MB | 80% | ~800KB |
| <1MB | 100% | Sem alteração |

### Orientação EXIF

| Valor EXIF | Rotação |
|------------|---------|
| 1 | 0° (normal) |
| 3 | 180° |
| 6 | 90° (direita) |
| 8 | 270° (esquerda) |

---

## 🎨 Interface

### Página Principal (Deriva Ativa)

```
┌─────────────────────────────────────────┐
│ ◉ DERIVA                                │
│ "Manhã em Alfama" - 15/01/2026         │
│                           [✏️] [📁]     │
├─────────────────────────────────────────┤
│ [📍 Localizar]  [📷 Foto]  [✍️ Notas]  │
├─────────────────────────────────────────┤
│ 📍 38.7108, -9.1375 (±10m)             │
├─────────────────────────────────────────┤
│                                         │
│         MAPA LEAFLET                    │
│   📸   📸      📸                       │
│         📸                              │
│   📸          📸                        │
│                                         │
├─────────────────────────────────────────┤
│ Descobertas (8)                         │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│ │ 📷  │ │ 📷  │ │ 📷  │ │ 📷  │       │
│ └─────┘ └─────┘ └─────┘ └─────┘       │
│ 10:15   10:32   10:45   11:02          │
└─────────────────────────────────────────┘
```

### Modal de Nova Descoberta

```
┌───────────────────────────────────┐
│ Nova Descoberta              ✕   │
├───────────────────────────────────┤
│ ┌─────────────────────────────┐  │
│ │                             │  │
│ │      PREVIEW DA FOTO        │  │
│ │                             │  │
│ └─────────────────────────────┘  │
│                                   │
│ 📍 Localização                    │
│ [📍 Capturar localização atual]  │
│ 38.7108, -9.1375                 │
│                                   │
│ 📷 Foto                           │
│ [📷 Escolher ou tirar foto]      │
│                                   │
│ ✍️ Notas                          │
│ ┌─────────────────────────────┐  │
│ │ Porta antiga com azulejos   │  │
│ │ azuis. O número 17 está     │  │
│ │ quase apagado...            │  │
│ └─────────────────────────────┘  │
│                                   │
│ [Cancelar]          [💾 Guardar] │
└───────────────────────────────────┘
```

---

## 🔧 API Endpoints

### Derivas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/derivas.php` | Listar todas |
| GET | `/api/derivas.php?id=XXX` | Obter uma |
| POST | `/api/derivas.php` | Criar nova |
| PUT | `/api/derivas.php` | Atualizar |
| DELETE | `/api/derivas.php?id=XXX` | Eliminar |
| POST | `/api/derivas.php?arquivar=1` | Arquivar |
| POST | `/api/derivas.php?reativar=1` | Reativar |

### Descobertas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/descobertas.php?deriva_id=XXX` | Listar |
| POST | `/api/descobertas.php` | Criar |
| PUT | `/api/descobertas.php` | Atualizar |
| DELETE | `/api/descobertas.php?id=XXX` | Eliminar |

### Upload

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/upload.php` | Upload foto (FormData) |

---

## 🐛 Problemas Conhecidos

### 1. EXIF não lido em alguns browsers
**Solução:** O código já tem fallback para quando EXIF não está disponível.

### 2. GPS não funciona sem HTTPS
**Solução:** Ativar HTTPS no servidor (Let's Encrypt).

### 3. Fotos muito grandes
**Solução:** Compressão adaptativa já implementada.

### 4. Mapa não centra na localização
**Solução:** Aguardar GPS fixar (pode demorar alguns segundos).

---

## 🚀 Próximas Fases (Opcional)

### Fase 3: Melhorias
- [ ] Exportar deriva como JSON
- [ ] Múltiplas fotos por descoberta
- [ ] Tags/categorias
- [ ] Filtro de descobertas
- [ ] Ordenação (data, localização)

### Fase 4: Avançado
- [ ] Modo offline (IndexedDB)
- [ ] Sincronização automática
- [ ] Partilha de derivas
- [ ] Estatísticas avançadas
- [ ] Timeline visual

### Fase 5: Extra
- [ ] Exportar como PDF
- [ ] Galeria de fotos completa
- [ ] Comentários em descobertas
- [ ] Favoritos
- [ ] Pesquisa

---

## 📞 Suporte

### Problemas Comuns

**"Erro ao conectar à API"**
- Verificar se PHP está instalado
- Verificar permissões das pastas
- Verificar check.php

**"Erro ao enviar foto"**
- Verificar extensão GD do PHP
- Verificar permissões da pasta data/fotos/
- Verificar tamanho máximo (20MB)

**"GPS não funciona"**
- Verificar HTTPS
- Verificar permissões do browser
- Verificar se GPS está ativo no dispositivo

---

## ✅ Checklist de Deploy

- [ ] Copiar pasta public/ para /htdocs/
- [ ] Criar pasta data/fotos/original/
- [ ] Criar pasta data/fotos/thumb/
- [ ] Definir permissões 755 nas pastas
- [ ] Verificar check.php (tudo ✓ verde)
- [ ] Testar criação de deriva
- [ ] Testar upload de foto
- [ ] Testar mapa
- [ ] Testar arquivo

---

## 🎉 Conclusão

**Fase 1 e 2 completas com sucesso!**

A aplicação está pronta para uso com:
- ✅ Sistema de descobertas
- ✅ Upload de fotos
- ✅ Mapa interativo
- ✅ Arquivo de derivas
- ✅ 100% standalone

**Próximo passo:** Testar no terreno e coletar feedback!

---

**Versão:** 2.0  
**Data:** 2026-01-15  
**Status:** ✅ Fase 1 e 2 Completas
