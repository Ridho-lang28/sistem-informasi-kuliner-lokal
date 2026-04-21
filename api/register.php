<?php
include "koneksi.php";

if(isset($_POST['register'])){
  $email = $_POST['email'];
  $password = $_POST['password'];

  $cek = mysqli_query($conn,"SELECT * FROM users WHERE email='$email'");
  // cek apakah email sudah terdaftar atau belum di database

  if(mysqli_num_rows($cek) > 0){
    echo "<script>alert('Email sudah ada');</script>";
  } else {
    mysqli_query($conn,"INSERT INTO users (email,password,role) VALUES ('$email','$password','user')");
    // simpan data user baru ke database dengan role 'user'

    echo "<script>alert('Berhasil daftar'); window.location='login.php';</script>";
  }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Register</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center" style="height:100vh;">

<div class="container">
  <div class="col-md-4 mx-auto">
    <div class="card p-4 shadow">
      <h3 class="text-center mb-3">Register</h3>

      <form method="POST">
        <input type="email" name="email" class="form-control mb-2" placeholder="Email" required>
        <input type="password" name="password" class="form-control mb-2" placeholder="Password" required>
        <button class="btn btn-success w-100" name="register">Daftar</button>
      </form>
    </div>
  </div>
</div>

</body>
</html>
