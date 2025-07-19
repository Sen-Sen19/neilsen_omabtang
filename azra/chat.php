<?php
// Load API key from config
if (file_exists('config.php')) {
    require_once 'config.php';
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Missing config.php. Please create one based on config.sample.php.']);
    exit;
}

// Optional: guard if sample key was used
if (OPENROUTER_API_KEY === 'your-api-key-goes-here') {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid API key. Please update config.php with your actual OpenRouter API key.']);
    exit;
}

// Read JSON body from client
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['messages']) || !isset($input['model'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request. Must include model and messages.']);
    exit;
}

// Prepare request
$payload = [
    "model" => $input["model"],
    "messages" => $input["messages"]
];

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . OPENROUTER_API_KEY
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

// SSL bypass for dev (remove in production)
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
} else {
    header("Content-Type: application/json");
    echo $response;
}

curl_close($ch);
?>
