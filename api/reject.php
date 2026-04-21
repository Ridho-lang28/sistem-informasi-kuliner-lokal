<?php
include "koneksi.php";

$id = $_GET['id'];
// ambil id

mysqli_query($conn,"UPDATE kuliner SET status='rejected' WHERE id='$id'"); 
// ubah status jadi ditolak

header("Location: index.php?page=admin"); 
// kembali ke admin
