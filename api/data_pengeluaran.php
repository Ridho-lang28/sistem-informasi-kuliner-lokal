<?php
header('Content-Type: application/json');

$url = "https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/461/th/125/key/7c4724dde5345ab992bc3dd352b5647d";
// URL API BPS

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
curl_close($ch);

echo $response; 
// langsung kirim data API ke frontend (Chart.js)
?>
