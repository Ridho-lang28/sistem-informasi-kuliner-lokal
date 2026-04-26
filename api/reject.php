<?php
include "koneksi.php";

if(!isset($_GET['id'])){
  die("ID tidak ditemukan");
}

$id = intval($_GET['id']);

mysqli_query($conn,"UPDATE kuliner SET status='rejected' WHERE id=$id");

header("Location: /");
exit;
?>
