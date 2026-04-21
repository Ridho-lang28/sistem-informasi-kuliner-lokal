<?php
session_start();

$page = isset($_GET['page']) ? $_GET['page'] : 'home';
// routing halaman (home, daftar, dashboard, dll)
include "koneksi.php";

// proteksi halaman
if($page=="tambah" && !isset($_SESSION['login'])){
  header("Location: login.php");
  exit;
}
// kalau belum login, ga boleh tambah kuliner biar aman dari orang iseng yang langsung akses URL

if($page=="admin" && (!isset($_SESSION['role']) || $_SESSION['role']!="admin")){
  header("Location: index.php");
  exit;
}
// kalau bukan admin, ga boleh akses halaman admin panel
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kuliner Lokal</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand fw-bold" href="?page=home">🍜 Kuliner Lokal</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav ms-auto">

        <li class="nav-item"><a class="nav-link" href="?page=home">Beranda</a></li>
        <li class="nav-item"><a class="nav-link" href="?page=daftar">Kuliner</a></li>
        <li class="nav-item"><a class="nav-link" href="?page=dashboard">Dashboard</a></li>

        <?php if(isset($_SESSION['login'])){ ?>
        <li class="nav-item"><a class="nav-link" href="?page=tambah">Tambah</a></li>
        <?php } ?>

        <?php if(isset($_SESSION['role']) && $_SESSION['role']=="admin"){ ?>
        <li class="nav-item"><a class="nav-link" href="?page=admin">Admin</a></li>
        <?php } ?>

        <?php if(!isset($_SESSION['login'])){ ?>
          <li class="nav-item"><a class="nav-link" href="login.php">Login</a></li>
        <?php } else { ?>
          <li class="nav-item"><a class="nav-link text-danger" href="logout.php">Logout</a></li>
        <?php } ?>

      </ul>
    </div>
  </div>
</nav>

<!-- BERANDA -->
<?php if($page=="home"){ ?>
<div class="container mt-5">
  <div class="p-5 text-center bg-white shadow rounded">
    <h1 class="fw-bold">🍔 Jelajah Kuliner Lokal</h1>
    <p>Temukan makanan enak di daerahmu 😋</p>
    <a href="?page=daftar" class="btn btn-dark">Lihat Kuliner</a>
  </div>
</div>
<?php } ?>

<!-- TAMBAH -->
<?php if($page=="tambah"){ ?>
<div class="container mt-5">
  <div class="card shadow p-4">
    <h3>Tambah Kuliner</h3>

    <form action="simpan_kuliner.php" method="POST">
      <input name="nama_makanan" class="form-control mb-2" placeholder="Nama Makanan" required>
      <input name="kategori" class="form-control mb-2" placeholder="Kategori">
      <input name="lokasi" class="form-control mb-2" placeholder="Lokasi">
      <input name="harga" type="number" class="form-control mb-2" placeholder="Harga">
      <textarea name="deskripsi" class="form-control mb-2"></textarea>
      <input name="rating" type="number" class="form-control mb-2" placeholder="Rating (1-5)">
      <button class="btn btn-success w-100">Simpan</button>
    </form>
  </div>
</div>
<?php } ?>

<!-- DAFTAR -->
<?php if($page=="daftar"){ ?>
<div class="container mt-5">
  <h3 class="mb-4">🍽 Daftar Kuliner</h3>

  <div class="row">
  <?php
  $data = mysqli_query($conn,"SELECT * FROM kuliner WHERE status='approved' ORDER BY id DESC");
  // hanya menampilkan kuliner yang sudah di approve admin saja
  while($d = mysqli_fetch_array($data)){
  ?>
    <div class="col-md-4 mb-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="fw-bold"><?= $d['nama_makanan']; ?></h5>
          <p class="text-muted"><?= $d['kategori']; ?></p>
          <p><?= $d['deskripsi']; ?></p>
          <p>📍 <?= $d['lokasi']; ?></p>
          <p>💰 Rp<?= $d['harga']; ?></p>
          <p>⭐ <?= $d['rating'] ? $d['rating'] : 0 ?>/5</p>
        </div>
      </div>
    </div>
  <?php } ?>
  </div>
</div>
<?php } ?>

