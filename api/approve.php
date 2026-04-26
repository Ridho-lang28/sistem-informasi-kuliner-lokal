<?php
include "koneksi.php";

$id = $_GET['id']; 
// ambil id dari URL

mysqli_query($conn,"UPDATE kuliner SET status='approved' WHERE id='$id'"); 
// ubah status jadi approved

header("Location: index.php?page=admin"); 
// redirect balik ke halaman admin<?php
include "koneksi.php";

if(!isset($_GET['id'])){
  die("ID tidak ditemukan");
}

$id = intval($_GET['id']);

mysqli_query($conn,"UPDATE kuliner SET status='approved' WHERE id=$id");

header("Location: /");
exit;
?>
