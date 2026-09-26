<?php
/**
 * Configuração do banco de dados SQLite
 * Deriva Urbana v2.0 - Sistema de Descobertas
 */

// Configurações
define('DB_PATH', __DIR__ . '/../data/derivas.db');
define('DB_DIR', __DIR__ . '/../data/');
define('FOTOS_DIR', __DIR__ . '/../data/fotos/');
define('FOTOS_ORIGINAL_DIR', __DIR__ . '/../data/fotos/original/');
define('FOTOS_THUMB_DIR', __DIR__ . '/../data/fotos/thumb/');

// Headers CORS
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
        // Criar diretórios se não existirem
        if (!is_dir(DB_DIR)) {
            mkdir(DB_DIR, 0755, true);
        }
        if (!is_dir(FOTOS_ORIGINAL_DIR)) {
            mkdir(FOTOS_ORIGINAL_DIR, 0755, true);
        }
        if (!is_dir(FOTOS_THUMB_DIR)) {
            mkdir(FOTOS_THUMB_DIR, 0755, true);
        }
        
        // Abrir ou criar banco
        $db = new SQLite3(DB_PATH);
        $db->enableExceptions(true);
        
        // Criar tabelas se não existirem
        $db->exec('
            CREATE TABLE IF NOT EXISTS derivas (
                id TEXT PRIMARY KEY,
                titulo TEXT,
                data_criacao TEXT NOT NULL,
                estado TEXT DEFAULT "ativa",
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');
        
        $db->exec('
            CREATE TABLE IF NOT EXISTS descobertas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deriva_id TEXT NOT NULL,
                notas TEXT,
                latitude REAL,
                longitude REAL,
                foto_path TEXT,
                foto_thumb_path TEXT,
                orientacao INTEGER DEFAULT 0,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (deriva_id) REFERENCES derivas(id) ON DELETE CASCADE
            )
        ');
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

// Função para gerar ID único
function generateId() {
    return bin2hex(random_bytes(8));
}