<!-- DASHBOARD -->
<?php if($page=="dashboard"){ ?>
<div class="container mt-5">

  <h3 class="mb-1">📊 Dashboard Statistik Kuliner (Data BPS)</h3>
  <p class="text-muted mb-4">
    Grafik ini menampilkan <b>Top 10 daerah dengan pengeluaran per kapita tertinggi</b> 
    di Indonesia (data resmi BPS).
  </p>

  <div class="card shadow p-4" style="height:500px;">
    
    <div class="mb-3 text-end">
      <small class="text-muted">Sumber: BPS | Update otomatis dari API</small>
    </div>

    <canvas id="chartKuliner"></canvas>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

<script>
fetch('data_pengeluaran.php')
.then(res => res.json())
.then(res => {

    let labels = [];
    let values = [];

    let data = res.datacontent;
    let wilayah = res.vervar;

    if(!data || !wilayah){
        alert("Data API error");
        return;
    }

    let entries = Object.entries(data);

    entries.sort((a, b) => b[1] - a[1]);
    // urutkan data dari yang terbesar ke terkecil berdasarkan value (pengeluaran per kapita)

    entries = entries.slice(0, 10).reverse();
    // mengambil 10 data teratas, lalu dibalik supaya yang terbesar di bawah (karena grafik horizontal)

    entries.forEach(([key, value]) => {

        let namaWilayah = key;

        wilayah.forEach(w => {
            if(key.includes(w.val)){
                namaWilayah = w.label;
            }
        });
        // mapping kode wilayah ke nama wilayah yang lebih mudah dimengerti (misal ID-JK jadi DKI Jakarta)

        labels.push(namaWilayah);
        values.push(parseFloat(value));
    });

    new Chart(document.getElementById("chartKuliner"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Pengeluaran per Kapita (Rp)",
                data: values,
                borderRadius: 8,
                barThickness: 18,
                backgroundColor: [
                  '#0d6efd','#198754','#ffc107','#dc3545','#6f42c1',
                  '#20c997','#fd7e14','#0dcaf0','#adb5bd','#343a40'
                ]
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            indexAxis: 'y', // yang membuat grafik horizontal
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 1200
            },

            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 30
                }
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(ctx){
                            return "Rp " + ctx.raw.toLocaleString();
                        }
                    }
                },

                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    color: '#000',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value){
                        return "Rp " + value.toLocaleString();
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        callback: function(value){
                            return "Rp " + value.toLocaleString();
                        }
                    }
                },

                y: {
                    ticks: {
                        autoSkip: false,
                        font: {
                            size: 13
                        }
                    }
                }
            }
        }
    });

})
.catch(err => {
    console.error(err);
    alert("Gagal ambil data API");
});
</script>


<?php } ?>




<!-- ADMIN -->
<?php if($page=="admin"){ ?>
<div class="container mt-5">
  <h3>Admin Panel</h3>

  <table class="table table-bordered bg-white">
    <tr>
      <th>Nama</th>
      <th>Kategori</th>
      <th>Lokasi</th>
      <th>Harga</th>
      <th>Rating</th>
      <th>Status</th>
      <th>Aksi</th>
    </tr>

<?php
$data = mysqli_query($conn, "SELECT * FROM kuliner ORDER BY id DESC");
while($d = mysqli_fetch_array($data)){
?>

<tr>
  <td><?= $d['nama_makanan'] ?></td>
  <td><?= $d['kategori'] ?></td>
  <td><?= $d['lokasi'] ?></td>
  <td><?= $d['harga'] ?></td>
  <td><?= $d['rating'] ?></td>
  <td>
    <?php if($d['status']=="pending"){ ?>
      <span class="badge bg-warning">Pending</span>
    <?php } elseif($d['status']=="approved"){ ?>
      <span class="badge bg-success">Approved</span>
    <?php } else { ?>
      <span class="badge bg-danger">Rejected</span>
    <?php } ?>
  </td>

  <td>
    <?php if($d['status']=="pending"){ ?>
      <a href="approve.php?id=<?= $d['id'] ?>" class="btn btn-success btn-sm">ACC</a>
      <a href="reject.php?id=<?= $d['id'] ?>" class="btn btn-warning btn-sm">Tolak</a>
    <?php } ?>

    <a href="hapus_kuliner.php?id=<?= $d['id'] ?>" 
       class="btn btn-danger btn-sm"
       onclick="return confirm('Yakin hapus data?')">
       Hapus
    </a>
  </td>

</tr>

<?php } ?>
  </table>
</div>
<?php } ?>

<!-- JS BOOTSTRAP (WAJIB DI BAWAH) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
