# Kado Digital 🎁

Website kado kecil — tanpa alasan khusus, cuma buat bikin seseorang senang.

## Struktur

```
kado-digital/
├── index.html      ← struktur halaman (5 scene: lock, intro, galeri, surat, closing)
├── style.css       ← semua tampilan/desain
├── script.js       ← isi konten + logika (EDIT FILE INI buat ganti teks/foto)
└── assets/         ← taruh foto-foto kamu di sini
```

## Cara edit isinya (tanpa perlu jago coding)

Buka file **`script.js`**, di bagian paling atas ada blok `CONFIG = { ... }`. Edit di sana:

| Apa yang mau diganti       | Variabel di script.js     |
|-----------------------------|----------------------------|
| Kode kunci pembuka (4 digit)| `lockCode`                 |
| Nama penerima                | `recipientName`            |
| Nama kamu (pengirim)         | `senderName`                |
| Musik latar aktif/tidak      | `musicEnabled` (true/false)|
| Kalimat "alasan random"      | `randomReasons` (array)    |
| Foto + caption di galeri     | `moments` (array)          |
| Isi surat                    | `letter`                   |

### Menambah musik latar
1. Siapkan file MP3 kamu, beri nama **`music.mp3`**.
2. Taruh di folder `assets/`, jadi path-nya `assets/music.mp3`.
3. Selesai — musik otomatis coba mulai begitu pengunjung klik pertama kali di halaman (klik tombol keypad sudah cukup). Ini bukan bug, tapi aturan browser: musik nggak boleh autoplay sebelum ada interaksi dari pengunjung.
4. Ada tombol speaker kecil mengambang di kanan atas buat mute/unmute manual.
5. Kalau belum mau pakai musik, set `musicEnabled: false` di `script.js` — tombolnya otomatis hilang.

### Efek transisi bunga
Setiap pindah antar bagian (lock → intro → galeri → surat → closing), kelopak bunga akan melayang turun dengan warna dan bentuk yang berbeda-beda — supaya tiap perpindahan kerasa beda nuansanya. Ini otomatis jalan, nggak perlu di-setting apa-apa. Kalau mau ubah warnanya, cari bagian `FLOWER_THEMES` di `script.js`.

### Menambah foto
1. Taruh file foto di folder `assets/`, misal `assets/foto1.jpg`.
2. Di `script.js`, bagian `moments`, isi `image: "assets/foto1.jpg"`.
3. Kalau `image` dikosongkan `""`, otomatis muncul placeholder teks abu-abu — jadi aman dicoba dulu tanpa foto.

### Menambah/mengurangi jumlah momen di galeri
Tinggal tambah atau hapus objek di dalam array `moments: [ ... ]`. Bebas berapa pun jumlahnya.

## Cara coba di komputer sendiri
Tinggal buka `index.html` langsung di browser (double click), atau lebih baik pakai live server biar font ke-load dengan benar.

## Cara hosting gratis pakai GitHub Pages

1. Buat repository baru di GitHub (boleh public).
2. Upload ketiga file (`index.html`, `style.css`, `script.js`) beserta folder `assets/` ke repo tersebut.
3. Masuk ke **Settings → Pages**.
4. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit, link situsnya akan muncul di bagian atas halaman Pages, biasanya berbentuk:
   `https://namakamu.github.io/nama-repo/`
6. Link itu yang kamu kirim ke orangnya. 🎉

## Catatan
- Kode kunci default saat ini: **0626** — ganti dulu sebelum dikirim, atau pakai tombol **"?"** di keypad kalau lupa (itu cuma bantuan buat kamu sendiri waktu testing, hapus saja baris terkait di `script.js` fungsi `initLock()` kalau mau dihilangkan sebelum dikirim ke penerima).
- Belum ada musik latar. Kalau mau nambahin nanti, taruh file mp3 di `assets/`, lalu tambahkan tag `<audio>` di `index.html` — bisa minta bantuan lagi kalau butuh.
