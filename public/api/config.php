<?php
/**
 * Configuração do banco de dados SQLite
 * Deriva Urbana - InfinityFree
 */

// Configurações
define('DB_PATH', __DIR__ . '/../data/derivas.db');
define('DB_DIR', __DIR__ . '/../data/');

// Headers CORS (permitir acesso do frontend)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Função para inicializar o banco
function getDB() {
    static $db = null;
    
    if ($db === null) {
        // Criar diretório se não existir
        if (!is_dir(DB_DIR)) {
            if (!mkdir(DB_DIR, 0755, true)) {
                throw new Exception('Não foi possível criar o diretório de dados');
            }
        }
        
        // Abrir ou criar banco
        $db = new SQLite3(DB_PATH);
        $db->enableExceptions(true);
        
        // Criar tabelas se não existirem
        $db->exec('
            CREATE TABLE IF NOT EXISTS derivas (
                id TEXT PRIMARY KEY,
                data_inicio TEXT NOT NULL,
                data_fim TEXT,
                duracao INTEGER,
                local_inicio TEXT,
                local_fim TEXT,
                notas TEXT,
                humor INTEGER CHECK(humor >= 1 AND humor <= 5),
                clima TEXT,
                distancia REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');
        
        $db->exec('
            CREATE TABLE IF NOT EXISTS prompts_seguidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deriva_id TEXT NOT NULL,
                prompt_id INTEGER NOT NULL,
                prompt_text TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
            )
        ');
        
        $db->exec('
            CREATE TABLE IF NOT EXISTS descobertas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deriva_id TEXT NOT NULL,
                texto TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
            )
        ');
        
        $db->exec('
            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        ');
        
        // Inserir config padrão
        $db->exec("INSERT OR IGNORE INTO config (key, value) VALUES ('nomeDerivante', 'Derivante')");
        $db->exec("INSERT OR IGNORE INTO config (key, value) VALUES ('cidadeBase', '')");
        $db->exec("INSERT OR IGNORE INTO config (key, value) VALUES ('temaPreferido', '')");
    }
    
    return $db;
}

// Função helper para resposta JSON
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Função helper para erro
function jsonError($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}

// Função para obter input JSON
function getInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}
