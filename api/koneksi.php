<?php
$host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com";
$user = "3KTgRBgr6VCylbp.root";
$pass = "ns5fTU2zrgVgdkvg";
$db   = "KulinerLokal";
$port = 4000;

$conn = mysqli_init();

// WAJIB: disable SSL verify (biar jalan di Vercel)
mysqli_options($conn, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, false);

// WAJIB: aktifkan SSL
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);

// connect
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

// cek error
if (mysqli_connect_errno()) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// charset
mysqli_set_charset($conn, "utf8");
?>
