// Payment page logic

let currentTransaction = null;
let paymentTimer = null;
let timeRemaining = CONFIG.paymentTimeout;

// Initialize payment page
window.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
});

// Load order summary
function loadOrderSummary() {
    const product = JSON.parse(sessionStorage.getItem('selectedProduct'));
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = `
        <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
            <div class="flex items-center space-x-4">
                <div class="text-4xl">${product.icon}</div>
                <div>
                    <h3 class="text-xl font-bold">${product.name}</h3>
                    <p class="text-gray-400 text-sm">${product.description}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-400">Harga</p>
                <p class="text-2xl font-bold text-green-400">${formatCurrency(product.price)}</p>
            </div>
        </div>
        <div class="flex justify-between items-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <span class="text-lg font-semibold">Total Pembayaran:</span>
            <span class="text-3xl font-bold text-purple-400">${formatCurrency(product.price)}</span>
        </div>
    `;
}

// Select payment method
function selectPaymentMethod(method) {
    const product = JSON.parse(sessionStorage.getItem('selectedProduct'));
    const paymentMethod = CONFIG.paymentMethods[method];
    
    if (!paymentMethod) {
        showNotification('Metode pembayaran tidak tersedia!', 'error');
        return;
    }

    // Create transaction
    currentTransaction = {
        id: generateTransactionId(),
        invoiceNumber: generateInvoiceNumber(),
        product: product,
        paymentMethod: method,
        amount: product.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + CONFIG.paymentTimeout * 1000).toISOString()
    };

    // Save transaction
    saveTransaction(currentTransaction);

    // Show payment details
    showPaymentDetails(method, paymentMethod);

    // Start timer
    startPaymentTimer();

    // Send notification to Telegram
    sendPaymentNotification();

    // Scroll to payment details
    document.getElementById('paymentDetails').scrollIntoView({ behavior: 'smooth' });
}

// Show payment details
function showPaymentDetails(method, paymentMethod) {
    const paymentDetails = document.getElementById('paymentDetails');
    const qrSection = document.getElementById('qrSection');
    const accountSection = document.getElementById('accountSection');
    const instructions = document.getElementById('paymentInstructions');

    paymentDetails.classList.remove('hidden');

    // Load instructions
    instructions.innerHTML = paymentMethod.instructions.map((inst, idx) => 
        `<li>${idx + 1}. ${inst}</li>`
    ).join('');

    if (method === 'qris') {
        // Show QR Code
        qrSection.classList.remove('hidden');
        accountSection.classList.add('hidden');
        
        // Generate QR Code
        const qrCanvas = document.getElementById('qrcode');
        const qrData = `${currentTransaction.invoiceNumber}|${currentTransaction.amount}|${paymentMethod.name}`;
        QRCode.toCanvas(qrCanvas, qrData, {
            width: 250,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
    } else if (method === 'bank') {
        // Show bank account details
        qrSection.classList.add('hidden');
        accountSection.classList.remove('hidden');
        
        const bank = paymentMethod.banks[0]; // Default to first bank
        document.getElementById('accountNumber').textContent = bank.accountNumber;
        document.getElementById('accountName').textContent = bank.accountName;
        document.getElementById('totalAmount').textContent = formatCurrency(currentTransaction.amount);
    } else {
        // Show e-wallet account
        qrSection.classList.add('hidden');
        accountSection.classList.remove('hidden');
        
        document.getElementById('accountNumber').textContent = paymentMethod.accountNumber;
        document.getElementById('accountName').textContent = paymentMethod.accountName;
        document.getElementById('totalAmount').textContent = formatCurrency(currentTransaction.amount);
    }
}

// Start payment timer
function startPaymentTimer() {
    const timerDisplay = document.getElementById('paymentTimer');
    
    paymentTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(paymentTimer);
            expirePayment();
        }
    }, 1000);
}

