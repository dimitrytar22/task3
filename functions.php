<?php
require_once 'connection.php';
function updateUser(array $arr)
{
    global $connection;
    $preparedUser = $connection->prepare('Select * from users where id = ?');
    $preparedUser->execute([$arr['id']]);
    if ($preparedUser->rowCount() <= 0)
        return false;

    $sql = "Update users set ";
    foreach ($arr as $key => $value) {
        $sql .= "$key = :$key,";
    }
    $sql = rtrim($sql, ',');
    $sql .= " where id = :id;";

    try {
        $prepared = $connection->prepare($sql);
        $prepared->execute($arr);

    } catch (Exception $exception) {
        return false;
    }
    return true;
}

function getAllUsers()
{
    global $connection;
    $users = [];
    $result = $connection->query("Select * from users;");
    while ($user = $result->fetch(PDO::FETCH_ASSOC)) {
        $user['role'] = ['id' => $user['role'], 'name' => getAllRoles()[$user['role']]];
        $users[] = $user;
    }
    return $users;
}

function getAllRoles()
{
    return [
        1 => 'Admin',
        2 => 'User'
    ];

}

function storeUser(array $arr)
{
    global $connection;

    $preparedUser = $connection->prepare('Insert into users(first_name, last_name,status,role) values(:first_name, :last_name, :status, :role)');
    try {
        $preparedUser->execute($arr);
    } catch (Exception $exception) {
        return false;
    }
    return $connection->lastInsertId();
}

function deleteUser($ids)
{
    global $connection;
    $idsInPrepared = 'in(';

    for ($i = 0; $i < count($ids); $i++) {
        $idsInPrepared .= '?,';
    }
    $idsInPrepared = rtrim($idsInPrepared, ',');
    $idsInPrepared .= ')';


    $prepared = $connection->prepare("Delete from users where id $idsInPrepared");
    try {
        $prepared->execute($ids);
    } catch (Exception $exception) {
        return false;
    }

    return $prepared->rowCount();
}

function allUsersExist(array $ids){
    global $connection;
    $sql = "select count(id) from users where id in(";


    foreach($ids as $id){
        $sql .= "?,";
    }
    $sql = rtrim($sql, ',');
    $sql .= ');';
    $prepared = $connection->prepare($sql);
    $prepared->execute($ids);
    return count($ids) == $prepared->fetchColumn();
}