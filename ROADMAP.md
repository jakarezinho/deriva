# 🗺️ Roadmap - Deriva Urbana

## Histórico de Implementações e Próximas Etapas

---

## ✅ IMPLEMENTADO (v1.0 - v2.0)

### 📦 Fase 0: Projeto Base Standalone
- [x] HTML5 + CSS3 + JavaScript ES6+ puro
- [x] PHP 7.4+ com SQLite3
- [x] 100% standalone (sem Node.js, sem npm, sem build)
- [x] Deploy direto em qualquer servidor PHP
- [x] Documentação completa

### 🎯 Fase 0.1: Sistema de Prompts (v1.0)
- [x] 150 prompts situacionistas
- [x] 7 categorias temáticas
- [x] Filtro por categoria
- [x] Seleção aleatória

### 🗺️ Fase 0.2: Mapa e Geolocalização (v1.0)
- [x] Mapa Leaflet interativo
- [x] Rastreamento GPS contínuo
- [x] Visualização do trajeto (linha)
- [x] Cálculo de distância (Haversine)
- [x] Marcadores de início/fim
- [x] Persistência de pontos GPS

### 💾 Fase 0.3: Persistência (v1.0)
- [x] localStorage (offline)
- [x] SQLite no servidor (online)
- [x] Detecção automática de modo
- [x] Export/Import JSON
- [x] Recuperação automática ao recarregar

### ✏️ Fase 0.4: Gestão de Derivas (v1.0)
- [x] Criar deriva
- [x] Editar deriva
- [x] Eliminar deriva
- [x] Pausar deriva
- [x] Continuar deriva pausada
- [x] Finalizar deriva
- [x] Abandonar deriva
- [x] Arquivo de derivas

### 📝 Fase 0.5: Diário de Bordo (v1.0)
- [x] Lista cronológica de prompts seguidos
- [x] Tempo gasto em cada prompt
- [x] Prompt ativo destacado
- [x] Timer em tempo real

### 🎨 Fase 0.6: Registos da Deriva (v1.0)
- [x] 🔍 Descobertas
- [x] 💭 Pensamentos errantes
- [x] 🎭 Encontros
- [x] 🗣️ Frases ouvidas
- [x] 🎁 Objetos encontrados
- [x] 🌡️ Atmosfera do lugar
- [x] 💫 Desejos despertados
- [x] 🎲 Acasos significativos
- [x] Sistema de tabs

### 🐛 Fase 0.7: Correções de Bugs (v1.0)
- [x] Categorias não mantidas
- [x] Pulsação na lista de prompts
- [x] Texto "Segui" → "Seguir"
- [x] Função inexistente `seguirPrompt`
- [x] `descobertas is not defined`
- [x] Z-index do mapa sobre modais

---

### 🔄 REFORMULAÇÃO COMPLETA (v2.0)

### 🏗️ Fase 1: Nova Base
- [x] Nova estrutura do banco de dados
- [x] CRUD de derivas (criar, arquivar, reativar, eliminar)
- [x] Interface básica de deriva ativa
- [x] Botão "Localizar-me"
- [x] Sistema de arquivo de derivas

### 📸 Fase 2: Fotos
- [x] Upload de fotos para servidor
- [x] Processamento no browser (compressão adaptativa)
- [x] Correção de orientação EXIF
- [x] Geração de miniaturas (200x200px)
- [x] Marcadores no mapa com fotos
- [x] Janela flutuante (foto + notas)
- [x] Galeria de descobertas

---

## 🚧 PRÓXIMAS ETAPAS

### 📦 Fase 3: Melhorias Essenciais
- [ ] Editar descoberta individual (mudar foto, notas, localização)
- [ ] Exportar deriva como JSON
- [ ] Reordenar descobertas (drag & drop)
- [ ] Marcar descoberta como favorita
- [ ] Adicionar múltiplas notas a uma descoberta

### 🎨 Fase 4: Interface e UX
- [ ] Modo escuro/claro
- [ ] Animações de transição
- [ ] Skeleton loading
- [ ] Toast notifications
- [ ] Confirmação visual de ações
- [ ] Tutorial interativo para novos utilizadores

### 🗺️ Fase 5: Mapa Avançado
- [ ] Diferentes tipos de mapa (satélite, terreno)
- [ ] Clustering de marcadores (quando muitos próximos)
- [ ] Filtro de descobertas por data no mapa
- [ ] Medir distância entre descobertas
- [ ] Exportar trajeto como GPX/KML

### 📱 Fase 6: Mobile e PWA
- [ ] Service Worker (offline)
- [ ] Manifest.json (instalar como app)
- [ ] Push notifications
- [ ] Câmera nativa (melhor experiência)
- [ ] Gestos touch (swipe, pinch)

### 📊 Fase 7: Estatísticas e Análise
- [ ] Dashboard com estatísticas
- [ ] Gráfico de derivas por mês
- [ ] Mapa de calor de descobertas
- [ ] Palavras mais usadas nas notas
- [ ] Tempo médio por deriva
- [ ] Distância total percorrida

