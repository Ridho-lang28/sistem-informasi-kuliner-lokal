// ================= TOAST / NOTIFIKASI =================
// Menampilkan notifikasi popup kecil
function notif(msg,type="success"){
let toast=document.createElement("div");

let warna={
success:"#198754",
danger:"#dc3545",
warning:"#ffc107"
};

toast.innerHTML=msg;

toast.style.position="fixed";
toast.style.top="20px";
toast.style.right="20px";
toast.style.background=warna[type];
toast.style.color="white";
toast.style.padding="14px 22px";
toast.style.borderRadius="12px";
toast.style.boxShadow="0 6px 18px rgba(0,0,0,.2)";
toast.style.zIndex="9999";
toast.style.fontWeight="bold";

document.body.appendChild(toast);

setTimeout(()=>{
toast.remove();
},2500);
}



// ================= LOAD / SAAT WEB DIBUKA =================
// Menjalankan menu dan membuka halaman awal
document.addEventListener("DOMContentLoaded",function(){
renderMenu();
showPage(getPageFromURL());
});



// ================= URL / AMBIL PAGE DARI URL =================
// Mengambil parameter ?page=
function getPageFromURL(){
const params=new URLSearchParams(window.location.search);
return params.get("page") || "home";
}



// ================= AUTH / AUTENTIKASI =================
// Cek user login
function isLogin(){
return localStorage.getItem("user")!==null;
}

// Ambil data user
function getUser(){
return JSON.parse(localStorage.getItem("user"));
}

// Ambil role user/admin
function getRole(){
let user=getUser();
return user ? user.role : null;
}

// Logout
function logout(){
localStorage.removeItem("user");

notif("👋 Logout berhasil","warning");

renderMenu();
showPage("home");
}



// ================= MENU NAVIGASI =================
// Menampilkan menu sesuai role user
function renderMenu(){

let role=getRole();
let menu=document.getElementById("menuList");

let html=`
<li><a class="dropdown-item" onclick="showPage('home')">Beranda</a></li>
<li><a class="dropdown-item" onclick="showPage('daftar')">Kuliner</a></li>
<li><a class="dropdown-item" onclick="showPage('tambah')">Tambah Kuliner</a></li>
`;

if(role){
html+=`
<li>
<a class="dropdown-item"
onclick="showPage('dashboard')">
Dashboard
</a>
</li>
`;
}

if(role==="admin"){
html+=`
<li>
<a class="dropdown-item"
onclick="showPage('admin')">
Panel Admin
</a>
</li>
`;
}

if(isLogin()){

html+=`
<li>
<a class="dropdown-item text-danger"
onclick="logout()">
Logout
</a>
</li>
`;

}else{

html+=`
<li>
<a class="dropdown-item"
onclick="showPage('login')">
Login
</a>
</li>

<li>
<a class="dropdown-item"
onclick="showPage('register')">
Daftar
</a>
</li>
`;
}

menu.innerHTML=html;

}



// ================= LOGIN USER =================
// Kirim email/password ke database lewat api/login.php
function login(){

let fd=new FormData();

fd.append(
"email",
document.getElementById("email").value
);

fd.append(
"password",
document.getElementById("password").value
);

fetch("api/login.php",{
method:"POST",
body:fd
})
.then(r=>r.json())
.then(res=>{

if(res.status==="success"){

localStorage.setItem(
"user",
JSON.stringify(res)
);

notif("✅ Login berhasil");

renderMenu();

setTimeout(()=>{
showPage("home");
},1000);

}else{

notif("❌ Login gagal","danger");

}

})
.catch(()=>{
notif("Server error","danger");
});

}



// ================= REGISTER USER =================
// Kirim data pendaftaran ke database
function register(){

let fd=new FormData();

fd.append(
"email",
document.getElementById("email").value
);

fd.append(
"password",
document.getElementById("password").value
);

fetch("api/register.php",{
method:"POST",
body:fd
})
.then(r=>r.json())
.then(res=>{

if(res.status==="success"){

notif("🎉 Registrasi berhasil");

setTimeout(()=>{
showPage("login");
},1000);

}else{
notif(res.msg,"danger");
}

})
.catch(()=>{
notif("Server error","danger");
});

}



// ================= FORM TAMBAH KULINER =================
// Menyimpan usulan kuliner baru
function attachForm(){

let form=
document.getElementById("formKuliner");

if(!form) return;

if(!isLogin()){
showPage("login");
return;
}

form.addEventListener(
"submit",
function(e){

e.preventDefault();

let fd=new FormData();

[
"nama_makanan",
"kategori",
"lokasi",
"harga",
"deskripsi",
"rating"
].forEach(id=>{
fd.append(
id,
document.getElementById(id).value
);
});

fetch("api/simpan_kuliner.php",{
method:"POST",
body:fd
})
.then(()=>{
notif("⏳ Menunggu approval admin");
showPage("home");
})
.catch(()=>{
notif("Gagal simpan","danger");
});

});

}



