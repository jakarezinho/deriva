# 📍 Rastreamento Completo do Trajeto

## ✅ Agora o trajeto completo é registado!

Durante a deriva, a sua localização é **rastreada continuamente** e todos os pontos são guardados no banco de dados. No mapa, você vê uma **linha completa** mostrando o caminho percorrido.

---

## 🎯 Como Funciona

### Durante a Deriva

1. **Início**: O app captura a localização inicial
2. **Durante**: A cada 5 segundos, a localização é atualizada
3. **Pontos salvos**: A cada 30 segundos, um ponto é guardado no servidor
4. **Fim**: A localização final é capturada e a distância total é calculada

### No Mapa

- **Linha roxa tracejada** = trajeto completo percorrido
- **Marcador roxo** = início da deriva
- **Marcador verde** = fim da deriva
- **Clique na linha** = ver detalhes da deriva
- **Distância total** = calculada automaticamente

---

## 📊 O que é Registado

### Para cada deriva:
- ✅ Localização de início (lat/lng)
- ✅ Localização de fim (lat/lng)
- ✅ **Trajeto completo** (todos os pontos intermediários)
- ✅ Distância total percorrida (km)
- ✅ Número de pontos registados
- ✅ Timestamp de cada ponto

### Exemplo de dados:
```json
{
  "id": "abc123",
  "data_inicio": "2026-01-15T10:00:00Z",
  "data_fim": "2026-01-15T11:30:00Z",
  "duracao": 90,
  "distancia": 3.45,
  "localizacao_inicio": { "lat": -23.5505, "lng": -46.6333 },
  "localizacao_fim": { "lat": -23.5612, "lng": -46.6558 },
  "trajeto": [
    { "lat": -23.5505, "lng": -46.6333, "timestamp": "..." },
    { "lat": -23.5510, "lng": -46.6340, "timestamp": "..." },
    { "lat": -23.5515, "lng": -46.6348, "timestamp": "..." },
    // ... mais pontos
    { "lat": -23.5612, "lng": -46.6558, "timestamp": "..." }
  ]
}
```

---

## 🗺️ Visualização no Mapa

### Antes (apenas início e fim):
```
📍 ─────────────── 📍
(início)          (fim)
```

### Agora (trajeto completo):
```
📍 ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ 📍
(início)  trajeto   (fim)
```

A linha mostra:
- Curvas e desvios
- Ruas percorridas
- Caminhos exatos
- Distância real percorrida

---

## 🔧 Configurações Técnicas

### Frequência de Salvamento

**No navegador:**
- Atualização: a cada 5 segundos
- Salvamento no servidor: a cada 30 segundos
- Isso equilibra precisão e uso de dados/bateria

**Fórmula de distância:**
- Usa a fórmula de Haversine
- Calcula distância entre pontos consecutivos
- Soma todas as distâncias para obter o total

### Precisão

- **GPS em exterior**: 5-20 metros
- **GPS em interior**: 20-100 metros
- **Wi-Fi/3G/4G**: 50-500 metros

**Dica**: Para melhor precisão, use em exterior com GPS ativo.

---

## 📱 Uso em Dispositivos Móveis

### Android
- GPS + Wi-Fi + Dados móveis
- Melhor precisão em exterior
- Funciona em background

### iOS
- GPS + Wi-Fi
- Precisão excelente
- Respeita configurações de privacidade

### Dicas
1. **Ative o GPS** antes de iniciar a deriva
2. **Aceite a permissão** de localização
3. **Mantenha o app aberto** durante a deriva
4. **Use em exterior** para melhor precisão
5. **Economiza bateria** comparado a apps de GPS dedicados

---

## 💾 Armazenamento

### Banco de Dados

**Tabela `pontos_trajeto`:**
```sql
CREATE TABLE pontos_trajeto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deriva_id TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    accuracy REAL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
);
```

**Capacidade:**
- Uma deriva de 1 hora = ~120 pontos
- Uma deriva de 3 horas = ~360 pontos
- 100 derivas = ~36.000 pontos
- Tamanho: ~10-20 MB (muito eficiente)

---

## 🎨 Personalização

### Cor da Linha do Trajeto

No arquivo `app.js`, função `carregarDerivasNoMapa`:

