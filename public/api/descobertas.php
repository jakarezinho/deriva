<?php
/**
 * API REST para Descobertas
 * Endpoints:
 *   GET    /api/descobertas.php?deriva_id=XXX  - Lista descobertas de uma deriva
 *   POST   /api/descobertas.php                - Cria nova descoberta
 *   PUT    /api/descobertas.php                - Atualiza descoberta
 *   DELETE /api/descobertas.php?id=XXX         - Deleta descoberta
 */

require_once __DIR__ . '/config.php';

try {
    $db = getDB();
} catch (Exception $e) {
    jsonError('Erro ao conectar ao banco: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;
$derivaId = isset($_GET['deriva_id']) ? $_GET['deriva_id'] : null;

try {
    switch ($method) {
        case 'GET':
            if ($derivaId) {
                getDescobertas($db, $derivaId);
            } else {
                jsonError('deriva_id é obrigatório');
            }
            break;
        case 'POST':
            criarDescoberta($db);
            break;
        case 'PUT':
            atualizarDescoberta($db);
            break;
        case 'DELETE':
            if ($id) {
                deletarDescoberta($db, $id);
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

function getDescobertas($db, $derivaId) {
    $stmt = $db->prepare('
        SELECT id, notas, latitude, longitude, foto_path, foto_thumb_path, orientacao, favorita, timestamp
        FROM descobertas
        WHERE deriva_id = :id
        ORDER BY timestamp ASC
    ');
    $stmt->bindValue(':id', $derivaId, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $descobertas = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $descobertas[] = [
            'id' => (int)$row['id'],
            'notas' => $row['notas'],
            'latitude' => $row['latitude'] ? (float)$row['latitude'] : null,
            'longitude' => $row['longitude'] ? (float)$row['longitude'] : null,
            'foto_path' => $row['foto_path'],
            'foto_thumb_path' => $row['foto_thumb_path'],
            'orientacao' => (int)$row['orientacao'],
            'favorita' => (int)$row['favorita'],
            'timestamp' => $row['timestamp']
        ];
    }
    
    jsonResponse($descobertas);
}

function criarDescoberta($db) {
    $data = getInput();
    
    if (!$data || !isset($data['deriva_id'])) {
        jsonError('deriva_id é obrigatório');
    }
    
    // Verificar se a deriva existe e está ativa
    $stmt = $db->prepare('SELECT id, estado FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $data['deriva_id'], SQLITE3_TEXT);
    $result = $stmt->execute();
    $deriva = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$deriva) {
        jsonError('Deriva não encontrada', 404);
    }
    
    if ($deriva['estado'] !== 'ativa') {
        jsonError('Não é possível adicionar descobertas a uma deriva arquivada', 400);
    }
    
    $stmt = $db->prepare('
        INSERT INTO descobertas (deriva_id, notas, latitude, longitude, foto_path, foto_thumb_path, orientacao, favorita, timestamp)
        VALUES (:deriva_id, :notas, :latitude, :longitude, :foto_path, :foto_thumb_path, :orientacao, :favorita, :timestamp)
    ');
    
    $stmt->bindValue(':deriva_id', $data['deriva_id'], SQLITE3_TEXT);
    $stmt->bindValue(':notas', $data['notas'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':latitude', $data['latitude'] ?? null, SQLITE3_FLOAT);
    $stmt->bindValue(':longitude', $data['longitude'] ?? null, SQLITE3_FLOAT);
    $stmt->bindValue(':foto_path', $data['foto_path'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':foto_thumb_path', $data['foto_thumb_path'] ?? null, SQLITE3_TEXT);
    $stmt->bindValue(':orientacao', $data['orientacao'] ?? 0, SQLITE3_INTEGER);
    $stmt->bindValue(':favorita', $data['favorita'] ?? 0, SQLITE3_INTEGER);
    $stmt->bindValue(':timestamp', date('c'), SQLITE3_TEXT);
    
    $stmt->execute();
    
    $id = $db->lastInsertRowID();
    
    jsonResponse([
        'success' => true,
        'id' => $id
    ], 201);
}

function atualizarDescoberta($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('ID é obrigatório');
    }
    
    $id = $data['id'];
    
    // Verificar se existe
    $stmt = $db->prepare('SELECT id FROM descobertas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        jsonError('Descoberta não encontrada', 404);
    }
    
    // Construir query dinâmica
    $updates = [];
    $params = [];
    
    if (isset($data['notas'])) {
        $updates[] = 'notas = :notas';
        $params[':notas'] = $data['notas'];
    }
    if (isset($data['latitude'])) {
        $updates[] = 'latitude = :latitude';
        $params[':latitude'] = $data['latitude'];
    }
    if (isset($data['longitude'])) {
        $updates[] = 'longitude = :longitude';
        $params[':longitude'] = $data['longitude'];
    }
    if (isset($data['foto_path'])) {
        $updates[] = 'foto_path = :foto_path';
        $params[':foto_path'] = $data['foto_path'];
    }
    if (isset($data['foto_thumb_path'])) {
        $updates[] = 'foto_thumb_path = :foto_thumb_path';
        $params[':foto_thumb_path'] = $data['foto_thumb_path'];
    }
    if (isset($data['orientacao'])) {
        $updates[] = 'orientacao = :orientacao';
        $params[':orientacao'] = $data['orientacao'];
    }
    if (isset($data['favorita'])) {
        $updates[] = 'favorita = :favorita';
        $params[':favorita'] = $data['favorita'] ? 1 : 0;
    }
    
    if (empty($updates)) {
        jsonError('Nenhum campo para atualizar');
    }
    
    $query = 'UPDATE descobertas SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $params[':id'] = $id;
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $type = is_int($value) ? SQLITE3_INTEGER : (is_float($value) ? SQLITE3_FLOAT : SQLITE3_TEXT);
        $stmt->bindValue($key, $value, $type);
    }
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

function deletarDescoberta($db, $id) {
    // Obter foto para deletar
    $stmt = $db->prepare('SELECT foto_path, foto_thumb_path FROM descobertas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $descoberta = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$descoberta) {
        jsonError('Descoberta não encontrada', 404);
    }
    
    // Deletar ficheiros de foto
    if ($descoberta['foto_path'] && file_exists($descoberta['foto_path'])) {
        unlink($descoberta['foto_path']);
    }
    if ($descoberta['foto_thumb_path'] && file_exists($descoberta['foto_thumb_path'])) {
        unlink($descoberta['foto_thumb_path']);
    }
    
    // Deletar descoberta
    $stmt = $db->prepare('DELETE FROM descobertas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}
