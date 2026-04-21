<?php
session_start();

session_destroy(); 
// hapus semua session

header("Location: login.php"); 
// kembali ke login
exit;
?>