```javascript
const polyline = L.polyline(latlngs, {
  color: '#c084fc',      // Cor da linha (roxo)
  weight: 3,             // Espessura
  opacity: 0.7,          // Transparência
  dashArray: '5, 10'     // Tracejado
}).addTo(mapa);
```

**Exemplos de cores:**
- Roxo: `#c084fc`
- Azul: `#22d3ee`
- Verde: `#34d399`
- Vermelho: `#f87171`

### Estilo da Linha

```javascript
// Linha sólida
dashArray: null

// Linha tracejada
dashArray: '5, 10'

// Linha pontilhada
dashArray: '2, 5'
```

---

## 🔐 Privacidade

### O que é feito com os dados?

✅ **Armazenados localmente** no seu servidor  
✅ **Você controla** quando ativar a geolocalização  
✅ **Pode excluir** qualquer deriva a qualquer momento  
✅ **Pode exportar** todos os dados para backup  
✅ **Nenhum dado** é enviado para terceiros  

### Como desativar?

1. **Negue a permissão** de localização quando o browser pedir
2. O app funciona sem geolocalização
3. Apenas não terá o mapa e o trajeto

---

## 📊 Estatísticas

### No Histórico

Agora cada deriva mostra:
- Número de prompts seguidos
- Duração (minutos)
- **Distância percorrida (km)** ← Novo!
- Humor (1-5)

### No Mapa

Ao clicar na linha do trajeto:
- Data da deriva
- Local de início
- Clima
- Número de prompts
- Duração
- **Distância percorrida** ← Novo!
- **Número de pontos registados** ← Novo!
- Humor

---

## 🆘 Problemas Comuns

### "Trajeto não aparece no mapa"

1. **Verifique se há pontos salvos**
   - Abra o console (F12)
   - Veja se há mensagens sobre salvamento de pontos
   
2. **Confirme a geolocalização**
   - Aceite a permissão
   - Verifique se o GPS está ativo
   
3. **Recarregue o mapa**
   - Saia e entre na página do mapa
   - Ou recarregue a página

### "Poucos pontos registados"

- **Causa**: GPS com baixa precisão
- **Solução**: Use em exterior com céu aberto
- **Alternativa**: Ative "Alta precisão" nas configurações do dispositivo

### "Distância parece errada"

- **Causa**: GPS impreciso ou saltos de localização
- **Solução**: O app filtra pontos muito distantes
- **Nota**: Em interior, a precisão é menor

### "Bateria consumindo muito"

- **Causa**: GPS ativo continuamente
- **Solução**: O app otimiza para salvar a cada 30s
- **Dica**: Use modo de economia de bateria do dispositivo

---

## 💡 Dicas de Uso

### Para melhor experiência:

1. **Inicie em exterior** com GPS ativo
2. **Mantenha o app aberto** durante toda a deriva
3. **Não bloqueie a tela** (ou use modo sempre ativo)
4. **Verifique a bateria** antes de derivas longas
5. **Use em áreas abertas** para melhor precisão

### Para derivas longas:

- Leve um carregador portátil
- Ative o modo de economia de energia
- O app continua registando mesmo em background

### Para explorar o trajeto depois:

- Abra o mapa
- Clique na linha do trajeto
- Veja todos os detalhes
- Compare diferentes derivas
- Descubra padrões nos seus caminhos

---

## 🎯 Conceito Situacionista

O rastreamento completo adiciona uma nova dimensão à deriva:

> "A deriva é uma técnica do trânsito passageiro em uma ambiência variável."

Agora você pode:
- **Visualizar** o caminho exato percorrido
- **Analisar** os padrões dos seus trajetos
- **Descobrir** quais áreas da cidade você mais explora
- **Comparar** diferentes derivas e seus percursos
- **Documentar** suas experiências de forma precisa

Mas lembre-se: o mapa é apenas um **registro**, não substitui a experiência da deriva em si. O mais importante é o ato de caminhar sem rumo, deixando-se levar pelas atrações do terreno.

---

## 📞 Suporte

Se precisar de ajuda:
1. Abra o console do navegador (F12)
2. Verifique as mensagens sobre geolocalização
3. Confirme que a API está respondendo
4. Teste a geolocalização em https://www.google.com/maps

---

**Boa deriva! ◉**
