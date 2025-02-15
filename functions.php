<?php
require_once 'connection.php';
function updateUser(array $arr){
    global $connection;
    $preparedUser = $connection->prepare('Select * from users where id = ?');
    $preparedUser->execute([$arr['id']]);
    if($preparedUser->rowCount() <= 0)
        return false;

    $prepared = $connection->prepare("
    Update users set first_name = :first_name, last_name = :last_name, status = :status, role = :role where id = :id");
    $prepared->execute($arr);
    return $prepared->errorCode();
}

function getAllUsers(){
    global $connection;
    $users = [];
    $result = $connection->query("Select * from users;");
    while($user = $result->fetch(PDO::FETCH_ASSOC)){
        $users[] = $user;
    }
    return $users;
}