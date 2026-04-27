<?php
include "koneksi.php";

$id = $_GET['id']; // ambil id dari URL

// perintah ke database
mysqli_query($conn, "UPDATE kuliner SET status='approved' WHERE id='$id'");

// balik lagi
header("Location: ../admin.php");
?>
