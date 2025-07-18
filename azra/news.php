<?php
$apiKey = '8ded73523a8245d0b5cd58c5f0430eef';
$url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=$apiKey";

// SSL context (only for local dev, remove in production)
$context = stream_context_create([
  "ssl" => [
    "verify_peer" => false,
    "verify_peer_name" => false,
  ]
]);

$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch news']);
    exit;
}

$data = json_decode($response, true);

// Only keep title + url
$articles = array_map(function ($article) {
    return [
        'title' => $article['title'],
        'url' => $article['url']
    ];
}, $data['articles']);

header('Content-Type: application/json');
echo json_encode(['articles' => $articles]);
