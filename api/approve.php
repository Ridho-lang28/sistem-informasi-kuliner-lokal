<?php
include "koneksi.php";

$id = $_GET['id']; 
// ambil id dari URL

mysqli_query($conn,"UPDATE kuliner SET status='approved' WHERE id='$id'"); 
// ubah status jadi approved

header("Location: index.php?page=admin"); 
// redirect balik ke halaman admin