### 🔍 Fase 8: Pesquisa e Filtros
- [ ] Pesquisa por texto nas notas
- [ ] Filtro por data
- [ ] Filtro por localização (raio)
- [ ] Filtro por tipo (com/sem foto)
- [ ] Ordenação (data, localização, notas)

### 💾 Fase 9: Backup e Sincronização
- [ ] Backup automático
- [ ] Sincronização entre dispositivos
- [ ] Exportar como PDF (com fotos)
- [ ] Importar de outros formatos
- [ ] Versão de dados (undo/redo)

### 🎭 Fase 10: Social e Partilha
- [ ] Partilhar deriva (link público)
- [ ] Exportar como galeria de fotos
- [ ] Criar story/timeline visual
- [ ] QR code para partilha rápida
- [ ] Embed em outros sites

### 🤖 Fase 11: Inteligência e Automação
- [ ] Sugestões automáticas de notas
- [ ] Detecção de lugares conhecidos
- [ ] Reconhecimento de objetos nas fotos
- [ ] Tags automáticas
- [ ] Resumo automático da deriva

---

## 📋 PRIORIDADES

### 🔴 Alta Prioridade (Fase 3)
1. Editar descoberta individual
2. Exportar deriva como JSON
3. Marcar como favorita

### 🟡 Média Prioridade (Fases 4-6)
1. Modo escuro/claro
2. PWA (offline)
3. Diferentes tipos de mapa

### 🟢 Baixa Prioridade (Fases 7-11)
1. Estatísticas avançadas
2. Pesquisa e filtros
3. Social e partilha

---

## 🎯 OBJETIVOS DE CURTO PRAZO

### Esta Semana
- [ ] Testar v2.0 no terreno
- [ ] Corrigir bugs encontrados
- [ ] Implementar edição de descobertas
- [ ] Adicionar export JSON

### Este Mês
- [ ] Implementar PWA (offline)
- [ ] Adicionar diferentes tipos de mapa
- [ ] Criar dashboard de estatísticas
- [ ] Melhorar experiência mobile

### Este Trimestre
- [ ] Pesquisa e filtros
- [ ] Backup automático
- [ ] Partilha de derivas
- [ ] Documentação de utilizador

---

## 📊 MÉTRICAS DO PROJETO

### Código
- **Ficheiros:** 8 (código) + 15+ (documentação)
- **Linhas de código:** ~2500
- **Tamanho:** ~125 KB
- **Dependências:** 0 (apenas Leaflet via CDN)

### Funcionalidades
- **v1.0:** 25+ funcionalidades
- **v2.0:** 15+ funcionalidades (reformuladas)
- **Total planeado:** 50+ funcionalidades

### Tempo
- **v1.0:** ~10 horas
- **v2.0:** ~8 horas
- **Total:** ~18 horas

---

## 🏆 CONQUISTAS

### Técnicas
- ✅ Projeto 100% standalone
- ✅ Zero dependências complexas
- ✅ Deploy em 5 minutos
- ✅ Processamento de fotos no browser
- ✅ Correção automática de orientação EXIF
- ✅ Compressão adaptativa

### Funcionais
- ✅ Sistema completo de descobertas
- ✅ Mapa interativo com marcadores
- ✅ Upload e gestão de fotos
- ✅ Arquivo de derivas
- ✅ Geolocalização precisa

### Documentação
- ✅ 15+ documentos técnicos
- ✅ Guias de deploy e migração
- ✅ Exemplos de código
- ✅ Troubleshooting completo

---

## 🔮 VISÃO FUTURA

### Missão
Criar a melhor aplicação web para registo de descobertas urbanas, mantendo a simplicidade e o espírito situacionista.

### Valores
- **Simplicidade** - Interface limpa e focada
- **Standalone** - Sem dependências complexas
- **Privacidade** - Dados no teu servidor
- **Performance** - Rápido e eficiente
- **Acessibilidade** - Funciona em qualquer dispositivo

### Objetivos
1. Ser a referência em aplicações de deriva urbana
2. Manter 100% standalone e sem dependências
3. Oferecer a melhor experiência de utilizador
4. Respeitar a privacidade dos dados
5. Inspirar exploração urbana consciente

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

### 1. Testar v2.0 no Terreno
- [ ] Fazer uma deriva real
- [ ] Testar todas as funcionalidades
- [ ] Reportar bugs
- [ ] Sugerir melhorias

### 2. Implementar Fase 3
- [ ] Editar descoberta individual
- [ ] Exportar deriva como JSON
- [ ] Marcar como favorita

### 3. Melhorar Documentação
- [ ] Vídeo tutorial
- [ ] FAQ
- [ ] Exemplos de uso
- [ ] Casos de estudo

---

**Última atualização:** 2026-01-15  
**Versão atual:** 2.0  
**Próxima versão:** 2.1 (Fase 3)  
**Status:** ✅ Fases 1 e 2 Completas
