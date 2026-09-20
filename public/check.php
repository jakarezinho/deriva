<?php
/**
 * Script de verificação do ambiente
 * Acesse: http://seusite.com/check.php
 */

echo "<!DOCTYPE html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8'>
    <title>Verificação - Deriva Urbana</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; background: #0a0a0f; color: #e2e2e8; }
        h1 { color: #c084fc; }
        .ok { color: #34d399; }
        .error { color: #f87171; }
        .warn { color: #fbbf24; }
        .check { padding: 10px; margin: 10px 0; border-left: 3px solid; padding-left: 15px; }
        .check.ok { border-color: #34d399; }
        .check.error { border-color: #f87171; }
        .check.warn { border-color: #fbbf24; }
        code { background: #1e1e2e; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>◉ Verificação do Ambiente - Deriva Urbana</h1>
    <p>Este script verifica se o servidor está configurado corretamente.</p>
    <hr>
";

// Verificações
$checks = [];

// PHP Version
$phpVersion = phpversion();
$checks[] = [
    'title' => 'Versão do PHP',
    'status' => version_compare($phpVersion, '7.4.0', '>=') ? 'ok' : 'error',
    'message' => "PHP $phpVersion " . (version_compare($phpVersion, '7.4.0', '>=') ? '(OK)' : '(Requer 7.4+)')
];

// SQLite3
$checks[] = [
    'title' => 'Extensão SQLite3',
    'status' => extension_loaded('sqlite3') ? 'ok' : 'error',
    'message' => extension_loaded('sqlite3') ? 'SQLite3 habilitado' : 'SQLite3 NÃO encontrado'
];

// PDO SQLite
$checks[] = [
    'title' => 'PDO SQLite',
    'status' => extension_loaded('pdo_sqlite') ? 'ok' : 'warn',
    'message' => extension_loaded('pdo_sqlite') ? 'PDO SQLite disponível' : 'PDO SQLite não disponível (opcional)'
];

// Pasta data/
$dataDir = __DIR__ . '/data';
$dataExists = is_dir($dataDir);
$dataWritable = $dataExists && is_writable($dataDir);

$checks[] = [
    'title' => 'Diretório data/',
    'status' => $dataExists ? ($dataWritable ? 'ok' : 'error') : 'warn',
    'message' => $dataExists 
        ? ($dataWritable ? 'Existe e é writável' : 'Existe mas NÃO é writável (chmod 755)')
        : 'Não existe (será criado automaticamente)'
];

// Teste de criação de banco
try {
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    $testDb = new SQLite3($dataDir . '/test.db');
    $testDb->exec('CREATE TABLE test (id INTEGER)');
    $testDb->close();
    unlink($dataDir . '/test.db');
    
    $checks[] = [
        'title' => 'Criação de banco SQLite',
        'status' => 'ok',
        'message' => 'Banco de teste criado e deletado com sucesso'
    ];
} catch (Exception $e) {
    $checks[] = [
        'title' => 'Criação de banco SQLite',
        'status' => 'error',
        'message' => 'Falha: ' . $e->getMessage()
    ];
}

// JSON
$checks[] = [
    'title' => 'Extensão JSON',
    'status' => extension_loaded('json') ? 'ok' : 'error',
    'message' => extension_loaded('json') ? 'JSON habilitado' : 'JSON NÃO encontrado'
];

// API
$apiFile = __DIR__ . '/api/derivas.php';
$checks[] = [
    'title' => 'Arquivo da API',
    'status' => file_exists($apiFile) ? 'ok' : 'error',
    'message' => file_exists($apiFile) ? 'api/derivas.php encontrado' : 'api/derivas.php NÃO encontrado'
];

// Frontend
$indexFile = __DIR__ . '/index.html';
$checks[] = [
    'title' => 'Frontend',
    'status' => file_exists($indexFile) ? 'ok' : 'warn',
    'message' => file_exists($indexFile) ? 'index.html encontrado' : 'index.html NÃO encontrado (faça upload do build)'
];

// Exibir resultados
foreach ($checks as $check) {
    $class = $check['status'];
    $icon = $class === 'ok' ? '✓' : ($class === 'error' ? '✗' : '⚠');
    echo "<div class='check $class'>";
    echo "<strong>$icon {$check['title']}</strong><br>";
    echo "<small>{$check['message']}</small>";
    echo "</div>";
}

// Resumo
$errorCount = count(array_filter($checks, fn($c) => $c['status'] === 'error'));
$warnCount = count(array_filter($checks, fn($c) => $c['status'] === 'warn'));

echo "<hr><h2>Resumo</h2>";
if ($errorCount === 0) {
    echo "<p class='ok'><strong>✓ Tudo pronto!</strong> O servidor está configurado corretamente.</p>";
    if ($warnCount > 0) {
        echo "<p class='warn'>⚠ $warnCount aviso(s) - verifique acima.</p>";
    }
    echo "<p><a href='/'>→ Ir para a aplicação</a></p>";
} else {
    echo "<p class='error'><strong>✗ $errorCount erro(s) encontrado(s)</strong></p>";
    echo "<p>Corrija os erros acima antes de usar a aplicação.</p>";
}

echo "<hr>
<h3>Informações do Servidor</h3>
<ul>
    <li>Sistema: " . php_uname() . "</li>
    <li>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</li>
    <li>PHP SAPI: " . php_sapi_name() . "</li>
    <li>Memory Limit: " . ini_get('memory_limit') . "</li>
</ul>
</body>
</html>";
