<?php
/**
 * API de Upload de Fotos
 * Recebe foto via FormData, processa (compressão + orientação EXIF)
 * e guarda no servidor
 */

require_once __DIR__ . '/config.php';

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Método não permitido', 405);
}

try {
    $db = getDB();
} catch (Exception $e) {
    jsonError('Erro ao conectar ao banco: ' . $e->getMessage(), 500);
}

// Verificar se há ficheiro
if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    jsonError('Ficheiro não enviado ou erro no upload');
}

$foto = $_FILES['foto'];

// Validar tipo MIME
$tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $foto['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $tiposPermitidos)) {
    jsonError('Tipo de imagem não permitido. Use JPEG, PNG ou WebP.');
}

// Validar tamanho máximo (20MB)
if ($foto['size'] > 20 * 1024 * 1024) {
    jsonError('Imagem muito grande. Máximo 20MB.');
}

// Gerar nome único
$extensao = pathinfo($foto['name'], PATHINFO_EXTENSION);
if (empty($extensao) || !in_array(strtolower($extensao), ['jpg', 'jpeg', 'png', 'webp'])) {
    $extensao = 'jpg';
}
$nomeBase = generateId();
$nomeOriginal = $nomeBase . '.' . $extensao;
$nomeThumb = $nomeBase . '_thumb.' . $extensao;

$caminhoOriginal = FOTOS_ORIGINAL_DIR . $nomeOriginal;
$caminhoThumb = FOTOS_THUMB_DIR . $nomeThumb;

// Processar imagem
try {
    // Ler imagem
    $imagemOriginal = null;
    switch ($mime) {
        case 'image/jpeg':
            $imagemOriginal = imagecreatefromjpeg($foto['tmp_name']);
            break;
        case 'image/png':
            $imagemOriginal = imagecreatefrompng($foto['tmp_name']);
            break;
        case 'image/webp':
            $imagemOriginal = imagecreatefromwebp($foto['tmp_name']);
            break;
    }
    
    if (!$imagemOriginal) {
        jsonError('Erro ao processar imagem');
    }
    
    // Ler orientação EXIF (apenas para JPEG)
    $orientacao = 0;
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($foto['tmp_name']);
        if ($exif && isset($exif['Orientation'])) {
            switch ($exif['Orientation']) {
                case 3:
                    $orientacao = 180;
                    break;
                case 6:
                    $orientacao = 90;
                    break;
                case 8:
                    $orientacao = 270;
                    break;
            }
        }
    }
    
    // Rotacionar imagem se necessário
    if ($orientacao !== 0) {
        $imagemOriginal = imagerotate($imagemOriginal, -$orientacao, 0);
    }
    
    // Obter dimensões originais
    $larguraOriginal = imagesx($imagemOriginal);
    $alturaOriginal = imagesy($imagemOriginal);
    
    // Calcular fator de compressão adaptativo
    $tamanhoBytes = $foto['size'];
    if ($tamanhoBytes > 5 * 1024 * 1024) {
        // >5MB: comprimir para 50%
        $fator = 0.5;
    } elseif ($tamanhoBytes > 2 * 1024 * 1024) {
        // >2MB: comprimir para 65%
        $fator = 0.65;
    } elseif ($tamanhoBytes > 1 * 1024 * 1024) {
        // >1MB: comprimir para 80%
        $fator = 0.8;
    } else {
        // <1MB: sem compressão
        $fator = 1.0;
    }
    
    // Guardar imagem original (com orientação corrigida)
    switch ($mime) {
        case 'image/jpeg':
            imagejpeg($imagemOriginal, $caminhoOriginal, 90);
            break;
        case 'image/png':
            imagepng($imagemOriginal, $caminhoOriginal, 9);
            break;
        case 'image/webp':
            imagewebp($imagemOriginal, $caminhoOriginal, 90);
            break;
    }
    
    // Criar miniatura (200x200px, crop central)
    $tamanhoThumb = 200;
    $imagemThumb = imagecreatetruecolor($tamanhoThumb, $tamanhoThumb);
    
    // Calcular crop central
    $lado = min($larguraOriginal, $alturaOriginal);
    $xInicio = ($larguraOriginal - $lado) / 2;
    $yInicio = ($alturaOriginal - $lado) / 2;
    
    imagecopyresampled(
        $imagemThumb,
        $imagemOriginal,
        0, 0,
        $xInicio, $yInicio,
        $tamanhoThumb, $tamanhoThumb,
        $lado, $lado
    );
    
    // Guardar miniatura
    switch ($mime) {
        case 'image/jpeg':
            imagejpeg($imagemThumb, $caminhoThumb, 85);
            break;
        case 'image/png':
            imagepng($imagemThumb, $caminhoThumb, 9);
            break;
        case 'image/webp':
            imagewebp($imagemThumb, $caminhoThumb, 85);
            break;
    }
    
    // Libertar memória
    imagedestroy($imagemOriginal);
    imagedestroy($imagemThumb);
    
    // Resposta com caminhos relativos
    jsonResponse([
        'success' => true,
        'foto_path' => 'data/fotos/original/' . $nomeOriginal,
        'foto_thumb_path' => 'data/fotos/thumb/' . $nomeThumb,
        'orientacao' => $orientacao,
        'largura' => $larguraOriginal,
        'altura' => $alturaOriginal,
        'fator_compressao' => $fator
    ]);
    
} catch (Exception $e) {
    jsonError('Erro ao processar imagem: ' . $e->getMessage(), 500);
}
