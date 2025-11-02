# AutoPay - Sistem Pembayaran Otomatis

Website pembayaran otomatis modern dengan berbagai metode pembayaran dan notifikasi real-time via Telegram.

## 🚀 Fitur Utama

- **Multi Payment Gateway**: QRIS, DANA, OVO, Transfer Bank
- **Auto-Generate Invoice**: Invoice otomatis untuk setiap transaksi
- **Real-time Notification**: Notifikasi otomatis via Telegram
- **Admin Dashboard**: Monitoring transaksi dan manajemen produk
- **Responsive Design**: Tampilan optimal di semua perangkat
- **QR Code Payment**: Generate QR code otomatis untuk pembayaran
- **Payment Timer**: Countdown timer untuk setiap transaksi
- **Transaction History**: Riwayat transaksi lengkap dengan filter

## 📁 Struktur Folder

```
/vercel/sandbox/
├── index.html              # Landing page
├── payment.html            # Halaman pembayaran
├── dashboard.html          # Admin dashboard
├── css/
│   └── style.css          # Custom styling
├── js/
│   ├── config.js          # Konfigurasi aplikasi
│   ├── app.js             # Logic utama aplikasi
│   ├── payment.js         # Logic pembayaran
│   └── dashboard.js       # Logic dashboard
└── assets/                # Folder untuk gambar/assets
```

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan Tailwind CSS
- **JavaScript** - Logic aplikasi (Vanilla JS)
- **Chart.js** - Grafik statistik dashboard
- **QRCode.js** - Generate QR code pembayaran
- **Local Storage** - Penyimpanan data lokal
- **Telegram Bot API** - Notifikasi otomatis

## 📦 Produk & Layanan

1. **Nokos Fresh** - Rp 5.000
2. **Premium Access** - Rp 10.000
3. **Script Bug WA/Tele** - Rp 15.000
4. **Open Partner** - Rp 10.000
5. **Panel Hosting** - Rp 25.000
6. **Jasa Pembuatan Script** - Rp 10.000

## 💳 Metode Pembayaran

- **QRIS** - Scan & Pay
- **DANA** - E-Wallet (083116147036)
- **OVO** - E-Wallet (083116147036)
- **Transfer Bank** - BCA, Mandiri, BNI

## 🔧 Konfigurasi

Edit file `js/config.js` untuk mengubah:

- Token Telegram Bot
- Chat ID Owner
- Informasi rekening pembayaran
- Daftar produk
- Timeout pembayaran

```javascript
const CONFIG = {
    telegram: {
        botToken: 'YOUR_BOT_TOKEN',
        ownerChatId: 'YOUR_CHAT_ID'
    },
    // ... konfigurasi lainnya
};
```

## 📱 Cara Menggunakan

### Untuk Pelanggan:

1. Buka `index.html` di browser
2. Pilih produk yang ingin dibeli
3. Klik "Beli Sekarang"
4. Pilih metode pembayaran
5. Lakukan pembayaran sesuai instruksi
6. Klik "Cek Status Pembayaran"
7. Download invoice setelah pembayaran berhasil

### Untuk Admin:

1. Buka `dashboard.html` di browser
2. Lihat statistik transaksi hari ini
3. Monitor transaksi terbaru
4. Kelola produk (tambah/hapus)
5. Lihat grafik transaksi dan metode pembayaran populer

## 🎨 Fitur UI/UX

- **Dark Mode** - Tema gelap yang nyaman untuk mata
- **Gradient Effects** - Efek gradien modern dan menarik
- **Smooth Animations** - Animasi halus untuk transisi
- **Glass Morphism** - Efek kaca transparan modern
- **Responsive Layout** - Tampilan optimal di mobile & desktop
- **Loading States** - Indikator loading untuk setiap aksi
- **Toast Notifications** - Notifikasi pop-up untuk feedback

## 📊 Dashboard Features

- **Revenue Statistics** - Pendapatan hari ini
- **Transaction Count** - Jumlah transaksi sukses/pending
- **Customer Count** - Total pelanggan
- **Transaction Chart** - Grafik transaksi 7 hari terakhir
- **Payment Method Chart** - Grafik metode pembayaran populer
- **Recent Transactions** - Tabel transaksi terbaru dengan filter
- **Product Management** - Manajemen produk (CRUD)

## 🔔 Notifikasi Telegram

Sistem akan mengirim notifikasi otomatis ke Telegram untuk:

- Pengunjung baru
- Pembayaran baru (pending)
- Pembayaran berhasil
- Pembayaran gagal/expired

Format notifikasi:
```
💳 Pembayaran Baru

📋 Invoice: INV/2025/11/1234
🆔 ID: TRX1730534567891234
📦 Produk: Premium Access
💰 Jumlah: Rp 10.000
💳 Metode: DANA
📅 Waktu: 2 November 2025, 10:30
📊 Status: Menunggu Pembayaran
```

## 🔒 Keamanan

- Data transaksi disimpan di Local Storage browser
- Tidak ada data sensitif yang dikirim ke server
- Validasi input di sisi client
- Timer otomatis untuk expired transaksi
- Konfirmasi untuk aksi penting (hapus, batal)

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📝 Catatan Penting

1. **Local Storage**: Data disimpan di browser lokal, akan hilang jika cache dibersihkan
2. **Demo Mode**: Fitur "Cek Status Pembayaran" menggunakan simulasi (70% success rate)
3. **Production**: Untuk production, integrasikan dengan payment gateway API yang sebenarnya
4. **Telegram Bot**: Pastikan bot token dan chat ID sudah dikonfigurasi dengan benar

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### GitHub Pages
1. Push ke GitHub repository
2. Enable GitHub Pages di Settings
3. Pilih branch dan folder
4. Akses via `username.github.io/repo-name`

### Netlify
1. Drag & drop folder ke Netlify
2. Atau connect dengan GitHub repository
3. Deploy otomatis

## 📞 Kontak & Support

- **Telegram**: [@Death_co](https://t.me/Death_co)
- **WhatsApp**: [+62 831-1614-7036](https://wa.me/6283116147036)
- **Email**: cs.aobi5198@gmail.com

## 👨‍💻 Developer

**ObyMoods**
- Pengembang muda dari Indonesia
- Fokus: Bot Telegram, WhatsApp, Sistem Pembayaran
- Motto: "Berjuang Tak Kenal Lelah, Tetap Kuat Untuk Sang Pembenci!!"

## 📄 License

© 2025 AutoPay - Sistem Pembayaran Otomatis. All rights reserved.

---

**Powered by ObyMoods** 🚀
