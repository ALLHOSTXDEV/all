# Setup Guide - AutoPay

Panduan lengkap untuk setup dan konfigurasi website pembayaran otomatis AutoPay.

## 📋 Prerequisites

Tidak ada dependencies yang perlu diinstall! Website ini menggunakan:
- Tailwind CSS (via CDN)
- Chart.js (via CDN)
- QRCode.js (via CDN)
- Vanilla JavaScript

## 🚀 Quick Start

### 1. Clone atau Download Repository

```bash
git clone <repository-url>
cd vercel/sandbox
```

### 2. Konfigurasi Telegram Bot

Edit file `js/config.js`:

```javascript
const CONFIG = {
    telegram: {
        botToken: 'YOUR_BOT_TOKEN_HERE',      // Ganti dengan token bot Anda
        ownerChatId: 'YOUR_CHAT_ID_HERE',     // Ganti dengan chat ID Anda
        apiUrl: 'https://api.telegram.org/bot'
    },
    // ...
};
```

#### Cara Mendapatkan Bot Token:

1. Buka Telegram dan cari **@BotFather**
2. Kirim perintah `/newbot`
3. Ikuti instruksi untuk membuat bot baru
4. Copy token yang diberikan
5. Paste ke `botToken` di config.js

#### Cara Mendapatkan Chat ID:

1. Buka Telegram dan cari **@userinfobot**
2. Kirim perintah `/start`
3. Bot akan memberikan chat ID Anda
4. Copy chat ID tersebut
5. Paste ke `ownerChatId` di config.js

### 3. Konfigurasi Metode Pembayaran

Edit informasi rekening di `js/config.js`:

```javascript
paymentMethods: {
    dana: {
        accountNumber: '083116147036',  // Ganti dengan nomor Anda
        accountName: 'A.M',             // Ganti dengan nama Anda
        // ...
    },
    ovo: {
        accountNumber: '083116147036',  // Ganti dengan nomor Anda
        accountName: 'A.M',             // Ganti dengan nama Anda
        // ...
    },
    bank: {
        banks: [
            { name: 'BCA', accountNumber: '1234567890', accountName: 'A.M' },
            { name: 'Mandiri', accountNumber: '0987654321', accountName: 'A.M' },
            // Tambahkan bank lainnya
        ]
    }
}
```

### 4. Konfigurasi Produk

Edit atau tambahkan produk di `js/config.js`:

```javascript
products: [
    {
        id: 'prod_001',
        name: 'Nama Produk',
        price: 10000,
        description: 'Deskripsi produk',
        category: 'premium',
        icon: '⭐',
        popular: true
    },
    // Tambahkan produk lainnya
]
```

### 5. Jalankan Website

#### Opsi 1: Buka Langsung di Browser
```bash
# Buka file index.html di browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

#### Opsi 2: Gunakan Local Server (Recommended)

**Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Kemudian buka browser dan akses: `http://localhost:8000`

## 🔧 Kustomisasi

### Mengubah Warna Tema

Edit file `css/style.css` atau gunakan Tailwind classes:

```css
/* Primary color: Purple */
.bg-purple-600 { background-color: #9333ea; }

/* Secondary color: Pink */
.bg-pink-600 { background-color: #db2777; }

/* Ganti dengan warna favorit Anda */
```

### Mengubah Timeout Pembayaran

Edit di `js/config.js`:

```javascript
// Default: 900 detik (15 menit)
paymentTimeout: 900,

// Ubah sesuai kebutuhan (dalam detik)
paymentTimeout: 1800,  // 30 menit
```

### Menambah Metode Pembayaran Baru

1. Tambahkan di `js/config.js`:

```javascript
paymentMethods: {
    // ... metode lainnya
    gopay: {
        name: 'GoPay',
        icon: '🟢',
        accountNumber: '081234567890',
        accountName: 'Nama Anda',
        instructions: [
            'Buka aplikasi Gojek',
            'Pilih menu GoPay',
            // ... instruksi lainnya
        ]
    }
}
```

2. Tambahkan button di `payment.html`:

```html
<button onclick="selectPaymentMethod('gopay')" class="payment-method-btn ...">
    <div class="text-5xl mb-2">🟢</div>
    <p class="font-semibold text-lg">GoPay</p>
</button>
```

## 📱 Testing

