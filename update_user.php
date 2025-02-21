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
$roles = getAllRoles();

$dataFields = [
    'id' => intval(htmlspecialchars($data['id'])) ?? null,
    'first_name' => htmlspecialchars(trim($data['first_name'])) ?? null,
    'last_name' => htmlspecialchars(trim($data['last_name'])) ?? null,
    'status' => (int)boolval(htmlspecialchars($data['status'])) ?? null,
    'role' => intval(htmlspecialchars($data['role'])) ?? null,
];

$emptyFieldsExist = false;
foreach ($dataFields as $key => $value) {
    if (empty(($value)) && $key != 'status')
        $emptyFieldsExist = true;
}
if (!$emptyFieldsExist) {
    $result = updateUser($dataFields);
    if (!$result) {
        $response = [
            'status' => (bool)$result,
            'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null,
            'user' => null];
        echo json_encode($response);
        exit;
    }


    $response = [
        'status' => (bool)$result,
        'error' => !$result ? ['code' => 100, 'message' => 'not user found'] : null,
        'user' => $result ? $dataFields : null
    ];
} else {
    $response = [
        'status' => false,
        'error' => ['code' => 100, 'message' => 'bad request']
    ];

}


echo json_encode($response);