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

$validatedUsers = [];
foreach ($users as $user) {
    $userFields = [
        'id' => htmlspecialchars(intval($user['id'])) ?? null,
        'first_name' => htmlspecialchars(trim($user['first_name'])) ?? null,
        'last_name' => htmlspecialchars(trim($user['last_name'])) ?? null,
        'status' => (int)boolval(htmlspecialchars(trim($user['status']))) ?? null,
        'role' => htmlspecialchars(ucfirst(trim($user['role']))) ?? null,
    ];

    $emptyFieldsExist = false;
    foreach ($userFields as $key => $value) {
        if (empty(($value)) && $key != 'status')
            $emptyFieldsExist = true;
    }
    if (!$emptyFieldsExist) {
        $result = updateUser($userFields);
        if (!$result) {
            $response = [
                'status' => (bool)$result,
                'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null];
            echo json_encode($response);
            exit;
        }
        $validatedUsers[] = $userFields;
        $response = [
            'status' => (bool)$result,
            'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null,
            'user' => $result ? $users : null
        ];
    } else {
        $response = [
            'status' => false,
            'error' => ['code' => 100, 'message' => 'bad request']
        ];
        break;
    }

}


echo json_encode($response);