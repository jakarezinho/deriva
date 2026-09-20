# 🗺️ Deriva Urbana - Com Mapa Leaflet

## ✅ Novidades

### 📍 Geolocalização e Mapa
- **Captura automática de localização** durante a deriva
- **Mapa interativo** com todas as derivas registradas
- **Marcadores visuais** mostrando início e fim de cada deriva
- **Popups informativos** com detalhes de cada deriva
- **Visualização de trajetos** no mapa

### ✏️ Editar e Eliminar Derivas
- **Edição completa** de todas as informações da deriva
- **Exclusão individual** com confirmação
- **Exclusão em massa** (apagar tudo)

---

## 🗺️ Como Usar o Mapa

### 1. Ativar Geolocalização
Quando você inicia uma deriva, o app pede permissão para usar sua localização. **Aceite** para que as derivas apareçam no mapa.

### 2. Visualizar Derivas
1. Clique em **"🗺️ Mapa"** na navegação
2. O mapa mostra todas as derivas com localização
3. **Marcadores roxos** = início da deriva
4. **Marcadores verdes** = fim da deriva
5. Clique em um marcador para ver detalhes

### 3. Informações no Popup
Ao clicar em um marcador, você vê:
- Data da deriva
- Local (se informado)
- Clima
- Número de prompts seguidos
- Duração
- Humor
- Primeiras descobertas

---

## ✏️ Editar uma Deriva

1. Vá em **"▤ Histórico"**
2. Clique na deriva que deseja editar
3. No modal de detalhes, clique em **"Editar"**
4. Altere qualquer informação:
   - Local de início/fim
   - Duração
   - Humor
   - Clima
   - Notas
   - Descobertas (adicionar/remover)
   - Prompts seguidos (remover)
5. Clique em **"Salvar Alterações"**

---

## 🗑️ Eliminar Derivas

### Individual
1. Vá em **"▤ Histórico"**
2. Clique na deriva
3. Clique em **"Excluir"**
4. Confirme a exclusão

### Todas de uma vez
1. Vá em **"⚙ Config"**
2. Role até **"Zona de Perigo"**
3. Clique em **"Apagar Tudo"**
4. Confirme (ação irreversível!)

---

## 📍 Privacidade da Localização

- A localização é **capturada apenas** quando você inicia uma deriva
- Você pode **negar a permissão** - o app funciona sem localização
- Os dados ficam **armazenados no seu servidor**
- Você pode **excluir** as derivas a qualquer momento
- Use **"Exportar"** para fazer backup antes de excluir

---

## 🎨 Personalização do Mapa

### Cores dos Marcadores
No arquivo `app.js`, procure pela função `carregarDerivasNoMapa`:

```javascript
// Marcador de início (roxo)
const marker = L.marker([lat, lng]).addTo(mapa);

// Marcador de fim (verde)
const marker = L.marker([lat, lng], {
  icon: L.divIcon({
    html: "<div style='background: #34d399; ...'></div>"
  })
}).addTo(mapa);
```

### Tile Layer (Estilo do Mapa)
No arquivo `app.js`, na função `initMapa`:

```javascript
// OpenStreetMap (padrão)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Alternativas:
// CartoDB Dark Matter (tema escuro)
// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png')

// CartoDB Positron (tema claro)
// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png')
```

---

## 📊 Estrutura do Banco de Dados

### Tabela `derivas`
```sql
CREATE TABLE derivas (
    id TEXT PRIMARY KEY,
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    duracao INTEGER,
    local_inicio TEXT,
    local_fim TEXT,
    notas TEXT,
    humor INTEGER,
    clima TEXT,
    distancia REAL,
    localizacao_inicio_lat REAL,    -- Nova coluna
    localizacao_inicio_lng REAL,    -- Nova coluna
    localizacao_fim_lat REAL,       -- Nova coluna
    localizacao_fim_lng REAL,       -- Nova coluna
    created_at DATETIME,
    updated_at DATETIME
);
```

---

## 🔧 Requisitos para Geolocalização

- **HTTPS** (obrigatório para geolocalização em produção)
- **Permissão do usuário** (browser pede permissão)
- **GPS habilitado** no dispositivo
- **InfinityFree** suporta HTTPS gratuito via Let's Encrypt

### Ativar HTTPS no InfinityFree
1. No painel, vá em **"SSL Certificates"**
2. Clique em **"Let's Encrypt SSL"**
3. Selecione seu domínio
4. Clique em **"Issue"**
5. Aguarde a ativação (pode levar alguns minutos)

---

## 🆘 Problemas com Geolocalização

### "Geolocalização não suportada"
- Seu navegador não suporta geolocalização
- Use um navegador moderno (Chrome, Firefox, Safari, Edge)

### "Erro ao capturar localização"
- Verifique se o GPS está habilitado
- Confirme que deu permissão ao navegador
- Em desktop, pode não funcionar sem GPS físico
- Em mobile, funcina melhor com GPS ativo

### "Mapa não carrega"
- Verifique conexão com internet (Leaflet precisa carregar tiles)
- Confirme que o container do mapa tem altura definida
- Abra o console (F12) para ver erros

### Marcadores não aparecem
- Verifique se as derivas têm localização salva
- Confira se a função `carregarDerivasNoMapa` está sendo chamada
- Abra o console para ver se há erros

---

## 📱 Uso em Dispositivos Móveis

A geolocalização funciona melhor em dispositivos móveis:

1. **Android**: GPS + Wi-Fi + Dados móveis
2. **iOS**: GPS + Wi-Fi
3. **Precisão**: 5-20 metros em áreas urbanas

### Dicas
- Mantenha o app aberto durante a deriva
- A geolocalização fica ativa em background
- Economiza bateria comparado a apps de GPS dedicados
- Funciona mesmo sem sinal de celular (usa GPS)

---

## 🎯 Conceito Situacionista

O mapa adiciona uma nova dimensão à deriva:

> "A deriva é uma técnica do trânsito passageiro em uma ambiência variável."

Com o mapa, você pode:
- **Visualizar** os caminhos percorridos
- **Comparar** diferentes derivas
- **Descobrir** padrões nos seus trajetos
- **Compartilhar** suas experiências (exportando dados)

Mas lembre-se: o mapa é apenas um **registro**, não substitui a experiência da deriva em si.

---

## 📞 Suporte

Se precisar de ajuda:
1. Abra o console do navegador (F12)
2. Verifique as mensagens de erro
3. Confirme que a API está respondendo
4. Teste a geolocalização em https://www.google.com/maps

---

**Boa deriva! ◉**
