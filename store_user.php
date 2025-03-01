<?php
require_once 'functions.php';


$data = json_decode(file_get_contents('php://input'), true);
if (empty($data)) {
    $response = [
        'status' => false,
        'error' => ['code' => 100, 'message' => 'bad request'],
        'id' => null

    ];

    echo json_encode($response);
    exit;
}
$roles = getAllRoles();
$user = $data['user'];
$userFields = [
    'first_name' => htmlspecialchars(trim($user['first_name'])) ?? null,
    'last_name' => htmlspecialchars(trim($user['last_name'])) ?? null,
    'status' => ((int)boolval($user['status'])) ?? null,
    'role' => htmlspecialchars(trim($user['role'])) ?? null,
];

$emptyFieldsExist = false;
foreach ($userFields as $key => $value) {
    if (empty($value) && $key != 'status')
        $emptyFieldsExist = true;
}
if (!$emptyFieldsExist)
    $userId = storeUser($userFields);

$response = [
    'status' => (bool)$userId,
    'error' => !((bool)$userId) ? ['code' => 100, 'message' => 'user not created'] : null,
    'id' => $userId ?: null,
    'role' => ['id' => $userFields['role'], 'name' => $roles[$userFields['role']]],
];

echo json_encode($response);