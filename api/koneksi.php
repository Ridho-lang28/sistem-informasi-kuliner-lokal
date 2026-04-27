<?php
$host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com";
$user = "3KTgRBgr6VCy1bp.root";
$pass = "vRQ5NOTe19BUt5vk";
$db   = "kuliner_app";
$port = 4000;

$conn = mysqli_init();

// SSL (wajib TiDB)
mysqli_options($conn, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, false);
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

// cek koneksi
if (mysqli_connect_errno()) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// 🔥 PAKSA PILIH DATABASE (ini yang sering bikin error)
mysqli_select_db($conn, $db);

// debug (optional)
if (!$conn) {
    die("DB belum terhubung");
}
?>
