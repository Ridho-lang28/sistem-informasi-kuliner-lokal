<?php
session_start();
include "koneksi.php";

if(isset($_POST['login'])){
  $email = $_POST['email'];
  $password = $_POST['password'];

  $data = mysqli_query($conn,"SELECT * FROM users WHERE email='$email' AND password='$password'");
  // cek di database ada user dengan email + password yang sama gak
  
  $user = mysqli_fetch_assoc($data);

  if($user){
    $_SESSION['login'] = true;
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    // simpan session untuk menandakan user sudah login dan menyimpan info email + role
    header("Location: index.php");
  } else {
    echo "<script>alert('Login gagal');</script>";
  }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center" style="height:100vh;">

<div class="container">
  <div class="col-md-4 mx-auto">
    <div class="card p-4 shadow">
      <h3 class="text-center mb-3">Login</h3>

      <form method="POST">
        <input type="email" name="email" class="form-control mb-2" placeholder="Email" required>
        <input type="password" name="password" class="form-control mb-2" placeholder="Password" required>
        <button class="btn btn-dark w-100" name="login">Login</button>
      </form>

      <p class="text-center mt-3">
        Belum punya akun? <a href="register.php">Daftar</a>
      </p>
    </div>
  </div>
</div>

</body>
</html>
