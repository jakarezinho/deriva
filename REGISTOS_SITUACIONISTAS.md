# 🎨 Registos Situacionistas - Espírito da Deriva

## 📖 O Espírito Situacionista

A deriva urbana, conforme teorizada por Guy Debord e a Internacional Situacionista, é uma prática de exploração psicológica do espaço urbano. Não se trata apenas de caminhar, mas de **observar, sentir e registar** as experiências urbanas de forma rica e multifacetada.

Os **registos situacionistas** permitem capturar diferentes dimensões da experiência urbana:

---

## 🎯 Tipos de Registos

### 👁️ **Sensorial** (5 sentidos)
Regista experiências sensoriais do ambiente urbano.

**Exemplos:**
- "O cheiro a pão quente da padaria da esquina"
- "O som dos sinos da igreja ao longe"
- "A textura áspera da parede antiga"
- "O sabor do café no banco da praça"
- "A luz dourada do pôr-do-sol nos prédios"

**Quando usar:** Quando algo toca os seus sentidos de forma marcante.

---

### 💭 **Pensamento Errante**
Regista pensamentos, reflexões e divagações que surgem durante a deriva.

**Exemplos:**
- "Porque é que esta rua me parece tão familiar?"
- "Se esta casa pudesse falar, que histórias contaria?"
- "A cidade é um organismo vivo que respira"
- "Cada esquina é uma porta para outro mundo"

**Quando usar:** Quando tem pensamentos filosóficos, poéticos ou reflexivos.

---

### 👥 **Encontro**
Regista encontros com pessoas, animais ou situações sociais.

**Exemplos:**
- "Conversei com o senhor que rega as flores há 30 anos"
- "Um gato preto cruzou o meu caminho"
- "Grupo de crianças a jogar à bola na rua"
- "Artista de rua a tocar violino"

**Quando usar:** Quando interage ou observa seres vivos de forma significativa.

---

### 🖼️ **Imagem Mental**
Regista imagens, visões ou cenas que se formam na sua mente.

**Exemplos:**
- "Imaginei esta praça cheia de mercado medieval"
- "Vi este edifício como uma nave espacial pousada"
- "As sombras pareciam dançar na parede"
- "A rua transformou-se num rio de pessoas"

**Quando usar:** Quando a sua imaginação transforma o que vê.

---

### 💬 **Frase Ouvida**
Regista frases, conversas ou sons verbais captados no ambiente.

**Exemplos:**
- "'Já não é como antigamente...' - disse o velho"
- "'Vem cá, que eu mostro-te um segredo'"
- "Risadas ecoando do pátio da escola"
- "'A cidade nunca dorme' - música do rádio"

**Quando usar:** Quando ouve algo interessante, poético ou revelador.

---

### 🎁 **Objeto Encontrado**
Regista objetos que encontra ou que chamam a sua atenção.

**Exemplos:**
- "Chave enferrujada no chão"
- "Carta de amor perdida no banco"
- "Flor a crescer entre o betão"
- "Boneca antiga na montra"

**Quando usar:** Quando encontra objetos que contam histórias.

---

### 🌫️ **Atmosfera**
Regista a atmosfera, ambiente ou "vibe" de um lugar.

**Exemplos:**
- "Silêncio pesado da igreja vazia"
- "Energia caótica do mercado matinal"
- "Melancolia da rua deserta à noite"
- "Alegria contagiosa do festival de rua"

**Quando usar:** Quando sente o "espírito" ou "energia" de um lugar.

---

### ✨ **Desejo**
Regista desejos, vontades ou aspirações que surgem.

**Exemplos:**
- "Queria entrar naquela casa e viver lá"
- "Desejei ter mais tempo para explorar"
- "Queria pintar aquele mural"
- "Sonhei em abrir uma livraria naquela esquina"

**Quando usar:** Quando sente vontade ou aspiração provocada pelo lugar.

---

### 🎲 **Acaso**
Regista coincidências, acasos ou eventos inesperados.

**Exemplos:**
- "Encontrei um amigo que não via há 10 anos"
- "Começou a chover exatamente quando entrei na igreja"
- "Ouvi a minha música favorita na rua"
- "Três carros vermelhos seguidos"

