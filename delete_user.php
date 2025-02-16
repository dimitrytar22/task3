<?php
require_once 'functions.php';

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data)) {
    $response = [
        'status' => false,
        'error' => ['code' => 100, 'message' => 'bad request'],
    ];
    echo json_encode($response);
    exit;
}

$ids = validateIds($data['user_ids']);

if (!empty($ids))
    $result = deleteUser($ids);

$response = [
    'status' => (bool)$result,
    'error' => !((bool)$result) ? ['code' => 100, 'message' => 'user not found'] : null,
];


echo json_encode($response);


function validateIds($ids)
{
    return array_values(array_map(function ($item) {
        return htmlspecialchars($item);
    }, array_filter($ids, function ($elem) {
        return !empty($elem);
    })));
}