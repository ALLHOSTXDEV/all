// Configuration file for AutoPay

const CONFIG = {
    // Telegram Bot Configuration
    telegram: {
        botToken: '8231896134:AAE0O9nxofxqC5_fyoM54t6jYBVXbtSz6EA',
        ownerChatId: '7568537295',
        apiUrl: 'https://api.telegram.org/bot'
    },

    // Payment Methods Configuration
    paymentMethods: {
        qris: {
            name: 'QRIS',
            icon: '💳',
            qrImage: 'https://files.catbox.moe/0o6a2n.jpg',
            instructions: [
                'Buka aplikasi pembayaran digital Anda (GoPay, OVO, DANA, dll)',
                'Pilih menu Scan QR atau Bayar',
                'Scan QR Code yang ditampilkan',
                'Masukkan nominal pembayaran sesuai total',
                'Konfirmasi pembayaran',
                'Tunggu notifikasi pembayaran berhasil'
            ]
        },
        dana: {
            name: 'DANA',
            icon: '💰',
            accountNumber: '083116147036',
            accountName: 'A.M',
            instructions: [
                'Buka aplikasi DANA',
                'Pilih menu Transfer',
                'Masukkan nomor DANA tujuan',
                'Masukkan nominal pembayaran',
                'Tambahkan catatan (opsional)',
                'Konfirmasi dan selesaikan pembayaran'
            ]
        },
        ovo: {
            name: 'OVO',
            icon: '📱',
            accountNumber: '083116147036',
            accountName: 'A.M',
            instructions: [
                'Buka aplikasi OVO',
                'Pilih menu Transfer',
                'Pilih Transfer ke Sesama OVO',
                'Masukkan nomor OVO tujuan',
                'Masukkan nominal pembayaran',
                'Konfirmasi dan selesaikan pembayaran'
            ]
        },
        bank: {
            name: 'Transfer Bank',
            icon: '🏦',
            banks: [
                { name: 'BCA', accountNumber: '1234567890', accountName: 'A.M' },
                { name: 'Mandiri', accountNumber: '0987654321', accountName: 'A.M' },
                { name: 'BNI', accountNumber: '5555666677', accountName: 'A.M' }
            ],
            instructions: [
                'Buka aplikasi mobile banking atau ATM',
                'Pilih menu Transfer',
                'Pilih bank tujuan',
                'Masukkan nomor rekening',
                'Masukkan nominal pembayaran',
                'Konfirmasi dan selesaikan transfer'
            ]
        }
    },

    // Products Configuration
    products: [
        {
            id: 'prod_001',
            name: 'Nokos Fresh',
            price: 5000,
            description: 'Nomor kosong fresh untuk berbagai keperluan',
            category: 'premium',
            icon: '📱',
            popular: true
        },
        {
            id: 'prod_002',
            name: 'Premium Access',
            price: 10000,
            description: 'Akses premium ke semua fitur dan layanan',
            category: 'premium',
            icon: '⭐',
            popular: true
        },
        {
            id: 'prod_003',
            name: 'Script Bug WA/Tele',
            price: 15000,
            description: 'Script bug untuk WhatsApp dan Telegram',
            category: 'script',
            icon: '🔧',
            popular: false
        },
        {
            id: 'prod_004',
            name: 'Open Partner',
            price: 10000,
            description: 'Kesempatan menjadi partner resmi',
            category: 'service',
            icon: '🤝',
            popular: false
        },
        {
            id: 'prod_005',
            name: 'Panel Hosting',
            price: 25000,
            description: 'Panel hosting dengan berbagai paket',
            category: 'hosting',
            icon: '🖥️',
            popular: true
        },
        {
            id: 'prod_006',
            name: 'Jasa Pembuatan Script',
            price: 10000,
            description: 'Jasa pembuatan script custom sesuai kebutuhan',
            category: 'service',
            icon: '💻',
            popular: false
        }
    ],

    // Contact Information
    contact: {
        telegram: 'https://t.me/Death_co',
        whatsapp: 'https://wa.me/6283116147036',
        email: 'cs.aobi5198@gmail.com'
    },

    // Payment Timer (in seconds)
    paymentTimeout: 900, // 15 minutes

    // Currency
    currency: 'IDR',
    currencySymbol: 'Rp'
};

// Helper Functions
const formatCurrency = (amount) => {
    return `${CONFIG.currencySymbol} ${amount.toLocaleString('id-ID')}`;
};

const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TRX${timestamp}${random}`;
};

const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `INV/${year}/${month}/${random}`;
};

// Local Storage Keys
const STORAGE_KEYS = {
    transactions: 'autopay_transactions',
    products: 'autopay_products',
    settings: 'autopay_settings'
};

// Initialize default data if not exists
const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.transactions)) {
        localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(CONFIG.products));
    }
};

// Run initialization
initializeStorage();
