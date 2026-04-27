// ================= LOAD =================
document.addEventListener("DOMContentLoaded", function(){
console.log("App Ready");
renderMenu();

const page=getPageFromURL();
showPage(page);
});

// ================= URL =================
function getPageFromURL(){
const params=new URLSearchParams(window.location.search);
return params.get("page") || "home";
}

// ================= AUTH =================
function isLogin(){
return localStorage.getItem("user")!==null;
}

function getUser(){
return JSON.parse(localStorage.getItem("user"));
}

function getRole(){
let user=getUser();
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

let role=getRole();
let menu=document.getElementById("menuList");

let html=`
<li><a class="dropdown-item" onclick="showPage('home')">Beranda</a></li>
<li><a class="dropdown-item" onclick="showPage('daftar')">Kuliner</a></li>
<li><a class="dropdown-item" onclick="showPage('tambah')">Tambah Kuliner</a></li>
`;

if(role){
html+=`
<li><a class="dropdown-item" onclick="showPage('dashboard')">
Dashboard
</a></li>
`;
}

if(role==="admin"){
html+=`
<li><a class="dropdown-item"
onclick="showPage('admin')">
Panel Admin
</a></li>
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
<li><a class="dropdown-item"
onclick="showPage('login')">Login</a></li>

<li><a class="dropdown-item"
onclick="showPage('register')">Daftar</a></li>
`;
}

menu.innerHTML=html;

}

// ================= LOGIN =================
function login(){

let formData=new FormData();
formData.append("email",email.value);
formData.append("password",password.value);

fetch("api/login.php",{
method:"POST",
body:formData
})
.then(r=>r.json())
.then(res=>{

if(res.status==="success"){
localStorage.setItem("user",JSON.stringify(res));
alert("Login berhasil");
renderMenu();
showPage("home");
}
else{
alert("Login gagal");
}

});

}

// ================= REGISTER =================
function register(){

let formData=new FormData();

formData.append("email",email.value);
formData.append("password",password.value);

fetch("api/register.php",{
method:"POST",
body:formData
})
.then(r=>r.json())
.then(res=>{

if(res.status==="success"){
alert("Berhasil daftar");
showPage("login");
}
else{
alert(res.msg);
}

});

}

// ================= FORM TAMBAH =================
function attachForm(){

let form=document.getElementById("formKuliner");

if(!form) return;

if(!isLogin()){
alert("Login dulu");
showPage("login");
return;
}

form.addEventListener("submit",function(e){

e.preventDefault();

let fd=new FormData();

fd.append("nama_makanan",nama_makanan.value);
fd.append("kategori",kategori.value);
fd.append("lokasi",lokasi.value);
fd.append("harga",harga.value);
fd.append("deskripsi",deskripsi.value);
fd.append("rating",rating.value);

fetch("api/simpan_kuliner.php",{
method:"POST",
body:fd
})
.then(()=>{

alert("Menunggu approval admin");
showPage("home");

});

});

}

// ================= LOAD KULINER =================
function loadKuliner(){

let box=document.getElementById("kulinerContainer");

if(!box) return;

box.innerHTML="Loading...";

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
<div class="card shadow p-3">
<h5>${k.nama_makanan}</h5>

<p>${k.kategori}</p>

<p>${k.lokasi}</p>

<p>Rp ${parseInt(k.harga).toLocaleString("id-ID")}</p>

<p>⭐ ${k.rating}</p>

</div>
</div>
`;

});

});

}

// ================= ADMIN =================
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

<div class="mt-2">

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

</div>
`;

});

document.getElementById("adminList").innerHTML=html;

});

}

function approve(id){
fetch("api/approve.php?id="+id)
.then(()=>{
alert("Approved");
loadAdmin();
});
}

function reject(id){
fetch("api/reject.php?id="+id)
.then(()=>{
alert("Rejected");
loadAdmin();
});
}


// ================= DASHBOARD =================
function loadChart(){

fetch("api/ambil_kuliner.php")
.then(r=>r.json())
.then(data=>{

let labels=data.map(k=>k.nama_makanan);
let harga=data.map(k=>parseInt(k.harga));


// kartu statistik
document.getElementById("totalKuliner").innerText=
data.length;

document.getElementById("murah").innerText=
data.filter(k=>parseInt(k.harga)<20000).length;

document.getElementById("mahal").innerText=
data.filter(k=>parseInt(k.harga)>=20000).length;


// chart
new Chart(
document.getElementById("chart"),
{
type:"bar",

data:{
labels:labels,

datasets:[{
label:"Harga Kuliner",
data:harga
}]
},

options:{
indexAxis:"y",

plugins:{
legend:{
display:false
},
tooltip:{
callbacks:{
label:function(context){
return "Rp "+
context.raw.toLocaleString("id-ID");
}
}
}
}
}

});

});

}
