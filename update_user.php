<?php
require_once 'connection.php';
require_once 'functions.php';

$id = htmlspecialchars(trim($_POST['id']));
$firstName = htmlspecialchars(trim($_POST['first_name']));
$lastName = htmlspecialchars(trim($_POST['last_name']));
$status = htmlspecialchars(trim($_POST['status']));
$role = htmlspecialchars(ucfirst(trim($_POST['role'])));

$userFields = [
    'id' => $id,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'status' => ((int)boolval($status)),
    'role' => $role,
];
$result = updateUser($userFields);

$response = [
    'status' => (bool)$result,
    'error' => !((bool)$result) ? ['code' => 100, 'message' => 'not user found'] : null,
    'user' => $result ? $userFields : null

];

echo json_encode($response);