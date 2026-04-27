<?php
$host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com";
$user = "3KTgRBgr6VCy1bp.root"; // pastikan ini PERSIS dari TiDB
$pass = "vRQ5NOTe19BUt5vk";
$db   = "kuliner_app";
$port = 4000;

$conn = mysqli_init();

// WAJIB untuk TiDB
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

if (mysqli_connect_errno()) {
    die("ERROR: " . mysqli_connect_error());
}

echo "SUCCESS CONNECT";
?>
