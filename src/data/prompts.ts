// Prompts para Deriva Urbana — inspirados na psicogeografia situacionista
// Guy Debord, "Théorie de la Dérive" (1956)

export interface Prompt {
  id: number;
  text: string;
  category: 'observação' | 'movimento' | 'interação' | 'tempo' | 'sentido' | 'registro' | 'ruptura';
}

export const prompts: Prompt[] = [
  // OBSERVAÇÃO
  { id: 1, text: "Siga a sombra mais longa que encontrar até ela desaparecer.", category: "observação" },
  { id: 2, text: "Observe a fachada de um edifício abandonado. O que ele conta?", category: "observação" },
  { id: 3, text: "Encontre uma textura na parede que pareça um mapa.", category: "observação" },
  { id: 4, text: "Pare e ouça. Quantos sons diferentes você consegue identificar em 60 segundos?", category: "observação" },
  { id: 5, text: "Observe as mãos das pessoas que passam. O que elas seguram?", category: "observação" },
  { id: 6, text: "Encontre uma janela iluminada e imagine a vida por trás dela.", category: "observação" },
  { id: 7, text: "Procure por palavras escritas à mão em muros, postes ou calçadas.", category: "observação" },
  { id: 8, text: "Observe o reflexo da cidade em uma poça d'água ou vidro.", category: "observação" },
  { id: 9, text: "Encontre algo que foi esquecido na rua. Documente.", category: "observação" },
  { id: 10, text: "Observe como as pessoas se movem nos cruzamentos. Há coreografia?", category: "observação" },
  { id: 11, text: "Procure por plantas crescendo em frestas do asfalto.", category: "observação" },
  { id: 12, text: "Encontre um objeto que não pertence a este lugar.", category: "observação" },
  { id: 13, text: "Observe as cores dominantes desta rua. Quantos tons de cinza existem?", category: "observação" },
  { id: 14, text: "Procure por graffiti. Qual mensagem ressoa com seu momento?", category: "observação" },
  { id: 15, text: "Observe os fios e cabos acima. Que desenho eles fazem no céu?", category: "observação" },
  { id: 16, text: "Encontre uma placa desbotada pelo tempo. O que ela dizia?", category: "observação" },
  { id: 17, text: "Observe os animais urbanos: pombos, gatos, insetos. Como habitam?", category: "observação" },
  { id: 18, text: "Procure por marcas de uso nos bancos de praça. Quem senta ali?", category: "observação" },
  { id: 19, text: "Observe as vitrines. Que desejos elas vendem?", category: "observação" },
  { id: 20, text: "Encontre algo belo onde ninguém esperaria beleza.", category: "observação" },

  // MOVIMENTO
  { id: 21, text: "Vire na próxima esquina à direita sem pensar. Depois à esquerda. Repita 3 vezes.", category: "movimento" },
  { id: 22, text: "Caminhe apenas em linhas retas até encontrar um obstáculo intransponível.", category: "movimento" },
  { id: 23, text: "Siga alguém que caminha com pressa. Não por muito tempo — apenas o suficiente.", category: "movimento" },
  { id: 24, text: "Caminhe contra o fluxo das pessoas. Como é ir na contramão?", category: "movimento" },
  { id: 25, text: "Atravesse a cidade seguindo apenas ruas com nomes de árvores.", category: "movimento" },
  { id: 26, text: "Suba a ladeira mais íngreme que encontrar. O que há no topo?", category: "movimento" },
  { id: 27, text: "Caminhe em ziguezague, cruzando a rua a cada quarteirão.", category: "movimento" },
  { id: 28, text: "Siga um rio, córrego ou linha de drenagem. Para onde ele vai?", category: "movimento" },
  { id: 29, text: "Caminhe apenas pela metade da calçada. Qual lado?", category: "movimento" },
  { id: 30, text: "Entre em um beco que nunca entrou. Volte quando quiser.", category: "movimento" },
  { id: 31, text: "Siga a linha de ônibus mais estranha que encontrar no ponto.", category: "movimento" },
  { id: 32, text: "Caminhe até encontrar uma rua sem saída. O que ela revela?", category: "movimento" },
  { id: 33, text: "Desça uma escadaria pública. Quantos degraus? O que há embaixo?", category: "movimento" },
  { id: 34, text: "Caminhe em círculos concêntricos ao redor de uma praça.", category: "movimento" },
  { id: 35, text: "Siga em direção ao som mais distante que consegue ouvir.", category: "movimento" },
  { id: 36, text: "Passe por baixo de um viaduto. Como o espaço muda?", category: "movimento" },
  { id: 37, text: "Caminhe até seus pés decidirem parar. Onde eles escolheram?", category: "movimento" },
  { id: 38, text: "Procure um atalho que só moradores antigos conheceriam.", category: "movimento" },
  { id: 39, text: "Caminhe como se estivesse procurando algo que perdeu há muito tempo.", category: "movimento" },
  { id: 40, text: "Atravesse um bairro inteiro sem olhar o celular.", category: "movimento" },

  // INTERAÇÃO
  { id: 41, text: "Pergunte a um estranho: 'qual é o lugar mais bonito daqui?'", category: "interação" },
  { id: 42, text: "Sente-se em um banco de praça por 10 minutos. Observe quem se aproxima.", category: "interação" },
  { id: 43, text: "Entre em um comércio pequeno. Compre algo mínimo. Converse.", category: "interação" },
  { id: 44, text: "Peça indicação de um lugar que você não pretende visitar.", category: "interação" },
  { id: 45, text: "Ofereça um sorriso a alguém que parece cansado.", category: "interação" },
  { id: 46, text: "Pergunte a um trabalhador da rua: 'como é seu dia?'", category: "interação" },
  { id: 47, text: "Encontre um espaço público e sente-se no chão. Como as pessoas reagem?", category: "interação" },
  { id: 48, text: "Peça água em um lugar inesperado. Aceite o que oferecerem.", category: "interação" },
  { id: 49, text: "Deixe um bilhete anônimo em um lugar público.", category: "interação" },
  { id: 50, text: "Pergunte a uma criança: 'onde você gosta de brincar?'", category: "interação" },
  { id: 51, text: "Observe um jogo de dominó ou cartas na rua. Não interfira.", category: "interação" },
  { id: 52, text: "Pergunte a hora para alguém. Depois pergunte: 'o tempo passa rápido ou devagar aqui?'", category: "interação" },
  { id: 53, text: "Encontre um músico de rua. Ouça uma música inteira.", category: "interação" },
  { id: 54, text: "Peça para alguém tirar sua foto. Ou peça para você tirar a dela.", category: "interação" },
  { id: 55, text: "Entre em uma igreja ou templo. Não por fé — por arquitetura.", category: "interação" },

  // TEMPO
  { id: 56, text: "Pare por 5 minutos no mesmo lugar. Observe o que muda.", category: "tempo" },
  { id: 57, text: "Caminhe devagar. Metade da velocidade normal. O que aparece?", category: "tempo" },
  { id: 58, text: "Espere o sinal abrir 3 vezes. Observe quem espera com você.", category: "tempo" },
  { id: 59, text: "Fique parado até que alguém pergunte se você está bem.", category: "tempo" },
  { id: 60, text: "Caminhe até o sol mudar de posição em relação aos prédios.", category: "tempo" },
  { id: 61, text: "Observe uma mesma esquina por 15 minutos. Quantas pessoas passam?", category: "tempo" },
  { id: 62, text: "Espere a luz de um poste acender. O que acontece quando escurece?", category: "tempo" },
  { id: 63, text: "Caminhe em câmera lenta. Como se estivesse debaixo d'água.", category: "tempo" },
  { id: 64, text: "Pare e conte até 100. Depois continue. O que mudou?", category: "tempo" },
  { id: 65, text: "Observe as nuvens por 3 minutos. Que formas elas fazem com os prédios?", category: "tempo" },
  { id: 66, text: "Caminhe do nascer ao pôr do sol sem destino. Quantas horas durou?", category: "tempo" },
  { id: 67, text: "Volte ao mesmo lugar após 30 minutos. O que é diferente?", category: "tempo" },
  { id: 68, text: "Observe a velocidade das pessoas. Quem tem pressa? Quem não tem?", category: "tempo" },
  { id: 69, text: "Sente-se e espere algo acontecer que não deveria. O tédio é território.", category: "tempo" },
  { id: 70, text: "Caminhe até sentir fome. Depois caminhe mais um pouco.", category: "tempo" },

  // SENTIDO
  { id: 71, text: "Caminhe em direção ao que te causa estranhamento.", category: "sentido" },
  { id: 72, text: "Siga o cheiro mais interessante. De onde vem?", category: "sentido" },
  { id: 73, text: "Vá em direção ao silêncio. A cidade tem zonas de quietude?", category: "sentido" },
  { id: 74, text: "Siga a luz. Caminhe em direção ao brilho mais intenso.", category: "sentido" },
  { id: 75, text: "Procure um lugar onde você nunca esteve, mesmo sendo perto.", category: "sentido" },
  { id: 76, text: "Caminhe em direção ao medo. O que te assusta na paisagem urbana?", category: "sentido" },
  { id: 77, text: "Siga a nostalgia. Vá a um lugar que você frequentava e não vai mais.", category: "sentido" },
  { id: 78, text: "Procure o limite do bairro. Onde ele termina? Onde começa outro?", category: "sentido" },
  { id: 79, text: "Caminhe em direção à solidão. Onde a cidade fica vazia?", category: "sentido" },
  { id: 80, text: "Siga a multidão. Depois saia dela abruptamente. O que sente?", category: "sentido" },
  { id: 81, text: "Procure um lugar que pareça fora do tempo.", category: "sentido" },
  { id: 82, text: "Caminhe em direção a uma memória. Reconstrua um trajeto antigo.", category: "sentido" },
  { id: 83, text: "Busque o centro de algo. Qual é o centro do seu bairro?", category: "sentido" },
  { id: 84, text: "Vá em direção ao que te atrai visualmente sem racionalizar.", category: "sentido" },
  { id: 85, text: "Procure a borda da cidade. Onde o urbano vira outra coisa?", category: "sentido" },

  // REGISTRO
  { id: 86, text: "Desenhe um mapa mental do que viu. Sem referências, só memória.", category: "registro" },
  { id: 87, text: "Escreva uma frase sobre este lugar. Uma só.", category: "registro" },
  { id: 88, text: "Fotografe apenas sombras. A cidade como silhueta.", category: "registro" },
  { id: 89, text: "Colete um objeto da rua. Uma pedra, um papel, algo mínimo.", category: "registro" },
  { id: 90, text: "Anote os nomes das ruas que passou. Que poema eles formam?", category: "registro" },
  { id: 91, text: "Grave 1 minuto de som ambiente. Depois ouça.", category: "registro" },
  { id: 92, text: "Escreva uma carta para quem passar por aqui depois de você.", category: "registro" },
  { id: 93, text: "Conte as cores que viu. Qual dominou o trajeto?", category: "registro" },
  { id: 94, text: "Desenhe o trajeto sem olhar para cima. Só memória corporal.", category: "registro" },
  { id: 95, text: "Liste 5 palavras que definem este momento na cidade.", category: "registro" },
  { id: 96, text: "Fotografe o mesmo lugar de 5 ângulos diferentes.", category: "registro" },
  { id: 97, text: "Escreva o que seus pés sentiram. O chão era amigo ou inimigo?", category: "registro" },
  { id: 98, text: "Registre o momento exato em que se perdeu. Onde foi?", category: "registro" },
  { id: 99, text: "Anote 3 conversas fragmentadas que ouviu por acaso.", category: "registro" },
  { id: 100, text: "Dê um nome ao lugar onde você está agora. Invente.", category: "registro" },

  // RUPTURA
  { id: 101, text: "Entre em um lugar público e finja que é um turista pela primeira vez.", category: "ruptura" },
  { id: 102, text: "Caminhe como se estivesse sendo filmado. A cidade é cenário.", category: "ruptura" },
  { id: 103, text: "Pare e olhe para cima por 2 minutos. Quantas pessoas fazem isso?", category: "ruptura" },
  { id: 104, text: "Troque de calçada toda vez que alguém vier na sua direção.", category: "ruptura" },
  { id: 105, text: "Caminhe de costas por 20 passos. O mundo inverte.", category: "ruptura" },
  { id: 106, text: "Fale em voz alta o nome da rua ao entrar nela. Sem vergonha.", category: "ruptura" },
  { id: 107, text: "Sente-se no meio-fio. O chão é cadeira.", category: "ruptura" },
  { id: 108, text: "Ignore todas as placas de direção. Vá pelo instinto.", category: "ruptura" },
  { id: 109, text: "Caminhe como se a cidade fosse sua casa. Cada rua é um cômodo.", category: "ruptura" },
  { id: 110, text: "Pare diante de um estranho e diga: 'boa tarde'. Continue andando.", category: "ruptura" },
  { id: 111, text: "Toque em todas as texturas diferentes que encontrar no caminho.", category: "ruptura" },
  { id: 112, text: "Caminhe como uma criança: pare em tudo, toque, pergunte.", category: "ruptura" },
  { id: 113, text: "Desvie de todas as pessoas. Faça um caminho só seu.", category: "ruptura" },
  { id: 114, text: "Imagine que a cidade acabou de ser construída. Tudo é novo.", category: "ruptura" },
  { id: 115, text: "Caminhe como se fosse invisível. Ninguém te vê. O que você faz?", category: "ruptura" },
  { id: 116, text: "Procure o lugar mais feio do bairro. Encontre beleza nele.", category: "ruptura" },
  { id: 117, text: "Caminhe em silêncio absoluto por 10 minutos. Sem fone, sem música.", category: "ruptura" },
  { id: 118, text: "Invente uma história para cada pessoa que cruza seu caminho.", category: "ruptura" },
  { id: 119, text: "Caminhe como se estivesse fugindo. De quê?", category: "ruptura" },
  { id: 120, text: "Pare no meio da calçada e ria. Sem motivo. Depois continue.", category: "ruptura" },

  // PROMPTS EXTRAS — DERIVA PROFUNDA
  { id: 121, text: "Procure uma passagem entre dois prédios. Existe um caminho oculto?", category: "observação" },
  { id: 122, text: "Siga um animal. Para onde ele vai? O que ele sabe?", category: "movimento" },
  { id: 123, text: "Encontre o lugar mais alto acessível. Olhe a cidade de cima.", category: "movimento" },
  { id: 124, text: "Procure por números na paisagem. Que sequência eles formam?", category: "observação" },
  { id: 125, text: "Caminhe até encontrar água. Rio, fonte, bueiro. A cidade respira?", category: "sentido" },
  { id: 126, text: "Procure um espelho na rua. Veja-se refletido na cidade.", category: "observação" },
  { id: 127, text: "Encontre uma árvore. Sente-se ao lado dela por 5 minutos.", category: "tempo" },
  { id: 128, text: "Caminhe até encontrar algo vermelho. Depois algo azul. Compare os lugares.", category: "observação" },
  { id: 129, text: "Procure uma rua que muda de nome no meio. O que acontece na fronteira?", category: "ruptura" },
  { id: 130, text: "Vá a um lugar barulhento. Depois ao mais silencioso. Contraste.", category: "sentido" },
  { id: 131, text: "Caminhe em direção a uma construção em obras. O que nasce?", category: "observação" },
  { id: 132, text: "Procure um lugar onde idosos se reúnem. O que eles conversam?", category: "interação" },
  { id: 133, text: "Encontre uma escultura ou monumento. Leia o que diz. Questione.", category: "observação" },
  { id: 134, text: "Caminhe pela rua mais larga que encontrar. Depois pela mais estreita.", category: "movimento" },
  { id: 135, text: "Procure um lugar onde o tempo parece ter parado. Existe?", category: "sentido" },
  { id: 136, text: "Siga o vento. De onde ele vem? Para onde ele te leva?", category: "movimento" },
  { id: 137, text: "Encontre uma porta entreaberta. O que há do outro lado? (Não entre.)", category: "observação" },
  { id: 138, text: "Caminhe até sentir que chegou a algum lugar, mesmo sem destino.", category: "sentido" },
  { id: 139, text: "Procure um lugar onde ninguém está. A cidade tem vazios?", category: "sentido" },
  { id: 140, text: "Observe como a luz muda em 30 minutos. A cidade muda de cor?", category: "tempo" },
  { id: 141, text: "Caminhe em direção ao desconforto. O que te faz querer voltar?", category: "ruptura" },
  { id: 142, text: "Procure uma rua que você conhece de olhos fechados. Agora ande com olhos vendados (com cuidado).", category: "ruptura" },
  { id: 143, text: "Encontre um lugar onde diferentes classes sociais se encontram.", category: "observação" },
  { id: 144, text: "Caminhe até encontrar algo que te faz lembrar da infância.", category: "sentido" },
  { id: 145, text: "Procure o som mais estranho da cidade. De onde vem?", category: "observação" },
  { id: 146, text: "Siga uma linha de ônibus do início ao fim. Que cidade aparece?", category: "movimento" },
  { id: 147, text: "Caminhe até encontrar um lugar que cheira a comida. Entre no aroma.", category: "sentido" },
  { id: 148, text: "Procure um outdoor antigo. O que ele vende? Ainda faz sentido?", category: "observação" },
  { id: 149, text: "Encontre um lugar onde o asfalto vira terra. A cidade respira ali?", category: "observação" },
  { id: 150, text: "Caminhe até o cansaço. Pare. Registre onde o corpo disse basta.", category: "tempo" },
];

