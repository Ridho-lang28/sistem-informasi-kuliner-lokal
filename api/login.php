<?php
include "koneksi.php";

$email = $_POST['email'];
$password = $_POST['password'];

$data = mysqli_query($conn, "SELECT * FROM users WHERE email='$email' AND password='$password'");
$user = mysqli_fetch_assoc($data);

if($user){
  echo json_encode([
    "status" => "success",
    "email" => $user['email'],
    "role" => $user['role']
  ]);
} else {
  echo json_encode(["status" => "error"]);
}
?>
