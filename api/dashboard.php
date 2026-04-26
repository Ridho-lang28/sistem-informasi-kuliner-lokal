<?php
session_start();
if(!isset($_SESSION['login'])){
  header("Location: login.php");
  exit;
}

$conn = mysqli_connect("localhost","root","","db_kuliner");

// hitung data
$total = mysqli_query($conn,"SELECT COUNT(*) as total FROM kuliner");
$total = mysqli_fetch_assoc($total)['total'];

$murah = mysqli_query($conn,"SELECT COUNT(*) as murah FROM kuliner WHERE harga < 20000");
$murah = mysqli_fetch_assoc($murah)['murah'];

$mahal = mysqli_query($conn,"SELECT COUNT(*) as mahal FROM kuliner WHERE harga >= 20000");
$mahal = mysqli_fetch_assoc($mahal)['mahal'];

?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Dashboard Kuliner</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
body{
  background:#f5f6f8;
  font-family:Arial;
}
.navbar{
  background:#ff7f50;
}
.navbar-brand{
  color:white;
  font-weight:bold;
}
.card{
  border:none;
  box-shadow:0 5px 15px rgba(0,0,0,0.08);
}
</style>

</head>

<body>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg">
  <div class="container">
    <a class="navbar-brand">🍜 Dashboard Kuliner</a>

    <div>
      <a href="index.php" class="btn btn-light">Halaman Utama</a>
      <a href="logout.php" class="btn btn-outline-light">Logout</a>
    </div>
  </div>
</nav>

<!-- CONTENT -->
<div class="container mt-5">

<h3 class="mb-4">
  Selamat Datang 
  <?php echo ($_SESSION['role']=="admin") ? "Admin" : "User"; ?>
</h3>

<div class="row mb-4">

  <div class="col-md-4">
    <div class="card text-center p-3">
      <h5>🍽 Total Kuliner</h5>
      <h2><?php echo $total; ?></h2>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card text-center p-3">
      <h5>💸 Kuliner Murah</h5>
      <h2><?php echo $murah; ?></h2>
      <small>< 20rb</small>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card text-center p-3">
      <h5>💎 Kuliner Mahal</h5>
      <h2><?php echo $mahal; ?></h2>
      <small>>= 20rb</small>
    </div>
  </div>

</div>

<div class="row">

  <!-- TAMBAH -->
  <div class="col-md-4 mb-3">
    <div class="card p-4 text-center">
      <h4>➕</h4>
      <h5>Tambah Kuliner</h5>
      <p>Masukkan makanan baru</p>
      <a href="index.php?page=tambah" class="btn btn-primary">Buka</a>
    </div>
  </div>

  <!-- DAFTAR -->
  <div class="col-md-4 mb-3">
    <div class="card p-4 text-center">
      <h4>📋</h4>
      <h5>Daftar Kuliner</h5>
      <p>Lihat semua makanan</p>
      <a href="index.php?page=daftar" class="btn btn-primary">Lihat</a>
    </div>
  </div>

  <!-- ADMIN -->
  <?php if($_SESSION['role']=="admin"){ ?>
  <div class="col-md-4 mb-3">
    <div class="card p-4 text-center">
      <h4>⚙</h4>
      <h5>Admin Panel</h5>
      <p>Kelola data kuliner</p>
      <a href="index.php?page=admin" class="btn btn-primary">Kelola</a>
    </div>
  </div>
  <?php } ?>

</div>

</div>

</body>
</html>
