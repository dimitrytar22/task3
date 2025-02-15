<?php
require_once 'functions.php';

$userFields = [
    'first_name' => htmlspecialchars(trim($_POST['first_name'])),
    'last_name' => htmlspecialchars(trim($_POST['last_name'])),
    'status' => ((int)boolval(htmlspecialchars(trim($_POST['status'])))),
    'role' => htmlspecialchars(ucfirst(trim($_POST['role']))),
];


$emptyFieldsExist = false;
foreach ($userFields as $key => $value) {
    if(empty($value))
        $emptyFieldsExist = true;
}
if (!$emptyFieldsExist)
    $userId = storeUser($userFields);

$response = [
    'status' => (bool)$userId,
    'error' => !((bool)$userId) ? ['code' => 100, 'message' => 'user not created'] : null,
    'id' => $userId ? $userId : null,
];

echo json_encode($response);