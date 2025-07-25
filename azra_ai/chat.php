<?php
// Allow requests from the same domain
header('Content-Type: application/json');

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['messages'])) {
    echo json_encode(['error' => 'No messages provided']);
    exit;
}

// Your OpenRouter API key
$api_key = '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';

// Prepare request to OpenRouter
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://openrouter.ai/api/v1/chat/completions",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $api_key",
        "Content-Type: application/json",
        "HTTP-Referer: https://azra-ai.great-site.net", // your frontend URL
        "X-Title: Azra AI"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "model" => $input["model"] ?? "mistral/mistral-7b-instruct",
        "messages" => $input["messages"]
    ])
]);

$response = curl_exec($curl);
$error = curl_error($curl);
curl_close($curl);

if ($error) {
    echo json_encode(["error" => $error]);
} else {
    echo $response;
}
?>
