<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 🔥 disables certificate validation
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // 🔥 same here

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer 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",
    "HTTP-Referer: https://sen-sen19.github.io",
    "X-Title: Azra Memory"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
} else {
    http_response_code($http_status);
    echo $response;
}

curl_close($ch);
