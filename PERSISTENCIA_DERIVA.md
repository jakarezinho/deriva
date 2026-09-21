# 💾 Persistência da Deriva Ativa

## ✅ Problema Resolvido

Agora quando mudas de janela no smartphone ou o ecrã desliga, **a deriva não se perde**!

---

## 🎯 Como Funciona

### O que foi implementado:

1. **localStorage** - Guarda o estado completo da deriva no browser
2. **Page Visibility API** - Detecta quando a página fica invisível
3. **Restauração automática** - Ao voltar, a deriva é recuperada

### Fluxo:

```
Inicia deriva
    ↓
Estado guardado no localStorage
    ↓
Mudas de app / ecrã desliga
    ↓
Estado já está guardado ✓
    ↓
Voltas à página
    ↓
Estado restaurado automaticamente ✓
    ↓
Continua a deriva normalmente ✓
```

---

## 📊 O que é Guardado

Ao guardar o estado, persiste:

- ✅ **derivaAtiva** - Dados da deriva (ID, data de início, etc)
- ✅ **currentPrompts** - Prompts atuais visíveis
- ✅ **usedPromptIds** - IDs dos prompts já usados
- ✅ **selectedCategory** - Categoria filtrada
- ✅ **descobertas** - Lista de descobertas
- ✅ **humor** - Humor selecionado (1-5)
- ✅ **clima** - Clima selecionado
- ✅ **startTime** - Hora de início
- ✅ **pontosTrajeto** - Pontos do trajeto (local)

---

## 🔄 Quando é Guardado

O estado é guardado automaticamente:

1. **Ao iniciar a deriva**
2. **Ao seguir um prompt**
3. **Ao adicionar uma descoberta**
4. **Ao salvar um ponto do trajeto** (a cada 30s)
5. **Quando a página fica invisível** (muda de tab, minimiza)
6. **Antes de fechar a página**

---

## 🗑️ Quando é Limpo

O estado é removido do localStorage:

1. **Ao finalizar a deriva com sucesso** (salva no servidor)
2. **Ao abandonar a deriva** (botão ✕)
3. **Após 24 horas** (estado muito antigo)

---

## 🎮 Controlos

### Botão "Finalizar ✓"
- Salva a deriva no servidor
- Limpa o localStorage
- Mostra mensagem de sucesso

### Botão "✕" (novo!)
- Abandona a deriva sem salvar
- Limpa o localStorage
- Confirmação antes de abandonar

---

## 📱 No Smartphone

### Cenário 1: Mudar de app
1. Estás a fazer uma deriva
2. Recebes uma chamada
3. Atendes a chamada
4. Voltas ao browser
5. **A deriva está lá!** ✓

### Cenário 2: Ecrã desliga
1. Estás a caminhar
2. O ecrã desliga automaticamente
3. Desbloqueias o telefone
4. Voltas ao browser
5. **A deriva está lá!** ✓

### Cenário 3: Browser fecha
1. O sistema fecha o browser para poupar memória
2. Abres o browser novamente
3. A página recarrega
4. **A deriva é restaurada!** ✓

---

## ⚠️ Limitações

### O que PODE acontecer:

1. **Limpar dados do browser**
   - Se limpar o cache/dados do browser, perde-se
   - Solução: Finalizar a deriva antes de limpar

2. **Estado muito antigo**
   - Após 24 horas, o estado é considerado antigo
   - Solução: Não deixar derivas pendentes por muito tempo

3. **Geolocalização em background**
   - Alguns sistemas operativos podem parar o GPS
   - Solução: Manter o browser aberto

### O que NÃO acontece:

- ❌ Perder prompts seguidos
- ❌ Perder descobertas
- ❌ Perder pontos do trajeto
- ❌ Perder humor/clima selecionados

---

## 🔧 Detalhes Técnicos

### Chave no localStorage:
```javascript
const DERIVA_ATIVA_KEY = 'deriva_ativa';
```

### Estrutura do estado guardado:
```json
{
  "derivaAtiva": {
    "id": "abc123",
    "data_inicio": "2026-01-15T10:00:00Z",
    "promptsSeguidos": [...],
    "descobertas": [...]
  },
  "currentPrompts": [...],
  "usedPromptIds": [1, 5, 23],
  "selectedCategory": "",
  "descobertas": ["Fonte antiga", "Gato preto"],
  "humor": 4,
  "clima": "☀️ Sol",
  "startTime": "2026-01-15T10:00:00Z",
  "pontosTrajeto": [...],
  "timestamp": 1705312800000
}
```

### Validação de idade:
```javascript
const idade = Date.now() - estado.timestamp;
const horas = idade / (1000 * 60 * 60);

if (horas > 24) {
  // Estado muito antigo, ignorar
  localStorage.removeItem(DERIVA_ATIVA_KEY);
  return false;
}
```

---

## 🎨 Interface

### Ao restaurar uma deriva:

1. A página carrega
2. Deteta deriva em curso no localStorage
3. Mostra interface de deriva ativa
4. Reinicia geolocalização
5. Mostra alerta: "Deriva anterior restaurada! Pode continuar a sua deriva."

### Botões disponíveis:

- **✕** (vermelho) - Abandonar deriva sem salvar
- **✓** (verde) - Finalizar e salvar deriva

---

## 💡 Dicas de Uso

### Para máxima fiabilidade:

1. **Não feches o browser** durante a deriva
2. **Mantém o browser aberto** em segundo plano
3. **Finaliza a deriva** quando terminares
4. **Não limpes o cache** durante uma deriva

### Se algo correr mal:

1. **Recarrega a página** - O estado é restaurado
2. **Verifica o console** (F12) - Vê mensagens de debug
3. **Usa o botão ✕** - Para abandonar e começar de novo

---

## 🔐 Privacidade

- Os dados ficam **apenas no teu dispositivo**
- **Nenhum dado** é enviado para servidores externos
- **Podes limpar** a qualquer momento nas configurações do browser
- **Não persiste** após fechar o browser (a menos que uses "manter dados")

---

## 🚀 Próximos Passos (Opcional)

Se quiseres ainda mais fiabilidade, podes adicionar:

1. **Service Worker** - Para manter GPS ativo em background
2. **Sincronização com servidor** - Backup no SQLite do servidor
3. **Notificações push** - Para lembrar de derivas pendentes

Mas para uso pessoal, a solução atual já é **suficiente e robusta**!

---

## 📞 Problemas?

### "A deriva não restaurou"

1. Verifica se o localStorage está ativo
2. Abre o console (F12) e vê as mensagens
3. Confirma que não passou mais de 24 horas

### "Perdi a deriva mesmo assim"

1. O browser pode ter limpado o localStorage
2. O estado pode ter mais de 24 horas
3. Pode ter havido um erro ao guardar

**Solução:** Usa o botão "Finalizar" sempre que possível para salvar no servidor.

---

**Agora podes fazer derivas longas sem medo de perder o progresso!** ◉
