<?php
include "koneksi.php";

$data = mysqli_query($conn,"SELECT * FROM kuliner WHERE status='pending'");

$result = [];

while($row = mysqli_fetch_assoc($data)){
  $result[] = $row;
}

echo json_encode($result);
?>
