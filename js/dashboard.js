// Dashboard logic

let transactionChart = null;
let paymentMethodChart = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadTransactionChart();
    loadPaymentMethodChart();
    loadRecentTransactions();
    loadProductManagement();
});

// Load dashboard statistics
function loadDashboardStats() {
    const transactions = getTransactions();
    const today = new Date().toDateString();
    
    // Calculate today's revenue
    const todayTransactions = transactions.filter(t => 
        new Date(t.createdAt).toDateString() === today && t.status === 'success'
    );
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Count success transactions
    const successCount = transactions.filter(t => t.status === 'success').length;
    
    // Count pending transactions
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    
    // Count unique customers (simplified - using transaction count)
    const totalCustomers = transactions.length;
    
    // Update UI
    document.getElementById('todayRevenue').textContent = formatCurrency(todayRevenue);
    document.getElementById('successCount').textContent = successCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('totalCustomers').textContent = totalCustomers;
}

// Load transaction chart
function loadTransactionChart() {
    const ctx = document.getElementById('transactionChart');
    if (!ctx) return;
    
    const transactions = getTransactions();
    const last7Days = [];
    const transactionCounts = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }));
        
        // Count transactions for this day
        const dayTransactions = transactions.filter(t => {
            const tDate = new Date(t.createdAt);
            return tDate.toDateString() === date.toDateString() && t.status === 'success';
        });
        transactionCounts.push(dayTransactions.length);
    }
    
    if (transactionChart) {
        transactionChart.destroy();
    }
    
    transactionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Transaksi Sukses',
                data: transactionCounts,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Load payment method chart
function loadPaymentMethodChart() {
    const ctx = document.getElementById('paymentMethodChart');
    if (!ctx) return;
    
    const transactions = getTransactions().filter(t => t.status === 'success');
    const methodCounts = {};
    
    // Count transactions by payment method
    transactions.forEach(t => {
        const method = t.paymentMethod;
        methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    const labels = Object.keys(methodCounts).map(m => CONFIG.paymentMethods[m]?.name || m);
    const data = Object.values(methodCounts);
    const colors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)'
    ];
    
    if (paymentMethodChart) {
        paymentMethodChart.destroy();
    }
    
    paymentMethodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        padding: 15
                    }
                }
            }
        }
    });
}

// Load recent transactions
function loadRecentTransactions(filter = 'all') {
    const transactions = getTransactions();
    const tableBody = document.getElementById('transactionTable');
    
    let filteredTransactions = transactions;
    if (filter !== 'all') {
        filteredTransactions = transactions.filter(t => t.status === filter);
    }
    
    if (filteredTransactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-gray-400">
                    Tidak ada transaksi
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = filteredTransactions.slice(0, 20).map(t => `
        <tr class="border-b border-white/10 hover:bg-white/5 transition">
            <td class="py-3 px-4 font-mono text-sm">${t.id}</td>
            <td class="py-3 px-4">${t.product.name}</td>
            <td class="py-3 px-4">-</td>
            <td class="py-3 px-4">${CONFIG.paymentMethods[t.paymentMethod]?.name || t.paymentMethod}</td>
            <td class="py-3 px-4 font-semibold text-green-400">${formatCurrency(t.amount)}</td>
            <td class="py-3 px-4">${getStatusBadge(t.status)}</td>
            <td class="py-3 px-4 text-sm text-gray-400">${formatDate(t.createdAt)}</td>
            <td class="py-3 px-4">
                <button onclick="viewTransactionDetail('${t.id}')" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
                    Detail
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter transactions
function filterTransactions(filter) {
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600');
        btn.classList.add('bg-white/10', 'hover:bg-white/20');
    });
    event.target.classList.remove('bg-white/10', 'hover:bg-white/20');
    event.target.classList.add('bg-purple-600');
    
    loadRecentTransactions(filter);
}

// View transaction detail
function viewTransactionDetail(transactionId) {
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
        showNotification('Transaksi tidak ditemukan!', 'error');
        return;
    }
    
    const detailDiv = document.getElementById('transactionDetail');
    detailDiv.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between">
                <span class="text-gray-400">ID Transaksi:</span>
                <span class="font-mono font-semibold">${transaction.id}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Invoice:</span>
                <span class="font-semibold">${transaction.invoiceNumber}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Produk:</span>
                <span class="font-semibold">${transaction.product.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Metode Pembayaran:</span>
                <span class="font-semibold">${CONFIG.paymentMethods[transaction.paymentMethod]?.name || transaction.paymentMethod}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Jumlah:</span>
                <span class="font-semibold text-green-400 text-xl">${formatCurrency(transaction.amount)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span>${getStatusBadge(transaction.status)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Dibuat:</span>
                <span class="text-sm">${formatDate(transaction.createdAt)}</span>
            </div>
            ${transaction.expiresAt ? `
            <div class="flex justify-between">
                <span class="text-gray-400">Expired:</span>
                <span class="text-sm">${formatDate(transaction.expiresAt)}</span>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('transactionModal').classList.remove('hidden');
}

// Close transaction modal
function closeTransactionModal() {
    document.getElementById('transactionModal').classList.add('hidden');
}

// Load product management
function loadProductManagement() {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || CONFIG.products;
    const container = document.getElementById('productManagement');
    
    container.innerHTML = products.map(product => `
        <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="flex justify-between items-start mb-4">
                <div class="text-4xl">${product.icon}</div>
                <button onclick="deleteProduct('${product.id}')" class="text-red-400 hover:text-red-300">
                    🗑️
                </button>
            </div>
            <h4 class="text-lg font-bold mb-2">${product.name}</h4>
            <p class="text-gray-400 text-sm mb-3">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-green-400">${formatCurrency(product.price)}</span>
                <button onclick="editProduct('${product.id}')" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
                    Edit
                </button>
            </div>
        </div>
    `).join('');
}

// Show add product modal
function showAddProductModal() {
    document.getElementById('addProductModal').classList.remove('hidden');
}

// Close add product modal
function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
    document.getElementById('addProductForm').reset();
}

// Handle add product form
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: `prod_${Date.now()}`,
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        icon: '📦',
        popular: false
    };
    
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || CONFIG.products;
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    
    closeAddProductModal();
    loadProductManagement();
    showNotification('Produk berhasil ditambahkan!', 'success');
});

// Delete product
function deleteProduct(productId) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)) || CONFIG.products;
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(filtered));
    
    loadProductManagement();
    showNotification('Produk berhasil dihapus!', 'success');
}

// Edit product (simplified - just shows alert for demo)
function editProduct(productId) {
    showNotification('Fitur edit akan segera hadir!', 'info');
}

// Refresh dashboard
function refreshDashboard() {
    showNotification('Memperbarui dashboard...', 'info');
    
    loadDashboardStats();
    loadTransactionChart();
    loadPaymentMethodChart();
    loadRecentTransactions();
    loadProductManagement();
    
    setTimeout(() => {
        showNotification('Dashboard berhasil diperbarui!', 'success');
    }, 1000);
}
