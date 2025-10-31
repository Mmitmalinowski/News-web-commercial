<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$archiveDir = '../archives';
$archives = [];

if (is_dir($archiveDir)) {
    $files = scandir($archiveDir);
    
    foreach ($files as $file) {
        if (preg_match('/^articles-(\d{4}-\d{2})\.json$/', $file, $matches)) {
            $monthKey = $matches[1];
            $filePath = $archiveDir . '/' . $file;
            
            $archives[] = [
                'month' => $monthKey,
                'filename' => $file,
                'size' => filesize($filePath),
                'modified' => date('c', filemtime($filePath))
            ];
        }
    }
}

// Sortuj od najnowszych
usort($archives, function($a, $b) {
    return strcmp($b['month'], $a['month']);
});

echo json_encode($archives, JSON_PRETTY_PRINT);
?>