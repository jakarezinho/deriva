<?php
/**
 * API REST para Registos Situacionistas
 * Endpoints:
 *   GET    /api/registos.php?descoberta_id=XXX  - Lista registos de uma descoberta
 *   POST   /api/registos.php                    - Cria novo registo
 *   PUT    /api/registos.php                    - Atualiza registo
 *   DELETE /api/registos.php?id=XXX             - Deleta registo
 */

require_once __DIR__ . '/config.php';

try {
    $db = getDB();
} catch (Exception $e) {
    jsonError('Erro ao conectar ao banco: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;
$descobertaId = isset($_GET['descoberta_id']) ? $_GET['descoberta_id'] : null;

try {
    switch ($method) {
        case 'GET':
            if ($descobertaId) {
                getRegistos($db, $descobertaId);
            } else {
                jsonError('descoberta_id é obrigatório');
            }
            break;
        case 'POST':
            criarRegisto($db);
            break;
        case 'PUT':
            atualizarRegisto($db);
            break;
        case 'DELETE':
            if ($id) {
                deletarRegisto($db, $id);
            } else {
                jsonError('ID é obrigatório');
            }
            break;
        default:
            jsonError('Método não permitido', 405);
    }
} catch (Exception $e) {
    jsonError('Erro: ' . $e->getMessage(), 500);
}

// ============ FUNÇÕES ============

function getRegistos($db, $descobertaId) {
    $stmt = $db->prepare('
        SELECT id, tipo, conteudo, timestamp
        FROM registos
        WHERE descoberta_id = :id
        ORDER BY timestamp ASC
    ');
    $stmt->bindValue(':id', $descobertaId, SQLITE3_INTEGER);
    $result = $stmt->execute();
    
    $registos = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $registos[] = [
            'id' => (int)$row['id'],
            'tipo' => $row['tipo'],
            'conteudo' => $row['conteudo'],
            'timestamp' => $row['timestamp']
        ];
    }
    
    jsonResponse($registos);
}

function criarRegisto($db) {
    $data = getInput();
    
    if (!$data || !isset($data['descoberta_id']) || !isset($data['tipo']) || !isset($data['conteudo'])) {
        jsonError('descoberta_id, tipo e conteudo são obrigatórios');
    }
    
    // Validar tipo
    $tiposValidos = [
        'sensorial',
        'pensamento',
        'encontro',
        'imagem',
        'frase',
        'objeto',
        'atmosfera',
        'desejo',
        'acaso'
    ];
    
    if (!in_array($data['tipo'], $tiposValidos)) {
        jsonError('Tipo de registo inválido');
    }
    
    $stmt = $db->prepare('
        INSERT INTO registos (descoberta_id, tipo, conteudo, timestamp)
        VALUES (:descoberta_id, :tipo, :conteudo, :timestamp)
    ');
    
    $stmt->bindValue(':descoberta_id', $data['descoberta_id'], SQLITE3_INTEGER);
    $stmt->bindValue(':tipo', $data['tipo'], SQLITE3_TEXT);
    $stmt->bindValue(':conteudo', $data['conteudo'], SQLITE3_TEXT);
    $stmt->bindValue(':timestamp', date('c'), SQLITE3_TEXT);
    
    $stmt->execute();
    
    $id = $db->lastInsertRowID();
    
    jsonResponse([
        'success' => true,
        'id' => $id
    ], 201);
}

function atualizarRegisto($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('ID é obrigatório');
    }
    
    $id = $data['id'];
    
    // Verificar se existe
    $stmt = $db->prepare('SELECT id FROM registos WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        jsonError('Registo não encontrado', 404);
    }
    
    // Construir query dinâmica
    $updates = [];
    $params = [];
    
    if (isset($data['tipo'])) {
        $updates[] = 'tipo = :tipo';
        $params[':tipo'] = $data['tipo'];
    }
    if (isset($data['conteudo'])) {
        $updates[] = 'conteudo = :conteudo';
        $params[':conteudo'] = $data['conteudo'];
    }
    
    if (empty($updates)) {
        jsonError('Nenhum campo para atualizar');
    }
    
    $query = 'UPDATE registos SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $params[':id'] = $id;
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $type = is_int($value) ? SQLITE3_INTEGER : SQLITE3_TEXT;
        $stmt->bindValue($key, $value, $type);
    }
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

function deletarRegisto($db, $id) {
    $stmt = $db->prepare('DELETE FROM registos WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}