// Expire payment
function expirePayment() {
    updateTransactionStatus(currentTransaction.id, 'expired');
    
    const paymentStatus = document.getElementById('paymentStatus');
    paymentStatus.innerHTML = `
        <div class="inline-flex items-center space-x-2 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-full">
            <span class="text-red-400 font-semibold">⌛ Pembayaran Expired</span>
        </div>
    `;
    
    showNotification('Waktu pembayaran telah habis!', 'error');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Copy account number
function copyAccountNumber() {
    const accountNumber = document.getElementById('accountNumber').textContent;
    copyToClipboard(accountNumber);
}

// Check payment status (simulate)
function checkPaymentStatus() {
    // In real implementation, this would check with payment gateway API
    // For demo, we'll simulate a successful payment
    
    showNotification('Memeriksa status pembayaran...', 'info');
    
    setTimeout(() => {
        // Simulate random success/pending
        const isSuccess = Math.random() > 0.3; // 70% success rate for demo
        
        if (isSuccess) {
            completePayment();
        } else {
            showNotification('Pembayaran belum diterima. Silakan coba lagi.', 'error');
        }
    }, 2000);
}

// Complete payment
function completePayment() {
    clearInterval(paymentTimer);
    
    // Update transaction status
    updateTransactionStatus(currentTransaction.id, 'success');
    
    // Hide payment details
    document.getElementById('paymentDetails').classList.add('hidden');
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    successMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Send success notification
    sendSuccessNotification();
    
    showNotification('Pembayaran berhasil!', 'success');
}

// Cancel payment
function cancelPayment() {
    if (confirm('Apakah Anda yakin ingin membatalkan pembayaran?')) {
        clearInterval(paymentTimer);
        updateTransactionStatus(currentTransaction.id, 'failed');
        showNotification('Pembayaran dibatalkan', 'error');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Download invoice
function downloadInvoice() {
    const invoice = generateInvoiceHTML();
    const blob = new Blob([invoice], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${currentTransaction.invoiceNumber.replace(/\//g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Invoice berhasil diunduh!', 'success');
}

// Generate invoice HTML
function generateInvoiceHTML() {
    const transaction = currentTransaction;
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${transaction.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f4f4f4; }
        .total { font-size: 20px; font-weight: bold; text-align: right; }
        .footer { text-align: center; margin-top: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <h2>AutoPay - Sistem Pembayaran Otomatis</h2>
    </div>
    
    <div class="invoice-details">
        <p><strong>Nomor Invoice:</strong> ${transaction.invoiceNumber}</p>
        <p><strong>ID Transaksi:</strong> ${transaction.id}</p>
        <p><strong>Tanggal:</strong> ${formatDate(transaction.createdAt)}</p>
        <p><strong>Status:</strong> ${transaction.status.toUpperCase()}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th>Deskripsi</th>
                <th>Harga</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${transaction.product.name}</td>
                <td>${transaction.product.description}</td>
                <td>${formatCurrency(transaction.product.price)}</td>
            </tr>
        </tbody>
    </table>
    
    <div class="total">
        Total: ${formatCurrency(transaction.amount)}
    </div>
    
    <div class="footer">
        <p>Terima kasih atas pembayaran Anda!</p>
        <p>&copy; 2025 AutoPay. All rights reserved.</p>
    </div>
</body>
</html>
    `;
}

// Send payment notification to Telegram
async function sendPaymentNotification() {
    const message = `💳 *Pembayaran Baru*\n\n` +
        `📋 Invoice: \`${currentTransaction.invoiceNumber}\`\n` +
        `🆔 ID: \`${currentTransaction.id}\`\n` +
        `📦 Produk: ${currentTransaction.product.name}\n` +
        `💰 Jumlah: ${formatCurrency(currentTransaction.amount)}\n` +
        `💳 Metode: ${CONFIG.paymentMethods[currentTransaction.paymentMethod].name}\n` +
        `📅 Waktu: ${formatDate(currentTransaction.createdAt)}\n` +
        `⏰ Expired: ${formatDate(currentTransaction.expiresAt)}\n` +
        `📊 Status: Menunggu Pembayaran`;

    await sendTelegramNotification(message);
}

// Send success notification to Telegram
async function sendSuccessNotification() {
    const message = `✅ *Pembayaran Berhasil!*\n\n` +
        `📋 Invoice: \`${currentTransaction.invoiceNumber}\`\n` +
        `🆔 ID: \`${currentTransaction.id}\`\n` +
        `📦 Produk: ${currentTransaction.product.name}\n` +
        `💰 Jumlah: ${formatCurrency(currentTransaction.amount)}\n` +
        `💳 Metode: ${CONFIG.paymentMethods[currentTransaction.paymentMethod].name}\n` +
        `📅 Waktu: ${formatDate(new Date().toISOString())}\n` +
        `🎉 Terima kasih atas pembayaran Anda!`;

    await sendTelegramNotification(message);
}
