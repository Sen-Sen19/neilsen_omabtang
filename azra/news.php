<?php
$apiKey = '8ded73523a8245d0b5cd58c5f0430eef';
$url = "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=$apiKey";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Disable SSL verification for testing (enable in production!)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// Set a user agent to mimic a browser
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to fetch news', 'status' => $httpCode]);
    exit;
}

$data = json_decode($response, true);

if (!isset($data['articles'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from NewsAPI', 'debug' => $data]);
    exit;
}

$articles = array_map(function ($article) {
    return [
        'title' => $article['title'],
        'url' => $article['url']
    ];
}, $data['articles']);

header('Content-Type: application/json');
echo json_encode(['articles' => $articles]);
