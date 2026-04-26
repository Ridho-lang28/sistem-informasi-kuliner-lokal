<?php
$host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com";
$user = "3KTgRBgr6VCylbp.root";
$pass = "ns5fTU2zrgVgdkvg";
$db   = "KulinerLokal";
$port = 4000;

$conn = mysqli_init();

// WAJIB untuk TiDB (SSL)
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);

mysqli_real_connect(
    $conn,
    $host,
    $user,
    $pass,
    $db,
    $port,
    NULL,
    MYSQLI_CLIENT_SSL
);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8");
?>
