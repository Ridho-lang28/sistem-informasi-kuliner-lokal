<?php
$conn = mysqli_connect("localhost","root","","db_kuliner"); 
// koneksi ke database

$data = mysqli_query($conn,"SELECT * FROM kuliner"); 
// ambil semua data dari tabel kuliner

$result = [];

while($row = mysqli_fetch_assoc($data)){
  $result[] = $row; 
  // setiap baris dimasukin ke array
}

echo json_encode($result); 
// kirim data dalam bentuk JSON (dipakai JS / frontend)
?>
