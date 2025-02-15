<?php
require_once 'connection.php';
require_once 'functions.php';

$userFields = [
    'id' => htmlspecialchars(trim($_POST['id'])),
    'first_name' => htmlspecialchars(trim($_POST['first_name'])),
    'last_name' => htmlspecialchars(trim($_POST['last_name'])),
    'status' => ((int)boolval(htmlspecialchars(trim($_POST['status'])))),
    'role' => htmlspecialchars(ucfirst(trim($_POST['role']))),
];


$emptyFieldsExist = false;
foreach ($userFields as $key => $value) {
    if(empty(($value)))
        $emptyFieldsExist = true;
}
if (!$emptyFieldsExist)
    $result = updateUser($userFields);

$response = [
    'status' => (bool)$result,
    'error' => !((bool)$result) ? ['code' => 100, 'message' => 'not user found'] : null,
    'user' => $result ? $userFields : null

];

echo json_encode($response);