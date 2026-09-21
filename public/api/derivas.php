<?php
/**
 * API REST para Derivas Urbanas
 * Endpoints:
 *   GET    /api/derivas.php          - Lista todas as derivas
 *   GET    /api/derivas.php?id=XXX   - Obtém uma deriva específica
 *   POST   /api/derivas.php          - Cria nova deriva
 *   PUT    /api/derivas.php          - Atualiza deriva existente
 *   DELETE /api/derivas.php?id=XXX   - Deleta uma deriva
 *   GET    /api/derivas.php?stats=1  - Obtém estatísticas
 *   GET    /api/derivas.php?config=1 - Obtém configuração
 *   POST   /api/derivas.php?config=1 - Salva configuração
 *   POST   /api/derivas.php?export=1 - Exporta todos os dados
 *   POST   /api/derivas.php?import=1 - Importa dados
 */

require_once __DIR__ . '/config.php';

try {
    $db = getDB();
} catch (Exception $e) {
    jsonError('Erro ao conectar ao banco: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;
$isStats = isset($_GET['stats']);
$isConfig = isset($_GET['config']);
$isExport = isset($_GET['export']);
$isImport = isset($_GET['import']);

// Verificar se é uma requisição de ponto de trajeto
$isPonto = isset($_GET['ponto']);

// Rotas
try {
    // Ponto de trajeto (durante a deriva)
    if ($isPonto) {
        if ($method === 'POST') {
            salvarPontoTrajeto($db);
        } elseif ($method === 'GET' && $id) {
            getPontosTrajeto($db, $id);
        } else {
            jsonError('ID da deriva é obrigatório');
        }
    }
    // Config
    elseif ($isConfig) {
        if ($method === 'GET') {
            getConfig($db);
        } elseif ($method === 'POST') {
            saveConfig($db);
        }
    }
    // Export
    elseif ($isExport && $method === 'POST') {
        exportAll($db);
    }
    // Import
    elseif ($isImport && $method === 'POST') {
        importAll($db);
    }
    // Stats
    elseif ($isStats && $method === 'GET') {
        getStats($db);
    }
    // CRUD de derivas
    else {
        switch ($method) {
            case 'GET':
                if ($id) {
                    getDeriva($db, $id);
                } else {
                    getAllDerivas($db);
                }
                break;
            case 'POST':
                createDeriva($db);
                break;
            case 'PUT':
                updateDeriva($db);
                break;
            case 'DELETE':
                if ($id) {
                    deleteDeriva($db, $id);
                } else {
                    jsonError('ID é obrigatório para deletar');
                }
                break;
            default:
                jsonError('Método não permitido', 405);
        }
    }
} catch (Exception $e) {
    jsonError('Erro: ' . $e->getMessage(), 500);
}

// ============ FUNÇÕES ============

function salvarPontoTrajeto($db) {
    $data = getInput();
    
    if (!$data || !isset($data['deriva_id']) || !isset($data['latitude']) || !isset($data['longitude'])) {
        jsonError('Dados inválidos: deriva_id, latitude e longitude são obrigatórios');
    }
    
    $stmt = $db->prepare('
        INSERT INTO pontos_trajeto (deriva_id, latitude, longitude, accuracy, timestamp)
        VALUES (:deriva_id, :latitude, :longitude, :accuracy, :timestamp)
    ');
    
    $stmt->bindValue(':deriva_id', $data['deriva_id'], SQLITE3_TEXT);
    $stmt->bindValue(':latitude', $data['latitude'], SQLITE3_FLOAT);
    $stmt->bindValue(':longitude', $data['longitude'], SQLITE3_FLOAT);
    $stmt->bindValue(':accuracy', $data['accuracy'] ?? null, SQLITE3_FLOAT);
    $stmt->bindValue(':timestamp', $data['timestamp'] ?? date('c'), SQLITE3_TEXT);
    
    $stmt->execute();
    
    jsonResponse(['success' => true], 201);
}

function getPontosTrajeto($db, $derivaId) {
    $stmt = $db->prepare('
        SELECT latitude, longitude, accuracy, timestamp 
        FROM pontos_trajeto 
        WHERE deriva_id = :deriva_id 
        ORDER BY timestamp ASC
    ');
    
    $stmt->bindValue(':deriva_id', $derivaId, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $pontos = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $pontos[] = [
            'lat' => (float)$row['latitude'],
            'lng' => (float)$row['longitude'],
            'accuracy' => $row['accuracy'] ? (float)$row['accuracy'] : null,
            'timestamp' => $row['timestamp']
        ];
    }
    
    jsonResponse($pontos);
}

function getAllDerivas($db) {
    $result = $db->query('SELECT * FROM derivas ORDER BY data_inicio DESC');
    $derivas = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $row['promptsSeguidos'] = getPromptsSeguidos($db, $row['id']);
        $row['descobertas'] = getDescobertas($db, $row['id']);
        $row['trajeto'] = getTrajeto($db, $row['id']);
        
        // Formatar localizações
        if ($row['localizacao_inicio_lat'] && $row['localizacao_inicio_lng']) {
            $row['localizacao_inicio'] = [
                'lat' => (float)$row['localizacao_inicio_lat'],
                'lng' => (float)$row['localizacao_inicio_lng']
            ];
        } else {
            $row['localizacao_inicio'] = null;
        }
        
        if ($row['localizacao_fim_lat'] && $row['localizacao_fim_lng']) {
            $row['localizacao_fim'] = [
                'lat' => (float)$row['localizacao_fim_lat'],
                'lng' => (float)$row['localizacao_fim_lng']
            ];
        } else {
            $row['localizacao_fim'] = null;
        }
        
        // Remover campos individuais de localização
        unset($row['localizacao_inicio_lat']);
        unset($row['localizacao_inicio_lng']);
        unset($row['localizacao_fim_lat']);
        unset($row['localizacao_fim_lng']);
        
        // Decodificar registos
        if ($row['registos']) {
            $row['registos'] = json_decode($row['registos'], true);
        } else {
            $row['registos'] = null;
        }
        
        $derivas[] = $row;
    }
    
    jsonResponse($derivas);
}

function getDeriva($db, $id) {
    $stmt = $db->prepare('SELECT * FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $result = $stmt->execute();
    $deriva = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$deriva) {
        jsonError('Deriva não encontrada', 404);
    }
    
    $deriva['promptsSeguidos'] = getPromptsSeguidos($db, $id);
    $deriva['descobertas'] = getDescobertas($db, $id);
    $deriva['trajeto'] = getTrajeto($db, $id);
    
    // Formatar localizações
    if ($deriva['localizacao_inicio_lat'] && $deriva['localizacao_inicio_lng']) {
        $deriva['localizacao_inicio'] = [
            'lat' => (float)$deriva['localizacao_inicio_lat'],
            'lng' => (float)$deriva['localizacao_inicio_lng']
        ];
    } else {
        $deriva['localizacao_inicio'] = null;
    }
    
    if ($deriva['localizacao_fim_lat'] && $deriva['localizacao_fim_lng']) {
        $deriva['localizacao_fim'] = [
            'lat' => (float)$deriva['localizacao_fim_lat'],
            'lng' => (float)$deriva['localizacao_fim_lng']
        ];
    } else {
        $deriva['localizacao_fim'] = null;
    }
    
    // Remover campos individuais de localização
    unset($deriva['localizacao_inicio_lat']);
    unset($deriva['localizacao_inicio_lng']);
    unset($deriva['localizacao_fim_lat']);
    unset($deriva['localizacao_fim_lng']);
    
    // Decodificar registos
    if ($deriva['registos']) {
        $deriva['registos'] = json_decode($deriva['registos'], true);
    } else {
        $deriva['registos'] = null;
    }
    
    jsonResponse($deriva);
}

function createDeriva($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('Dados inválidos');
    }
    
    // Extrair localização
    $locInicioLat = null;
    $locInicioLng = null;
    $locFimLat = null;
    $locFimLng = null;
    
    if (isset($data['localizacao_inicio']) && is_array($data['localizacao_inicio'])) {
        $locInicioLat = $data['localizacao_inicio']['lat'] ?? null;
        $locInicioLng = $data['localizacao_inicio']['lng'] ?? null;
    }
    
    if (isset($data['localizacao_fim']) && is_array($data['localizacao_fim'])) {
        $locFimLat = $data['localizacao_fim']['lat'] ?? null;
        $locFimLng = $data['localizacao_fim']['lng'] ?? null;
    }
    
    $stmt = $db->prepare('
        INSERT INTO derivas (id, data_inicio, data_fim, duracao, local_inicio, local_fim, notas, humor, clima, distancia, localizacao_inicio_lat, localizacao_inicio_lng, localizacao_fim_lat, localizacao_fim_lng, estado, registos)
        VALUES (:id, :data_inicio, :data_fim, :duracao, :local_inicio, :local_fim, :notas, :humor, :clima, :distancia, :loc_inicio_lat, :loc_inicio_lng, :loc_fim_lat, :loc_fim_lng, :estado, :registos)
    ');
    
    $stmt->bindValue(':id', $data['id'], SQLITE3_TEXT);
    $stmt->bindValue(':data_inicio', $data['data_inicio'] ?? $data['dataInicio'], SQLITE3_TEXT);
    $stmt->bindValue(':data_fim', $data['data_fim'] ?? $data['dataFim'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':duracao', $data['duracao'] ?? null, SQLITE3_INTEGER);
    $stmt->bindValue(':local_inicio', $data['local_inicio'] ?? $data['localInicio'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':local_fim', $data['local_fim'] ?? $data['localFim'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':notas', $data['notas'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':humor', $data['humor'] ?? 3, SQLITE3_INTEGER);
    $stmt->bindValue(':clima', $data['clima'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':distancia', $data['distancia'] ?? null, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_inicio_lat', $locInicioLat, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_inicio_lng', $locInicioLng, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_fim_lat', $locFimLat, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_fim_lng', $locFimLng, SQLITE3_FLOAT);
    $stmt->bindValue(':estado', $data['estado'] ?? 'finalizada', SQLITE3_TEXT);
    $stmt->bindValue(':registos', isset($data['registos']) ? json_encode($data['registos']) : null, SQLITE3_TEXT);
    
    $stmt->execute();
    
    // Inserir prompts seguidos
    $promptsSeguidos = $data['promptsSeguidos'] ?? [];
    foreach ($promptsSeguidos as $prompt) {
        $stmtPrompt = $db->prepare('
            INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp)
            VALUES (:deriva_id, :prompt_id, :prompt_text, :timestamp)
        ');
        $stmtPrompt->bindValue(':deriva_id', $data['id'], SQLITE3_TEXT);
        $stmtPrompt->bindValue(':prompt_id', $prompt['promptId'] ?? $prompt['prompt_id'], SQLITE3_INTEGER);
        $stmtPrompt->bindValue(':prompt_text', $prompt['promptText'] ?? $prompt['prompt_text'], SQLITE3_TEXT);
        $stmtPrompt->bindValue(':timestamp', $prompt['timestamp'], SQLITE3_TEXT);
        $stmtPrompt->execute();
    }
    
    // Inserir descobertas
    $descobertas = $data['descobertas'] ?? [];
    foreach ($descobertas as $descoberta) {
        $stmtDesc = $db->prepare('INSERT INTO descobertas (deriva_id, texto) VALUES (:deriva_id, :texto)');
        $stmtDesc->bindValue(':deriva_id', $data['id'], SQLITE3_TEXT);
        $stmtDesc->bindValue(':texto', $descoberta, SQLITE3_TEXT);
        $stmtDesc->execute();
    }
    
    jsonResponse(['success' => true, 'id' => $data['id']], 201);
}

function updateDeriva($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('Dados inválidos');
    }
    
    $id = $data['id'];
    
    // Verificar se existe
    $stmt = $db->prepare('SELECT id FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        jsonError('Deriva não encontrada', 404);
    }
    
    // Extrair localização
    $locInicioLat = null;
    $locInicioLng = null;
    $locFimLat = null;
    $locFimLng = null;
    
    if (isset($data['localizacao_inicio']) && is_array($data['localizacao_inicio'])) {
        $locInicioLat = $data['localizacao_inicio']['lat'] ?? null;
        $locInicioLng = $data['localizacao_inicio']['lng'] ?? null;
    }
    
    if (isset($data['localizacao_fim']) && is_array($data['localizacao_fim'])) {
        $locFimLat = $data['localizacao_fim']['lat'] ?? null;
        $locFimLng = $data['localizacao_fim']['lng'] ?? null;
    }
    
    // Atualizar deriva
    $stmt = $db->prepare('
        UPDATE derivas SET 
            data_fim = :data_fim,
            duracao = :duracao,
            local_inicio = :local_inicio,
            local_fim = :local_fim,
            notas = :notas,
            humor = :humor,
            clima = :clima,
            distancia = :distancia,
            localizacao_inicio_lat = :loc_inicio_lat,
            localizacao_inicio_lng = :loc_inicio_lng,
            localizacao_fim_lat = :loc_fim_lat,
            localizacao_fim_lng = :loc_fim_lng,
            estado = :estado,
            registos = :registos,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
    ');
    
    $stmt->bindValue(':data_fim', $data['data_fim'] ?? $data['dataFim'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':duracao', $data['duracao'] ?? null, SQLITE3_INTEGER);
    $stmt->bindValue(':local_inicio', $data['local_inicio'] ?? $data['localInicio'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':local_fim', $data['local_fim'] ?? $data['localFim'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':notas', $data['notas'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':humor', $data['humor'] ?? 3, SQLITE3_INTEGER);
    $stmt->bindValue(':clima', $data['clima'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':distancia', $data['distancia'] ?? null, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_inicio_lat', $locInicioLat, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_inicio_lng', $locInicioLng, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_fim_lat', $locFimLat, SQLITE3_FLOAT);
    $stmt->bindValue(':loc_fim_lng', $locFimLng, SQLITE3_FLOAT);
    $stmt->bindValue(':estado', $data['estado'] ?? 'finalizada', SQLITE3_TEXT);
    $stmt->bindValue(':registos', isset($data['registos']) ? json_encode($data['registos']) : null, SQLITE3_TEXT);
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    
    $stmt->execute();
    
    // Atualizar prompts seguidos (deletar e reinserir)
    $stmt = $db->prepare('DELETE FROM prompts_seguidos WHERE deriva_id = :deriva_id');
    $stmt->bindValue(':deriva_id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    $promptsSeguidos = $data['promptsSeguidos'] ?? [];
    foreach ($promptsSeguidos as $prompt) {
        $stmtPrompt = $db->prepare('
            INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp)
            VALUES (:deriva_id, :prompt_id, :prompt_text, :timestamp)
        ');
        $stmtPrompt->bindValue(':deriva_id', $id, SQLITE3_TEXT);
        $stmtPrompt->bindValue(':prompt_id', $prompt['promptId'] ?? $prompt['prompt_id'], SQLITE3_INTEGER);
        $stmtPrompt->bindValue(':prompt_text', $prompt['promptText'] ?? $prompt['prompt_text'], SQLITE3_TEXT);
        $stmtPrompt->bindValue(':timestamp', $prompt['timestamp'], SQLITE3_TEXT);
        $stmtPrompt->execute();
    }
    
    // Atualizar descobertas (deletar e reinserir)
    $stmt = $db->prepare('DELETE FROM descobertas WHERE deriva_id = :deriva_id');
    $stmt->bindValue(':deriva_id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    $descobertas = $data['descobertas'] ?? [];
    foreach ($descobertas as $descoberta) {
        $stmtDesc = $db->prepare('INSERT INTO descobertas (deriva_id, texto) VALUES (:deriva_id, :texto)');
        $stmtDesc->bindValue(':deriva_id', $id, SQLITE3_TEXT);
        $stmtDesc->bindValue(':texto', $descoberta, SQLITE3_TEXT);
        $stmtDesc->execute();
    }
    
    jsonResponse(['success' => true]);
}

function deleteDeriva($db, $id) {
    // Verificar se existe
    $stmt = $db->prepare('SELECT id FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        jsonError('Deriva não encontrada', 404);
    }
    
    // Deletar (CASCADE deve cuidar dos relacionados)
    $stmt = $db->prepare('DELETE FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    // Garantir que os relacionados foram deletados
    $stmt = $db->prepare('DELETE FROM prompts_seguidos WHERE deriva_id = :deriva_id');
    $stmt->bindValue(':deriva_id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    $stmt = $db->prepare('DELETE FROM descobertas WHERE deriva_id = :deriva_id');
    $stmt->bindValue(':deriva_id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

function getStats($db) {
    $totalDerivas = $db->querySingle('SELECT COUNT(*) FROM derivas');
    $totalPrompts = $db->querySingle('SELECT COUNT(*) FROM prompts_seguidos');
    $totalMinutos = $db->querySingle('SELECT COALESCE(SUM(duracao), 0) FROM derivas');
    $mediaHumor = $db->querySingle('SELECT COALESCE(AVG(humor), 0) FROM derivas');
    $totalDescobertas = $db->querySingle('SELECT COUNT(*) FROM descobertas');
    
    jsonResponse([
        'totalDerivas' => (int)$totalDerivas,
        'totalPrompts' => (int)$totalPrompts,
        'totalMinutos' => (int)$totalMinutos,
        'mediaHumor' => round((float)$mediaHumor, 1),
        'totalDescobertas' => (int)$totalDescobertas
    ]);
}

function getConfig($db) {
    $result = $db->query('SELECT key, value FROM config');
    $config = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $config[$row['key']] = $row['value'];
    }
    
    jsonResponse([
        'nomeDerivante' => $config['nomeDerivante'] ?? 'Derivante',
        'cidadeBase' => $config['cidadeBase'] ?? '',
        'temaPreferido' => $config['temaPreferido'] ?? ''
    ]);
}

function saveConfig($db) {
    $data = getInput();
    
    if (!$data) {
        jsonError('Dados inválidos');
    }
    
    $fields = ['nomeDerivante', 'cidadeBase', 'temaPreferido'];
    
    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $stmt = $db->prepare('INSERT OR REPLACE INTO config (key, value) VALUES (:key, :value)');
            $stmt->bindValue(':key', $field, SQLITE3_TEXT);
            $stmt->bindValue(':value', $data[$field], SQLITE3_TEXT);
            $stmt->execute();
        }
    }
    
    jsonResponse(['success' => true]);
}

function exportAll($db) {
    $derivas = [];
    $result = $db->query('SELECT * FROM derivas ORDER BY data_inicio DESC');
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $row['promptsSeguidos'] = getPromptsSeguidos($db, $row['id']);
        $row['descobertas'] = getDescobertas($db, $row['id']);
        $derivas[] = $row;
    }
    
    $configResult = $db->query('SELECT key, value FROM config');
    $config = [];
    while ($row = $configResult->fetchArray(SQLITE3_ASSOC)) {
        $config[$row['key']] = $row['value'];
    }
    
    jsonResponse([
        'derivas' => $derivas,
        'config' => $config,
        'exportDate' => date('c'),
        'version' => '1.0'
    ]);
}

function importAll($db) {
    $data = getInput();
    
    if (!$data || !isset($data['derivas'])) {
        jsonError('Dados inválidos');
    }
    
    // Limpar dados existentes
    $db->exec('DELETE FROM derivas');
    $db->exec('DELETE FROM prompts_seguidos');
    $db->exec('DELETE FROM descobertas');
    $db->exec('DELETE FROM config');
    
    // Importar derivas
    foreach ($data['derivas'] as $deriva) {
        $stmt = $db->prepare('
            INSERT INTO derivas (id, data_inicio, data_fim, duracao, local_inicio, local_fim, notas, humor, clima, distancia)
            VALUES (:id, :data_inicio, :data_fim, :duracao, :local_inicio, :local_fim, :notas, :humor, :clima, :distancia)
        ');
        
        $stmt->bindValue(':id', $deriva['id'], SQLITE3_TEXT);
        $stmt->bindValue(':data_inicio', $deriva['data_inicio'] ?? $deriva['dataInicio'], SQLITE3_TEXT);
        $stmt->bindValue(':data_fim', $deriva['data_fim'] ?? $deriva['dataFim'] ?? null, SQLITE3_TEXT);
        $stmt->bindValue(':duracao', $deriva['duracao'] ?? null, SQLITE3_INTEGER);
        $stmt->bindValue(':local_inicio', $deriva['local_inicio'] ?? $deriva['localInicio'] ?? null, SQLITE3_TEXT);
        $stmt->bindValue(':local_fim', $deriva['local_fim'] ?? $deriva['localFim'] ?? null, SQLITE3_TEXT);
        $stmt->bindValue(':notas', $deriva['notas'] ?? null, SQLITE3_TEXT);
        $stmt->bindValue(':humor', $deriva['humor'] ?? 3, SQLITE3_INTEGER);
        $stmt->bindValue(':clima', $deriva['clima'] ?? null, SQLITE3_TEXT);
        $stmt->bindValue(':distancia', $deriva['distancia'] ?? null, SQLITE3_FLOAT);
        $stmt->execute();
        
        // Prompts
        foreach (($deriva['promptsSeguidos'] ?? []) as $prompt) {
            $stmtP = $db->prepare('INSERT INTO prompts_seguidos (deriva_id, prompt_id, prompt_text, timestamp) VALUES (:d, :p, :t, :ts)');
            $stmtP->bindValue(':d', $deriva['id'], SQLITE3_TEXT);
            $stmtP->bindValue(':p', $prompt['promptId'] ?? $prompt['prompt_id'], SQLITE3_INTEGER);
            $stmtP->bindValue(':t', $prompt['promptText'] ?? $prompt['prompt_text'], SQLITE3_TEXT);
            $stmtP->bindValue(':ts', $prompt['timestamp'], SQLITE3_TEXT);
            $stmtP->execute();
        }
        
        // Descobertas
        foreach (($deriva['descobertas'] ?? []) as $desc) {
            $stmtD = $db->prepare('INSERT INTO descobertas (deriva_id, texto) VALUES (:d, :t)');
            $stmtD->bindValue(':d', $deriva['id'], SQLITE3_TEXT);
            $stmtD->bindValue(':t', $desc, SQLITE3_TEXT);
            $stmtD->execute();
        }
    }
    
    // Importar config
    if (isset($data['config'])) {
        foreach ($data['config'] as $key => $value) {
            $stmt = $db->prepare('INSERT OR REPLACE INTO config (key, value) VALUES (:k, :v)');
            $stmt->bindValue(':k', $key, SQLITE3_TEXT);
            $stmt->bindValue(':v', $value, SQLITE3_TEXT);
            $stmt->execute();
        }
    }
    
    jsonResponse(['success' => true, 'imported' => count($data['derivas'])]);
}

// ============ HELPERS ============

function getPromptsSeguidos($db, $derivaId) {
    $stmt = $db->prepare('SELECT prompt_id, prompt_text, timestamp FROM prompts_seguidos WHERE deriva_id = :id ORDER BY timestamp');
    $stmt->bindValue(':id', $derivaId, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $prompts = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $prompts[] = [
            'promptId' => (int)$row['prompt_id'],
            'promptText' => $row['prompt_text'],
            'timestamp' => $row['timestamp']
        ];
    }
    return $prompts;
}

function getDescobertas($db, $derivaId) {
    $stmt = $db->prepare('SELECT texto FROM descobertas WHERE deriva_id = :id ORDER BY created_at');
    $stmt->bindValue(':id', $derivaId, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $descobertas = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $descobertas[] = $row['texto'];
    }
    return $descobertas;
}

function getTrajeto($db, $derivaId) {
    $stmt = $db->prepare('
        SELECT latitude, longitude, accuracy, timestamp 
        FROM pontos_trajeto 
        WHERE deriva_id = :deriva_id 
        ORDER BY timestamp ASC
    ');
    
    $stmt->bindValue(':deriva_id', $derivaId, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $pontos = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $pontos[] = [
            'lat' => (float)$row['latitude'],
            'lng' => (float)$row['longitude'],
            'accuracy' => $row['accuracy'] ? (float)$row['accuracy'] : null,
            'timestamp' => $row['timestamp']
        ];
    }
    
    return $pontos;
}
