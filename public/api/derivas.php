<?php
/**
 * API REST para Derivas
 * Endpoints:
 *   GET    /api/derivas.php              - Lista todas as derivas
 *   GET    /api/derivas.php?id=XXX       - Obtém uma deriva específica
 *   POST   /api/derivas.php              - Cria nova deriva (arquivando a anterior)
 *   PUT    /api/derivas.php              - Atualiza deriva (título)
 *   DELETE /api/derivas.php?id=XXX       - Deleta uma deriva
 *   POST   /api/derivas.php?arquivar=1   - Arquiva uma deriva
 *   POST   /api/derivas.php?reativar=1   - Reativa uma deriva arquivada
 */

require_once __DIR__ . '/config.php';

try {
    $db = getDB();
} catch (Exception $e) {
    jsonError('Erro ao conectar ao banco: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;
$arquivar = isset($_GET['arquivar']);
$reativar = isset($_GET['reativar']);

try {
    // Arquivar deriva
    if ($arquivar && $method === 'POST') {
        arquivarDeriva($db);
    }
    // Reativar deriva
    elseif ($reativar && $method === 'POST') {
        reativarDeriva($db);
    }
    // CRUD normal
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
                criarDeriva($db);
                break;
            case 'PUT':
                atualizarDeriva($db);
                break;
            case 'DELETE':
                if ($id) {
                    deletarDeriva($db, $id);
                } else {
                    jsonError('ID é obrigatório');
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

function getAllDerivas($db) {
    $result = $db->query('SELECT * FROM derivas ORDER BY data_criacao DESC');
    $derivas = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $row['descobertas'] = getDescobertas($db, $row['id']);
        $row['total_descobertas'] = count($row['descobertas']);
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
    
    $deriva['descobertas'] = getDescobertas($db, $id);
    $deriva['total_descobertas'] = count($deriva['descobertas']);
    
    jsonResponse($deriva);
}

function criarDeriva($db) {
    $data = getInput();
    
    if (!$data) {
        jsonError('Dados inválidos');
    }
    
    // Arquivar deriva ativa anterior (se existir)
    $db->exec('UPDATE derivas SET estado = "arquivada" WHERE estado = "ativa"');
    
    // Criar nova deriva
    $id = generateId();
    $dataCriacao = date('c');
    $titulo = isset($data['titulo']) && !empty($data['titulo']) 
        ? $data['titulo'] 
        : 'Deriva de ' . date('d/m/Y H:i');
    
    $stmt = $db->prepare('
        INSERT INTO derivas (id, titulo, data_criacao, estado)
        VALUES (:id, :titulo, :data_criacao, "ativa")
    ');
    
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $stmt->bindValue(':titulo', $titulo, SQLITE3_TEXT);
    $stmt->bindValue(':data_criacao', $dataCriacao, SQLITE3_TEXT);
    
    $stmt->execute();
    
    jsonResponse([
        'success' => true,
        'id' => $id,
        'titulo' => $titulo,
        'data_criacao' => $dataCriacao,
        'estado' => 'ativa'
    ], 201);
}

function atualizarDeriva($db) {
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
    
    // Atualizar título
    if (isset($data['titulo'])) {
        $stmt = $db->prepare('UPDATE derivas SET titulo = :titulo WHERE id = :id');
        $stmt->bindValue(':titulo', $data['titulo'], SQLITE3_TEXT);
        $stmt->bindValue(':id', $id, SQLITE3_TEXT);
        $stmt->execute();
    }
    
    jsonResponse(['success' => true]);
}

function deletarDeriva($db, $id) {
    // Verificar se existe
    $stmt = $db->prepare('SELECT id FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $result = $stmt->execute();
    if (!$result->fetchArray()) {
        jsonError('Deriva não encontrada', 404);
    }
    
    // Obter fotos para deletar
    $stmt = $db->prepare('SELECT foto_path, foto_thumb_path FROM descobertas WHERE deriva_id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        if ($row['foto_path'] && file_exists($row['foto_path'])) {
            unlink($row['foto_path']);
        }
        if ($row['foto_thumb_path'] && file_exists($row['foto_thumb_path'])) {
            unlink($row['foto_thumb_path']);
        }
    }
    
    // Deletar deriva (CASCADE deleta descobertas)
    $stmt = $db->prepare('DELETE FROM derivas WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_TEXT);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

function arquivarDeriva($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('ID é obrigatório');
    }
    
    $stmt = $db->prepare('UPDATE derivas SET estado = "arquivada" WHERE id = :id');
    $stmt->bindValue(':id', $data['id'], SQLITE3_TEXT);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

function reativarDeriva($db) {
    $data = getInput();
    
    if (!$data || !isset($data['id'])) {
        jsonError('ID é obrigatório');
    }
    
    // Arquivar deriva ativa atual
    $db->exec('UPDATE derivas SET estado = "arquivada" WHERE estado = "ativa"');
    
    // Reativar a deriva selecionada
    $stmt = $db->prepare('UPDATE derivas SET estado = "ativa" WHERE id = :id');
    $stmt->bindValue(':id', $data['id'], SQLITE3_TEXT);
    $stmt->execute();
    
    jsonResponse(['success' => true]);
}

// ============ HELPERS ============

function getDescobertas($db, $derivaId) {
    $stmt = $db->prepare('
        SELECT id, notas, latitude, longitude, foto_path, foto_thumb_path, orientacao, timestamp
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
            'timestamp' => $row['timestamp']
        ];
    }
    
    return $descobertas;
}
