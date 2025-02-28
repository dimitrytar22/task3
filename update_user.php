<?php
require_once 'functions.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data)) {
    echo json_encode([
        'status' => false,
        'error' => ['code' => 100, 'message' => 'Bad request'],
        'user' => null
    ]);
    exit;
}

$roles = getAllRoles();

$dataFields = [
    'id' => intval($data['id']),
    'first_name' => htmlspecialchars(trim($data['first_name'])),
    'last_name' => htmlspecialchars(trim($data['last_name'])),
    'status' => (int)boolval($data['status']),
    'role' => intval($data['role']),
];

$emptyFieldsExist = false;
foreach ($dataFields as $key => $value) {
    if (empty($value) && $key !== 'status') {
        $emptyFieldsExist = true;
        break;
    }
}

if ($emptyFieldsExist) {
    echo json_encode([
        'status' => false,
        'error' => ['code' => 100, 'message' => 'Bad request']
    ]);
    exit;
}

$result = updateUser($dataFields);
$dataFields['role'] = ['id' => $dataFields['role'], $roles, 'name' => $roles[$dataFields['role']]];;
echo json_encode([
    'status' => (bool)$result,
    'error' => !$result ? ['code' => 100, 'message' => 'User not updated'] : null,
    'user' => $result ? $dataFields : null
]);
