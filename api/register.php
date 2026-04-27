<?php
include "koneksi.php";

$email = $_POST['email'];
$password = $_POST['password'];

$cek = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");

if(mysqli_num_rows($cek) > 0){
  echo json_encode(["status" => "error", "msg" => "Email sudah ada"]);
} else {
  mysqli_query($conn, "INSERT INTO users (email,password,role) VALUES ('$email','$password','user')");
  echo json_encode(["status" => "success"]);
}
?>
