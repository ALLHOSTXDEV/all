// Main application logic for AutoPay

// Load products on the homepage
function loadProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || CONFIG.products;
    
    productList.innerHTML = products.map(product => `
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition transform hover:scale-105">
            <div class="flex justify-between items-start mb-4">
                <div class="text-5xl">${product.icon}</div>
                ${product.popular ? '<span class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">POPULER</span>' : ''}
            </div>
            <h3 class="text-2xl font-bold mb-2">${product.name}</h3>
            <p class="text-gray-300 mb-4 min-h-[60px]">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-3xl font-bold text-green-400">${formatCurrency(product.price)}</span>
                <button onclick="buyProduct('${product.id}')" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition shadow-lg shadow-purple-500/50">
                    Beli Sekarang
                </button>
            </div>
        </div>
    `).join('');
}

// Buy product - redirect to payment page
function buyProduct(productId) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || CONFIG.products;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Produk tidak ditemukan!');
        return;
    }

    // Store selected product in session storage
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Send notification to Telegram
async function sendTelegramNotification(message) {
    try {
        const url = `${CONFIG.telegram.apiUrl}${CONFIG.telegram.botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CONFIG.telegram.ownerChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return false;
    }
}

// Track visitor information
async function trackVisitor() {
    try {
        const visitorInfo = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine
        };

        // Get IP and location info
        try {
            const ipData = await fetch('https://ipapi.co/json/').then(r => r.json());
            visitorInfo.ip = ipData.ip;
            visitorInfo.country = ipData.country_name;
            visitorInfo.city = ipData.city;
        } catch (e) {
            console.log('Could not fetch IP data');
        }

        // Send to Telegram
        const message = `🆕 *Pengunjung Baru*\n\n` +
            `📅 Waktu: ${new Date().toLocaleString('id-ID')}\n` +
            `🌍 Lokasi: ${visitorInfo.city || 'N/A'}, ${visitorInfo.country || 'N/A'}\n` +
            `💻 Platform: ${visitorInfo.platform}\n` +
            `🌐 Browser: ${visitorInfo.userAgent.split(' ').slice(-2).join(' ')}\n` +
            `📱 Resolusi: ${visitorInfo.screenResolution}`;

        await sendTelegramNotification(message);
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Initialize visitor tracking on page load
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    // Only track once per session
    if (!sessionStorage.getItem('visitor_tracked')) {
        trackVisitor();
        sessionStorage.setItem('visitor_tracked', 'true');
    }
}

// Smooth scroll function
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Berhasil disalin ke clipboard!', 'success');
    }).catch(() => {
        showNotification('Gagal menyalin!', 'error');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get transaction status badge
function getStatusBadge(status) {
    const badges = {
        success: '<span class="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-semibold">✓ Sukses</span>',
        pending: '<span class="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-semibold">⏳ Pending</span>',
        failed: '<span class="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold">✕ Gagal</span>',
        expired: '<span class="px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-400 text-sm font-semibold">⌛ Expired</span>'
    };
    return badges[status] || badges.pending;
}

// Save transaction to local storage
function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
    transactions.unshift(transaction);
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

// Get all transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
}

// Update transaction status
function updateTransactionStatus(transactionId, status) {
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (transaction) {
        transaction.status = status;
        transaction.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
        return true;
    }
    return false;
}

// Export functions for use in other files
window.autopay = {
    loadProducts,
    buyProduct,
    sendTelegramNotification,
    copyToClipboard,
    showNotification,
    formatDate,
    getStatusBadge,
    saveTransaction,
    getTransactions,
    updateTransactionStatus
};