**Quando usar:** Quando algo inesperado ou coincidente acontece.

---

## 🎨 Como Usar

### 1. Criar uma Descoberta
- Tirar foto (opcional)
- Adicionar notas gerais (opcional)
- Guardar a descoberta

### 2. Adicionar Registos
- Clicar na descoberta
- Clicar em "+ Registo"
- Escolher o tipo de registo
- Escrever o conteúdo
- Guardar

### 3. Múltiplos Registos
Uma descoberta pode ter **vários registos** de tipos diferentes:
- 2 sensoriais
- 1 pensamento
- 3 frases ouvidas
- etc.

### 4. Visualizar
- **Galeria:** Badges mostram os tipos de registos
- **Detalhes:** Lista completa de todos os registos
- **Exportar:** JSON inclui todos os registos

---

## 📊 Exemplo de Descoberta Rica

```
📍 Praça do Município, 10:30
📷 Foto: Fonte central

📝 Notas: "Praça bonita com fonte antiga"

👁️ Sensorial: "O som da água a cair na fonte"
💭 Pensamento: "Esta fonte viu passar gerações"
💬 Frase: "'A água nunca para...' - disse o velho"
🌫️ Atmosfera: "Paz no meio do caos urbano"
✨ Desejo: "Queria sentar-me aqui horas a fio"
```

---

## 🎯 Filosofia

Os registos situacionistas transformam a deriva de uma simples caminhada fotográfica numa **experiência rica e multifacetada** que captura:

- **O que vê** (sensorial, imagem)
- **O que sente** (atmosfera, desejo)
- **O que pensa** (pensamento)
- **O que ouve** (frase)
- **O que encontra** (objeto, encontro)
- **O que acontece** (acaso)

É a **psicogeografia em ação** - mapear não apenas o espaço físico, mas a experiência humana do espaço.

---

## 🔧 Implementação Técnica

### Base de Dados
```sql
CREATE TABLE registos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descoberta_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (descoberta_id) REFERENCES descobertas(id) ON DELETE CASCADE
);
```

### API Endpoints
- `GET /api/registos.php?descoberta_id=X` - Listar registos
- `POST /api/registos.php` - Criar registo
- `PUT /api/registos.php` - Atualizar registo
- `DELETE /api/registos.php?id=X` - Eliminar registo

### Tipos Válidos
```javascript
const TIPOS_REGISTO = {
    sensorial: { icon: '👁️', label: 'Sensorial' },
    pensamento: { icon: '💭', label: 'Pensamento Errante' },
    encontro: { icon: '👥', label: 'Encontro' },
    imagem: { icon: '🖼️', label: 'Imagem Mental' },
    frase: { icon: '💬', label: 'Frase Ouvida' },
    objeto: { icon: '🎁', label: 'Objeto Encontrado' },
    atmosfera: { icon: '🌫️', label: 'Atmosfera' },
    desejo: { icon: '✨', label: 'Desejo' },
    acaso: { icon: '🎲', label: 'Acaso' }
};
```

---

## 📚 Inspiração Situacionista

> "A deriva é um modo de comportamento experimental ligado às condições da sociedade urbana: técnica do trânsito passageiro em uma ambiência variável."
> 
> — Guy Debord, "Théorie de la Dérive" (1956)

> "A psicogeografia define-se como o estudo dos efeitos precisos e das leis do meio ambiente, conscientemente organizados ou não, que agem diretamente sobre o comportamento afetivo dos indivíduos."
> 
> — Internacional Situacionista

Os registos situacionistas são a **aplicação prática** destes conceitos, permitindo mapear não apenas o espaço, mas a **experiência humana** do espaço.

---

## 🎉 Conclusão

Os registos situacionistas transformam a Deriva Urbana numa ferramenta poderosa para:

- ✅ **Exploração urbana consciente**
- ✅ **Registo rico e multifacetado**
- ✅ **Psicogeografia em ação**
- ✅ **Memória detalhada das experiências**
- ✅ **Partilha de experiências urbanas**

**Volte ao espírito situacionista original!** 🚶‍♂️🗺️✨
