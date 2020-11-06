<?php

define('USER_ROLES', array('user', 'admin'));
define('USER_STATUSES', array(0, 1));

header('Content-Type: application/json');

// $mysqli = new mysqli('localhost', 'vasil', 'password', 'test');
$mysqli = new mysqli('sql2.freemysqlhosting.net', 'sql2374864', 'nA9%mT7*', 'sql2374864', 3306);
// $mysqli = new mysqli('remotemysql.com', 'IgWFoOAJN0', 'fMr42JWIrl', 'IgWFoOAJN0', 3306);

if (mysqli_connect_errno()) {
  printf("Connecting error: %s\n", mysqli_connect_error());
  exit();
}

$mysqli->query("CREATE TABLE IF NOT EXISTS sql2374864.users (id int not null primary key AUTO_INCREMENT, firstname VARCHAR(255) NOT NULL , lastname VARCHAR(255) NOT NULL , role VARCHAR(255) NOT NULL , status INT NOT NULL ) ENGINE = InnoDB;");

$_PUT;
$_DELETE;

try {
  $_PUT = $_DELETE = (array) json_decode(file_get_contents('php://input'));
} catch (Exception $e) { }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $results = $mysqli->query('SELECT * FROM users LIMIT 5');
  $rowsCount = $mysqli->query('SELECT COUNT(*) AS total_count FROM users');

  echo json_encode(array(
    'users' => ($results->fetch_all(MYSQLI_ASSOC)),
    'usersCount' => $rowsCount->fetch_assoc()["total_count"]
  ));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $firstname = trim($_POST['firstname']);
  $lastname = trim($_POST['lastname']);
  $role = ($_POST['role'] === 'admin') ? 'admin' : 'user';
  $status = (!$_POST['status']) ? 0 : 1;

  $sql = 'INSERT INTO users (firstname, lastname, role, status) VALUES(?, ?, ?, ?)';
  $stmt = $mysqli->prepare($sql);
  $stmt->bind_param('sssi', $firstname, $lastname, $role, $status);

  $stmt->execute();
  $stmt->close();

  echo json_encode([]);
}

if($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $firstname = trim($_PUT['firstname']);
  $lastname = trim($_PUT['lastname']);
  $role = trim($_PUT['role']);
  $status = (!$_PUT['status']) ? 0 : 1;
  $user_ids = (is_array($_PUT['id'])) ? $_PUT['id'] : [$_PUT['id']];

  // if (!in_array($role, USER_ROLES)) {
  //   http_response_code(400);
  //   echo json_encode(array('text' => "$role role is not defined!"));
  //   return;
  // }
  //
  // if (!in_array($status, USER_STATUSES)) {
  //   http_response_code(400);
  //   echo json_encode(array('text' => "$status status is not defined!"));
  //   return;
  // }

  $str_of_ids = implode(',', array_map('intval', $user_ids));

  if (!$lastname && !$role)
    $sql = "UPDATE users SET status=? WHERE id IN ($str_of_ids)";
  else
    $sql = "UPDATE users SET firstname=?, lastname=?, role=?, status=? WHERE id IN ($str_of_ids)";

  $stmt = $mysqli->prepare($sql);
  if (!$username && !$role)
    $stmt->bind_param('i', $status);
  else
    $stmt->bind_param('sssi', $firstname, $lastname, $role, $status);

  $stmt->execute();
  $stmt->close();

  http_response_code(200);
  echo json_encode(array());
}

if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $user_ids = (is_array($_DELETE['id'])) ? $_DELETE['id'] : [$_DELETE['id']];
  $str_of_ids = implode(',', array_map('intval', $user_ids));
  $mysqli->query("DELETE FROM users WHERE id IN ($str_of_ids)");

  http_response_code(200);
  echo json_encode(array());
}

$mysqli->close();

?>