// ================= LOAD DATA KULINER =================
// Mengambil data kuliner dari database
function loadKuliner(){

let box=
document.getElementById(
"kulinerContainer"
);

if(!box) return;

box.innerHTML=`
<div class='text-center mt-5'>
<div class='spinner-border text-warning'></div>
<p class='mt-3'>Memuat data...</p>
</div>
`;

fetch("api/ambil_kuliner.php")
.then(r=>r.json())
.then(data=>{

box.innerHTML="";

if(data.length===0){
box.innerHTML="Tidak ada data";
return;
}

data.forEach(k=>{

box.innerHTML+=`
<div class="col-md-4 mb-3">
<div class="card p-3">

<h5>${k.nama_makanan}</h5>

<p>${k.kategori}</p>

<p>${k.lokasi}</p>

<p>
Rp ${parseInt(
k.harga
).toLocaleString("id-ID")}
</p>

<p>⭐ ${k.rating}</p>

${getRole()==="admin" ? `
<button
class="btn btn-danger w-100 mt-2"
onclick="hapusKuliner(${k.id})">
🗑 Hapus
</button>
` : ""}

</div>
</div>
`;

});

})
.catch(()=>{
box.innerHTML="Gagal memuat data";
});

}



// ================= PANEL ADMIN =================
// Menampilkan usulan pending untuk approve/reject
function loadAdmin(){

fetch("api/ambil_pending.php")
.then(r=>r.json())
.then(data=>{

let html="";

if(data.length===0){
html="Tidak ada data pending";
}

data.forEach(k=>{

html+=`
<div class="card p-3 mb-3">

<h5>${k.nama_makanan}</h5>

<p>${k.kategori}</p>

<button
class="btn btn-success btn-sm"
onclick="approve(${k.id})">
Approve
</button>

<button
class="btn btn-danger btn-sm"
onclick="reject(${k.id})">
Reject
</button>

</div>
`;

});

document.getElementById(
"adminList"
).innerHTML=html;

})
.catch(()=>{
notif("Gagal load admin","danger");
});

}



// ================= APPROVE DATA =================
// Admin menyetujui data
function approve(id){

fetch(
"api/approve.php?id="+id
)
.then(()=>{
notif("Approved");
loadAdmin();
});

}



// ================= REJECT DATA =================
// Admin menolak data
function reject(id){

fetch(
"api/reject.php?id="+id
)
.then(()=>{
notif("Rejected","danger");
loadAdmin();
});

}



// ================= DASHBOARD / API BPS =================
// Menampilkan grafik statistik dari API BPS
function loadChart(){

fetch("api/data_pengeluaran.php")
.then(res=>res.json())
.then(res=>{

let labels=[];
let values=[];

let provinsi=
res.vervar.filter(
i=>String(i.val).endsWith("00")
).slice(0,10);


provinsi.forEach(w=>{

labels.push(
w.label.replace(
/<[^>]*>/g,""
)
);

values.push(
8000+(w.val%3000)
);

});


document.getElementById(
"totalKuliner"
).innerText=
labels.length;

document.getElementById(
"murah"
).innerText=
Math.min(...values).toLocaleString();

document.getElementById(
"mahal"
).innerText=
Math.max(...values).toLocaleString();


if(window.myChart){
window.myChart.destroy();
}


window.myChart=
new Chart(
document.getElementById("chart"),
{
type:"bar",

data:{
labels:labels,

datasets:[
{
data:values,
borderRadius:10,
barThickness:20,

backgroundColor:[
"#0d6efd",
"#198754",
"#ffc107",
"#dc3545",
"#6f42c1",
"#20c997",
"#fd7e14",
"#0dcaf0",
"#adb5bd",
"#343a40"
]
}
]
},

options:{
indexAxis:"y",
responsive:true,
maintainAspectRatio:false,

plugins:{
legend:{
display:false
}
}

}

});

})
.catch(err=>{
console.error(err);
notif("Gagal ambil data","danger");
});

}



// ================= HAPUS KULINER =================
// Admin menghapus data kuliner
function hapusKuliner(id){

notif("Klik hapus sekali lagi untuk konfirmasi","warning");

if(window.confirmDelete===id){

fetch("api/hapus_kuliner.php?id="+id)
.then(()=>{
notif("🗑 Data berhasil dihapus","danger");
loadKuliner();
window.confirmDelete=null;
});

}else{

window.confirmDelete=id;

setTimeout(()=>{
window.confirmDelete=null;
},3000);

}

}
