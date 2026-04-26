function toggleMenu(){
  let menu = document.getElementById("menu");
  menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

document.addEventListener("DOMContentLoaded", function(){

  loadKuliner();
  loadAdmin(); // jalan saat halaman selesai dimuat

  let form = document.getElementById("formKuliner");

  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();

      let formData = new FormData();
      formData.append("nama_makanan", document.getElementById("nama_makanan").value);
      formData.append("kategori", document.getElementById("kategori").value);
      formData.append("lokasi", document.getElementById("lokasi").value);
      formData.append("harga", document.getElementById("harga").value);
      formData.append("deskripsi", document.getElementById("deskripsi").value);
      formData.append("rating", document.getElementById("rating").value);

      fetch("/api/simpan_kuliner.php", { // 🔥 sudah pakai /api
        method: "POST",
        body: formData
      })
      .then(res => res.text())
      .then(() => {
        alert("Data berhasil disimpan!");
        form.reset();
        loadKuliner();
        loadAdmin();
      });
    });
  }
});

// tampilkan kuliner
function loadKuliner(){
  fetch("/api/ambil_kuliner.php") // 🔥 sudah pakai /api
  .then(res => res.json())
  .then(data => {

    let container = document.getElementById("kulinerContainer");

    if(container){
      container.innerHTML = "";

      data.forEach(k => {
        container.innerHTML += `
          <div class="laporan-card">
            <h3>${k.nama_makanan}</h3>
            <p>Kategori: ${k.kategori}</p>
            <p>Lokasi: ${k.lokasi}</p>
            <p>Harga: Rp ${k.harga}</p>
            <p>${k.deskripsi}</p>
            <p>Rating: ⭐ ${k.rating}</p>
          </div>
        `;
      });
    }
  });
}

// admin
function loadAdmin(){
  fetch("/api/ambil_kuliner.php") // 🔥 sudah pakai /api
  .then(res => res.json())
  .then(data => {

    let table = document.getElementById("adminTable");

    if(table){
      table.innerHTML = "";

      data.forEach(k => {
        table.innerHTML += `
          <tr>
            <td>${k.nama_makanan}</td>
            <td>${k.kategori}</td>
            <td>${k.lokasi}</td>
            <td>${k.harga}</td>
            <td>${k.rating}</td>
            <td>
              <button onclick="hapus(${k.id})">🗑</button>
            </td>
          </tr>
        `;
      });
    }
  });
}

// hapus
function hapus(id){
  fetch("/api/hapus_kuliner.php?id=" + id) // 🔥 sudah pakai /api
  .then(() => {
    loadKuliner();
    loadAdmin();
  });
}