export const categories = [
  { id: 'observação', label: 'Observação', icon: '👁️', color: '#8B5CF6' },
  { id: 'movimento', label: 'Movimento', icon: '🚶', color: '#06B6D4' },
  { id: 'interação', label: 'Interação', icon: '💬', color: '#F59E0B' },
  { id: 'tempo', label: 'Tempo', icon: '⏳', color: '#10B981' },
  { id: 'sentido', label: 'Sentido', icon: '🧭', color: '#EF4444' },
  { id: 'registro', label: 'Registro', icon: '✍️', color: '#EC4899' },
  { id: 'ruptura', label: 'Ruptura', icon: '⚡', color: '#F97316' },
];

export function getRandomPrompt(excludeIds: number[] = []): Prompt {
  const available = prompts.filter(p => !excludeIds.includes(p.id));
  const pool = available.length > 0 ? available : prompts;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomPrompts(count: number, excludeIds: number[] = []): Prompt[] {
  const result: Prompt[] = [];
  const used = [...excludeIds];
  for (let i = 0; i < count && i < prompts.length; i++) {
    const prompt = getRandomPrompt(used);
    result.push(prompt);
    used.push(prompt.id);
  }
  return result;
}

export function getRandomPromptByCategory(category: string): Prompt {
  const filtered = prompts.filter(p => p.category === category);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
