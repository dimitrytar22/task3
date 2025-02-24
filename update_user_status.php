<?php
require_once 'functions.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data)) {
    echo json_encode([
        'status' => false,
        'error' => ['code' => 100, 'message' => 'Bad request']
    ]);
    exit;
}

$users = $data['users'] ?? [$data];
$userIds = array_column($users, 'id');

if (!allUsersExist($userIds)) {
    echo json_encode([
        'status' => false,
        'error' => ['code' => 100, 'message' => count($users) > 1 ? 'Users not updated' : 'User not updated']
    ]);
    exit;
}

$updated = false;

foreach ($users as $user) {
    $userFields = [
        'id' => intval($user['id']),
        'status' => (int)boolval($user['status']),
    ];

    if (updateUser($userFields)) {
        $updated = true;
    }
}

echo json_encode([
    'status' => $updated,
    'error' => $updated ? null : ['code' => 100, 'message' => count($users) > 1 ? 'Users not updated' : 'User not updated']
]);
