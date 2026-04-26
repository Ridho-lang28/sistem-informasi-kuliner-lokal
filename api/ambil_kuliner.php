<?php
header('Content-Type: application/json');
include "koneksi.php";

$data = mysqli_query($conn,"SELECT * FROM kuliner");

$result = [];

while($row = mysqli_fetch_assoc($data)){
  $result[] = $row;
}

echo json_encode($result);
?>
