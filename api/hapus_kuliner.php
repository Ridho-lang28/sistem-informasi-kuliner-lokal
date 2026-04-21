<?php
$conn = mysqli_connect("localhost","root","","db_kuliner");

$id = $_GET['id']; 
// ambil id

mysqli_query($conn,"DELETE FROM kuliner WHERE id=$id"); 
// hapus data berdasarkan id
?>