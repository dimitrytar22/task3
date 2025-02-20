<?php
require_once 'functions.php';
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data)) {
    $response = [
        'status' => false,
        'error' => ['code' => 100, 'message' => 'bad request'],
        'user' => null

    ];

    echo json_encode($response);
    exit;
}

$response = [];
$users = $data['users'] ?? [$data];

foreach ($users as $user) {
    $userFields = [
        'id' => intval(htmlspecialchars($user['id'])) ?? null,
        'status' => (int)boolval(htmlspecialchars($user['status'])) ?? null,
    ];


    $result = updateUser($userFields);
    if (!$result) {
        $response = [
            'status' => (bool)$result,
            'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null,];
        echo json_encode($response);
        exit;
    } else {
        $response = [
            'status' => (bool)$result,
            'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null,
        ];
    }


}


echo json_encode($response);