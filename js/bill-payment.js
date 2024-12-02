document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 缴费按钮点击事件
    setupPaymentButtons();

    // 详情按钮点击事件
    setupDetailButtons();

    // 支付方式选择
    setupPaymentMethods();

    // 退出登录功能
    setupLogoutHandler();
});

// 设置缴费按钮事件
function setupPaymentButtons() {
    const payButtons = document.querySelectorAll('.pay-btn');
    const paymentMethods = document.querySelector('.payment-methods');

    payButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 显示支付方式选择面板
            if (paymentMethods) {
                paymentMethods.style.display = 'block';
                // 滚动到支付方式区域
                paymentMethods.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 设置详情按钮事件
function setupDetailButtons() {
    const detailButtons = document.querySelectorAll('.detail-btn');
    
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const month = row.querySelector('td:first-child').textContent;
            const total = row.querySelector('td:nth-child(4)').textContent;
            
            alert(`${month}账单详情：\n总金额：${total}\n支付时间：2024-02-15 14:30:25\n支付方式：微信支付`);
        });
    });
}

// 设置支付方式选择
function setupPaymentMethods() {
    const methodItems = document.querySelectorAll('.method-item');
    
    methodItems.forEach(item => {
        item.addEventListener('click', function() {
            const method = this.dataset.method;
            console.log(`选择了${method}支付方式`);
            // 这里添加实际的支付逻辑
        });
    });
}

// 设置退出登录
function setupLogoutHandler() {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';
            }
        });
    }
} 