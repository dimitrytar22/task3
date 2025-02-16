<?php

$host = 'localhost';
$dbname = 'task3';
$username = 'root';
$password = '';
try {
    $connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
}catch (Exception $exception){
    echo "Exception " . $exception->getMessage();
}