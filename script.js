// ================= LOAD =================
document.addEventListener("DOMContentLoaded",function(){

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



// ================= LOGIN =================
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

alert("Login berhasil");

renderMenu();
showPage("home");

}else{
alert("Login gagal");
}

});

}



// ================= REGISTER =================
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
alert("Berhasil daftar");
showPage("login");
}else{
alert(res.msg);
}

});

}



// ================= TAMBAH =================
function attachForm(){

let form=document.getElementById("formKuliner");

if(!form) return;

if(!isLogin()){
alert("Login dulu");
showPage("login");
return;
}

form.addEventListener(
"submit",
function(e){

e.preventDefault();

let fd=new FormData();

fd.append(
"nama_makanan",
document.getElementById("nama_makanan").value
);

fd.append(
"kategori",
document.getElementById("kategori").value
);

fd.append(
"lokasi",
document.getElementById("lokasi").value
);

fd.append(
"harga",
document.getElementById("harga").value
);

fd.append(
"deskripsi",
document.getElementById("deskripsi").value
);

fd.append(
"rating",
document.getElementById("rating").value
);


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

<p>
Rp ${parseInt(k.harga).toLocaleString("id-ID")}
</p>

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

document.getElementById(
"adminList"
).innerHTML=html;

});

}


function approve(id){

fetch(
"api/approve.php?id="+id
)
.then(()=>{
alert("Approved");
loadAdmin();
});

}

function reject(id){

fetch(
"api/reject.php?id="+id
)
.then(()=>{
alert("Rejected");
loadAdmin();
});

}



// ================= DASHBOARD BPS =================
function loadChart(){

fetch("api/data_pengeluaran.php")
.then(res=>res.json())
.then(res=>{

let labels=[];
let values=[];

let data=res.datacontent;
let wilayah=res.vervar;

if(!data || !wilayah){
alert("Data BPS kosong");
return;
}


let entries=Object.entries(data);

// urut terbesar
entries.sort(
(a,b)=>b[1]-a[1]
);

// ambil top10
entries=entries.slice(0,10).reverse();

entries.forEach(([key,value])=>{

let namaWilayah=key;

wilayah.forEach(w=>{
if(key.includes(w.val)){
namaWilayah=
w.label.replace(/<[^>]*>/g,"");
}
});

labels.push(namaWilayah);
values.push(
parseFloat(value)
);

});


// isi kartu statistik
document.getElementById("totalKuliner").innerText=
labels.length;

document.getElementById("murah").innerText=
Math.min(...values).toLocaleString();

document.getElementById("mahal").innerText=
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
datasets:[{
label:"Pengeluaran per Kapita",
data:values,
borderRadius:8,
barThickness:18
}]
},

options:{
indexAxis:"y",
responsive:true,
maintainAspectRatio:false,

plugins:{
legend:{
display:false
},

tooltip:{
callbacks:{
label:function(ctx){
return "Rp "+
ctx.raw.toLocaleString();
}
}
}
},

scales:{
x:{
ticks:{
callback:function(value){
return "Rp "+
value.toLocaleString();
}
}
}
}
}

);

})
.catch(err=>{
console.error(err);
alert("Gagal ambil data API");
});

}
