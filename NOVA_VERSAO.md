# 🚶 Deriva Urbana v2.0 - Diário de Descobertas

## Nova versão focada em descobertas georreferenciadas com fotos

---

## 🎯 Nova Filosofia

A aplicação deixou de ser guiada por prompts e tornou-se um **diário de exploração urbana** focado no registo de descobertas com fotos e notas georreferenciadas.

---

## ✨ Principais Mudanças

### ❌ Removido
- Sistema de prompts aleatórios
- Tempo de duração da deriva
- Categorias de prompts
- Diário de bordo de prompts

### ✅ Adicionado
- Sistema de descobertas com fotos
- Upload de fotos com compressão adaptativa
- Correção automática de orientação (EXIF)
- Miniaturas como marcadores no mapa
- Janela flutuante com foto + notas
- Galeria de descobertas
- Arquivo de derivas

---

## 🎨 Como Funciona

### 1. Criar Nova Deriva
- Clique em "+ Nova Deriva"
- Dê um título (opcional, usa data por padrão)
- A deriva anterior é automaticamente arquivada

### 2. Durante a Deriva
- **📍 Localizar-me**: Captura sua localização GPS
- **📷 Tirar Foto**: Abre câmera ou galeria
- **✍️ Notas**: Adiciona texto à descoberta
- **💾 Guardar**: Salva a descoberta com foto + GPS + notas

### 3. Visualizar
- **Mapa**: Miniaturas das fotos como marcadores
- **Lista**: Galeria cronológica de descobertas
- **Clique**: Abre janela flutuante com foto grande + notas

### 4. Arquivar
- Clique em "📁 Arquivar" para terminar a deriva
- A deriva vai para o Arquivo
- Pode reativar ou eliminar depois

---

## 📸 Processamento de Fotos

### Compressão Adaptativa
- **>5MB**: Comprime para 50%
- **>2MB**: Comprime para 65%
- **>1MB**: Comprime para 80%
- **<1MB**: Sem compressão

### Orientação EXIF
- Detecta automaticamente a orientação da foto
- Corrige rotação (0°, 90°, 180°, 270°)
- Fotos aparecem sempre na orientação correta

### Miniaturas
- Geradas automaticamente (200x200px)
- Crop central da imagem
- Usadas como marcadores no mapa

---

## 🗄️ Estrutura de Dados

### Deriva
```
{
  id: string,
  titulo: string,
  data_criacao: string (ISO),
  estado: 'ativa' | 'arquivada',
  descobertas: [Descoberta]
}
```

### Descoberta
```
{
  id: number,
  notas: string,
  latitude: number,
  longitude: number,
  foto_path: string,
  foto_thumb_path: string,
  orientacao: number (0, 90, 180, 270),
  timestamp: string (ISO)
}
```

---

## 📁 Estrutura de Ficheiros

```
public/
├── index.html              ← Nova interface
├── style.css               ← Novos estilos
├── app.js                  ← Nova lógica
├── check.php               ← Verificação
│
├── api/
│   ├── config.php          ← Nova estrutura BD
│   ├── derivas.php         ← CRUD derivas
│   ├── descobertas.php     ← CRUD descobertas (NOVO)
│   ├── upload.php          ← Upload fotos (NOVO)
│   └── .htaccess           ← Segurança
│
└── data/
    ├── .htaccess
    ├── derivas.db           ← Base de dados
    └── fotos/               ← Fotos (NOVO)
        ├── original/        ← Fotos originais
        └── thumb/           ← Miniaturas
```

---

## 🚀 Deploy

### Requisitos
- PHP 7.4+ com SQLite3
- Extensão GD (para processamento de imagens)
- Extensão EXIF (para orientação)
- Permissão de escrita em `data/` e `data/fotos/`

### Passos
```bash
# 1. Copiar pasta public/ para /htdocs/
# 2. Criar pastas:
#    - data/fotos/original/
#    - data/fotos/thumb/
# 3. Definir permissões 755 nas pastas
# 4. Aceder: http://teusite.com
```

---

## 🎯 Funcionalidades

### Gestão de Derivas
- ✅ Criar nova deriva
- ✅ Editar título
- ✅ Arquivar deriva
- ✅ Reativar deriva arquivada
- ✅ Eliminar deriva

### Descobertas
- ✅ Adicionar descoberta com foto
- ✅ Capturar localização GPS
- ✅ Adicionar notas
- ✅ Ver detalhes (foto + notas)
- ✅ Eliminar descoberta

### Mapa
- ✅ Miniaturas como marcadores
- ✅ Clique para ver detalhes
- ✅ Localização atual

### Arquivo
- ✅ Lista de derivas arquivadas
- ✅ Ver descobertas de deriva arquivada
- ✅ Reativar deriva
- ✅ Eliminar deriva

---

## 🔧 Tecnologias

- **HTML5** - Estrutura
- **CSS3** - Estilos
- **JavaScript ES6+** - Lógica
- **PHP 7.4+** - Backend
- **SQLite3** - Base de dados
- **Leaflet** - Mapas
- **GD Library** - Processamento de imagens
- **EXIF** - Orientação de fotos

---

## 📱 Compatibilidade

### Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop
- ✅ Tablet
- ✅ Smartphone (com câmera)

---

## 🔐 Segurança

- ✅ Validação de tipo MIME
- ✅ Limite de tamanho (20MB)
- ✅ Nomes de ficheiro únicos
- ✅ Pastas protegidas por .htaccess
- ✅ Sanitização de inputs

---

## 📊 Estatísticas

- **Ficheiros:** 8
- **Tamanho:** ~100 KB (código)
- **Endpoints API:** 4
- **Tabelas BD:** 2

---

## 🎉 Vantagens

### Simplicidade
- ✅ Interface focada e clara
- ✅ Fluxo intuitivo
- ✅ Sem distrações

### Performance
- ✅ Compressão adaptativa
- ✅ Miniaturas otimizadas
- ✅ Lazy loading

### Experiência
- ✅ Fotos georreferenciadas
- ✅ Mapa visual
- ✅ Galeria cronológica

---

## 🚀 Próximas Fases (Opcional)

### Fase 3: Melhorias
- [ ] Exportar deriva como JSON
- [ ] Múltiplas fotos por descoberta
- [ ] Tags/categorias
- [ ] Trajeto no mapa (opcional)

### Fase 4: Avançado
- [ ] Modo offline
- [ ] Sincronização
- [ ] Partilha de derivas
- [ ] Estatísticas avançadas

---

**Versão:** 2.0  
**Data:** 2026-01-15  
**Status:** ✅ Fase 1 e 2 Completas
