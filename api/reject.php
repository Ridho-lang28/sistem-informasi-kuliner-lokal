<?php
include "koneksi.php";

$nama = $_POST['nama_makanan'];
$kategori = $_POST['kategori'];
$lokasi = $_POST['lokasi'];
$harga = $_POST['harga'];
$deskripsi = $_POST['deskripsi'];
$rating = $_POST['rating'];

mysqli_query($conn,"INSERT INTO kuliner 
(nama_makanan,kategori,lokasi,harga,deskripsi,rating,status)
VALUES 
('$nama','$kategori','$lokasi','$harga','$deskripsi','$rating','pending')");

echo "OK";
?>