### Test Flow Pembayaran:

1. **Buka Homepage** (`index.html`)
   - ✓ Produk tampil dengan benar
   - ✓ Harga terformat dengan baik
   - ✓ Button "Beli Sekarang" berfungsi

2. **Pilih Produk**
   - ✓ Redirect ke halaman pembayaran
   - ✓ Detail produk tampil di order summary

3. **Pilih Metode Pembayaran**
   - ✓ QR Code generate dengan benar
   - ✓ Nomor rekening tampil
   - ✓ Timer countdown berjalan
   - ✓ Instruksi pembayaran tampil

4. **Cek Status Pembayaran**
   - ✓ Simulasi pembayaran berhasil
   - ✓ Success message tampil
   - ✓ Invoice dapat didownload

5. **Dashboard Admin** (`dashboard.html`)
   - ✓ Statistik tampil dengan benar
   - ✓ Chart render dengan baik
   - ✓ Transaksi terbaru tampil
   - ✓ Filter transaksi berfungsi
   - ✓ Manajemen produk berfungsi

### Test Notifikasi Telegram:

1. Buka website
2. Lakukan transaksi
3. Cek Telegram bot Anda
4. Pastikan notifikasi diterima

## 🐛 Troubleshooting

### Notifikasi Telegram Tidak Terkirim

**Masalah:** Notifikasi tidak muncul di Telegram

**Solusi:**
1. Pastikan bot token benar
2. Pastikan chat ID benar
3. Pastikan bot sudah di-start (`/start`)
4. Cek console browser untuk error
5. Test bot dengan curl:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>&text=Test"
```

### QR Code Tidak Muncul

**Masalah:** QR Code tidak generate

**Solusi:**
1. Pastikan QRCode.js library loaded (cek Network tab)
2. Cek console untuk error
3. Pastikan canvas element ada di DOM

### Data Transaksi Hilang

**Masalah:** Transaksi hilang setelah refresh

**Solusi:**
- Data disimpan di Local Storage browser
- Jangan clear cache/cookies
- Untuk production, gunakan database server

### Chart Tidak Tampil

**Masalah:** Grafik tidak render di dashboard

**Solusi:**
1. Pastikan Chart.js library loaded
2. Cek console untuk error
3. Pastikan canvas element ada
4. Refresh halaman

## 🚀 Deployment

### Deploy ke Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

### Deploy ke Netlify:

1. Buat akun di [Netlify](https://netlify.com)
2. Drag & drop folder ke Netlify Drop
3. Atau connect dengan GitHub repository

### Deploy ke GitHub Pages:

```bash
# Push ke GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages di Settings
# Pilih branch: main
# Pilih folder: / (root)
```

## 📊 Production Checklist

Sebelum deploy ke production:

- [ ] Ganti bot token dengan token production
- [ ] Update informasi rekening yang benar
- [ ] Test semua metode pembayaran
- [ ] Test notifikasi Telegram
- [ ] Integrasikan dengan payment gateway API real
- [ ] Setup database untuk transaksi (optional)
- [ ] Setup SSL certificate (HTTPS)
- [ ] Test di berbagai browser
- [ ] Test responsive di mobile
- [ ] Setup monitoring & analytics
- [ ] Backup data secara berkala

## 🔒 Security Tips

1. **Jangan commit bot token** ke public repository
2. **Gunakan environment variables** untuk sensitive data
3. **Validasi input** di client dan server
4. **Gunakan HTTPS** untuk production
5. **Rate limiting** untuk API calls
6. **Sanitize user input** untuk prevent XSS
7. **Regular security updates**

## 📞 Support

Jika mengalami masalah:

1. Cek dokumentasi di README.md
2. Cek troubleshooting guide di atas
3. Hubungi developer:
   - Telegram: [@Death_co](https://t.me/Death_co)
   - WhatsApp: [+62 831-1614-7036](https://wa.me/6283116147036)
   - Email: cs.aobi5198@gmail.com

## 📝 Notes

- Website ini adalah **demo/template**
- Untuk production, integrasikan dengan **payment gateway API** yang sebenarnya
- **Local Storage** hanya untuk demo, gunakan **database** untuk production
- Fitur "Cek Status Pembayaran" menggunakan **simulasi**, perlu integrasi API real

---

**Happy Coding! 🚀**

Powered by ObyMoods
