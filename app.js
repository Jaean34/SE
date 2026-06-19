// 1. Inisialisasi Database LocalStorage
let databaseProduk = JSON.parse(localStorage.getItem('produk_umkm'));
if (!databaseProduk) {
    databaseProduk = [
        { id: 1, nama: "Product 1", save: "Save", no: "No" },
        { id: 2, nama: "Product 2", save: "Save", no: "No" }
    ];
    localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
}

let idProdukTerpilih = null; // Menyimpan ID produk yang sedang dikelola

// 2. Fungsi Navigasi Halaman SPA
function navigasi(namaHalaman) {
    const semuaHalaman = document.querySelectorAll('.app-page');
    semuaHalaman.forEach(page => page.classList.add('hidden'));

    const targetPage = document.getElementById('page-' + namaHalaman);
    if (targetPage) targetPage.classList.remove('hidden');

    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (namaHalaman === 'home' && navItems[0]) navItems[0].classList.add('active');
    if (namaHalaman === 'list' && navItems[1]) navItems[1].classList.add('active');
    if (namaHalaman === 'scan' && navItems[2]) navItems[2].classList.add('active');
    if (namaHalaman === 'statis' && navItems[3]) navItems[3].classList.add('active');
    if (namaHalaman === 'profile' && navItems[4]) navItems[4].classList.add('active');

    if (namaHalaman === 'list') {
        tampilkanDataInventory();
    }
}

// 3. Fungsi Render Data ke Halaman Inventory
function tampilkanDataInventory() {
    const containerProduk = document.querySelector('.products-list');
    if (!containerProduk) return;

    containerProduk.innerHTML = "";

    databaseProduk.forEach(produk => {
        const itemHTML = `
            <div class="product-item">
                <div class="product-box-img"><i class="fa-solid fa-image"></i></div>
                <div class="product-info">
                    <h4>${produk.nama}</h4>
                    <span class="badge-save">${produk.save}</span> 
                    <span class="badge-no">${produk.no}</span>
                </div>
                <button class="btn-edit" onclick="bukaModalPilihan(${produk.id}, '${produk.nama}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        `;
        containerProduk.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// 4. Fitur Klik Tombol Edit Bawaan: Muncul Menu Pilihan (Edit / Hapus)
function bukaModalPilihan(id, nama) {
    idProdukTerpilih = id;
    document.getElementById('pilihan-judul-produk').innerText = nama;
    document.getElementById('modal-pilihan').classList.remove('hidden');
}

function tutupModalPilihan() {
    document.getElementById('modal-pilihan').classList.add('hidden');
}

// Aksi jika memilih "Edit Produk"
document.getElementById('btn-pilihan-edit').addEventListener('click', function() {
    const produk = databaseProduk.find(p => p.id === idProdukTerpilih);
    if (produk) {
        // Isi formulir dengan data lama
        document.getElementById('input-nama').value = produk.nama;
        document.getElementById('input-save').value = produk.save;
        document.getElementById('input-no').value = produk.no;
        
        tutupModalPilihan();
        bukaModal(); // Buka form modal utama
    }
});

// Aksi jika memilih "Hapus Produk"
document.getElementById('btn-pilihan-hapus').addEventListener('click', function() {
    tutupModalPilihan();
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
        databaseProduk = databaseProduk.filter(p => p.id !== idProdukTerpilih);
        localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
        tampilkanDataInventory();
    }
});

// 5. Fungsi Kontrol Modal Tambah/Edit Produk Utama
function bukaModal() {
    const modal = document.getElementById('modal-produk');
    if (modal) modal.classList.remove('hidden');
}

function tutupModal() {
    const modal = document.getElementById('modal-produk');
    const form = document.getElementById('form-produk');
    if (modal) modal.classList.add('hidden');
    if (form) form.reset();
    idProdukTerpilih = null; // Reset ID tersemat
}

// 6. Hubungkan Aksi Submit Form (Bisa Tambah Baru ATAU Update Data Lama)
window.onload = function() {
    tampilkanDataInventory();
    
    const formProduk = document.getElementById('form-produk');
    if (formProduk) {
        formProduk.addEventListener('submit', function(e) {
            e.preventDefault();

            const namaVal = document.getElementById('input-nama').value;
            const saveVal = document.getElementById('input-save').value;
            const noVal = document.getElementById('input-no').value;

            if (idProdukTerpilih) {
                // MODUS EDIT: Update data lama di dalam array
                databaseProduk = databaseProduk.map(p => {
                    if (p.id === idProdukTerpilih) {
                        return { id: p.id, nama: namaVal, save: saveVal, no: noVal };
                    }
                    return p;
                });
            } else {
                // MODUS TAMBAH BARU
                const produkBaru = { id: Date.now(), nama: namaVal, save: saveVal, no: noVal };
                databaseProduk.push(produkBaru);
            }

            localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
            tutupModal();
            navigasi('list'); 
        });
    }
};
