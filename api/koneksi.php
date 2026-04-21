<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_kuliner";

$conn = mysqli_connect($host, $user, $pass, $db);
// koneksi ke database

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
// cek kalau koneksi gagal

mysqli_set_charset($conn, "utf8");
// biar support karakter utf8
?>