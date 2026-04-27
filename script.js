// ================= LOAD =================
document.addEventListener("DOMContentLoaded", function(){
  console.log("App Ready");
  renderMenu();

  const page = getPageFromURL();
  showPage(page);
});

// ================= URL =================
function getPageFromURL(){
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || "home";
}

// ================= AUTH =================
function isLogin(){
  return localStorage.getItem("user") !== null;
}

function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

function getRole(){
  let user = getUser();
  return user ? user.role : null;
}

function logout(){
  localStorage.removeItem("user");
  alert("Logout berhasil");
  renderMenu();
  showPage("home");
}

// ================= MENU =================
function renderMenu(){
  let role = getRole();
  let menu = document.getElementById("menuList");

  let html = `
    <li><a class="dropdown-item" onclick="showPage('home')">Beranda</a></li>
    <li><a class="dropdown-item" onclick="showPage('daftar')">Kuliner</a></li>
    <li><a class="dropdown-item" onclick="showPage('tambah')">Tambah Kuliner</a></li>
  `;

  if(role === "admin"){
    html += `
      <li><a class="dropdown-item" onclick="showPage('dashboard')">Dashboard</a></li>
      <li><a class="dropdown-item" onclick="showPage('admin')">Panel Admin</a></li>
    `;
  }

  if(isLogin()){
    html += `<li><a class="dropdown-item text-danger" onclick="logout()">Logout</a></li>`;
  } else {
    html += `
      <li><a class="dropdown-item" onclick="showPage('login')">Login</a></li>
      <li><a class="dropdown-item" onclick="showPage('register')">Daftar</a></li>
    `;
  }

  menu.innerHTML = html;
}

// ================= LOGIN =================
function login(){
  let formData = new FormData();
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);

  fetch("api/login.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(res => {
    if(res.status === "success"){
      localStorage.setItem("user", JSON.stringify(res));
      alert("Login berhasil");
      renderMenu();
      showPage("home");
    } else {
      alert("Login gagal");
    }
  })
  .catch(err => {
    console.error(err);
    alert("❌ Error login");
  });
}

// ================= REGISTER =================
function register(){
  let formData = new FormData();
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);

  fetch("api/register.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(res => {
    if(res.status === "success"){
      alert("Berhasil daftar");
      showPage("login");
    } else {
      alert(res.msg);
    }
  })
  .catch(err => {
    console.error(err);
    alert("❌ Error register");
  });
}

// ================= FORM TAMBAH =================
function attachForm(){
  let form = document.getElementById("formKuliner");

  if(!form) return;

  if(!isLogin()){
    alert("Harus login dulu!");
    showPage("login");
    return;
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();

    let formData = new FormData();
    formData.append("nama_makanan", document.getElementById("nama_makanan").value);
    formData.append("kategori", document.getElementById("kategori").value);
    formData.append("lokasi", document.getElementById("lokasi").value);
    formData.append("harga", document.getElementById("harga").value);
    formData.append("deskripsi", document.getElementById("deskripsi").value);
    formData.append("rating", document.getElementById("rating").value);

    fetch("api/simpan_kuliner.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(() => {
      alert("✅ Data masuk (menunggu approval admin)");
      showPage("home");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Gagal simpan data");
    });
  });
}

// ================= LOAD DATA =================
function loadKuliner(){
  let container = document.getElementById("kulinerContainer");
  if(!container) return;

  container.innerHTML = "<p>Loading...</p>";

  fetch("api/ambil_kuliner.php")
  .then(res => res.json())
  .then(data => {

    container.innerHTML = "";

    if(data.length === 0){
      container.innerHTML = "<p>Tidak ada data</p>";
      return;
    }

    data.forEach(k => {
      container.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card p-3 shadow-sm">
            <h5>${k.nama_makanan}</h5>
            <p>${k.kategori} - ${k.lokasi}</p>
            <p>Rp ${k.harga}</p>
            <p>${k.deskripsi}</p>
            <p>⭐ ${k.rating}</p>
          </div>
        </div>
      `;
    });

  })
  .catch(() => {
    container.innerHTML = "<p>❌ Gagal load</p>";
  });
}

// ================= ADMIN =================
function loadAdmin(){
  fetch("api/ambil_pending.php")
  .then(res => res.json())
  .then(data => {

    let html = "";

    if(data.length === 0){
      html = "<p>Tidak ada data pending</p>";
    }

    data.forEach(k => {
      html += `
        <div class="border p-2 mb-2 rounded">
          <b>${k.nama_makanan}</b><br>
          ${k.kategori} - ${k.lokasi}

          <div class="mt-2">
            <button class="btn btn-success btn-sm" onclick="approve(${k.id})">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="reject(${k.id})">Reject</button>
          </div>
        </div>
      `;
    });

    document.getElementById("adminList").innerHTML = html;
  });
}

function approve(id){
  fetch("api/approve.php?id=" + id)
  .then(() => {
    alert("Approved!");
    loadAdmin();
  });
}

function reject(id){
  fetch("api/reject.php?id=" + id)
  .then(() => {
    alert("Rejected!");
    loadAdmin();
  });
}

// ================= DASHBOARD =================
function loadChart(){
  fetch("api/ambil_kuliner.php")
  .then(res => res.json())
  .then(data => {

    let labels = data.map(k => k.nama_makanan);
    let harga = data.map(k => parseInt(k.harga));

    new Chart(document.getElementById("chart"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Harga Kuliner',
          data: harga
        }]
      }
    });

  });
}
