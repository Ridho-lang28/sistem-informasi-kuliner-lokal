// ================= LOAD =================
document.addEventListener("DOMContentLoaded", function(){
  console.log("App Ready");

  const page = getPageFromURL();
  showPage(page);
});

// ================= URL ROUTING =================
function getPageFromURL(){
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || "home";
}

// ================= FORM =================
function attachForm(){
  let form = document.getElementById("formKuliner");

  if(!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    let formData = new FormData();
    formData.append("nama_makanan", document.getElementById("nama_makanan").value);
    formData.append("kategori", document.getElementById("kategori").value);
    formData.append("lokasi", document.getElementById("lokasi").value);
    formData.append("harga", document.getElementById("harga").value);
    formData.append("deskripsi", document.getElementById("deskripsi").value);
    formData.append("rating", document.getElementById("rating").value);

    fetch("/api/simpan_kuliner.php", {
      method: "POST",
      body: formData
    })
    .then(res => {
      if(!res.ok) throw new Error("Server error");
      return res.text();
    })
    .then(() => {
      alert("✅ Data berhasil disimpan!");
      showPage("daftar");
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

  fetch("/api/ambil_kuliner.php")
  .then(res => {
    if(!res.ok) throw new Error("Server error");
    return res.json();
  })
  .then(data => {

    container.innerHTML = "";

    if(!Array.isArray(data) || data.length === 0){
      container.innerHTML = "<p>Tidak ada data</p>";
      return;
    }

    data.forEach(k => {
      container.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card p-3 shadow-sm">
            <h5>${k.nama_makanan}</h5>
            <p><b>Kategori:</b> ${k.kategori}</p>
            <p><b>Lokasi:</b> ${k.lokasi}</p>
            <p><b>Harga:</b> Rp ${k.harga}</p>
            <p>${k.deskripsi}</p>
            <p>⭐ ${k.rating}</p>
            <button class="btn btn-danger btn-sm" onclick="hapus(${k.id})">Hapus</button>
          </div>
        </div>
      `;
    });

  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>❌ Gagal load data (cek API)</p>";
  });
}

// ================= DELETE =================
function hapus(id){
  if(!confirm("Yakin hapus data?")) return;

  fetch("/api/hapus_kuliner.php?id=" + id)
  .then(res => {
    if(!res.ok) throw new Error("Gagal hapus");
    alert("🗑 Data dihapus");
    loadKuliner();
  })
  .catch(err => {
    console.error(err);
    alert("❌ Gagal hapus");
  });
}
