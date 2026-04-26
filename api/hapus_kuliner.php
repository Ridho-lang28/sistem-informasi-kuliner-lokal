<?php
include "koneksi.php";

if(!isset($_GET['id'])){
  die("ID tidak ditemukan");
}

$id = intval($_GET['id']);

mysqli_query($conn,"DELETE FROM kuliner WHERE id=$id");

echo "OK";
?>
