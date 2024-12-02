document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 定期更新系统状态
    updateSystemStatus();
    setInterval(updateSystemStatus, 30000); // 每30秒更新一次

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 更新系统状态
function updateSystemStatus() {
    // 这里模拟从后端获取系统状态数据
    const systemStatus = {
        cpu: Math.floor(Math.random() * 30) + 30, // 30-60%
        memory: Math.floor(Math.random() * 20) + 50, // 50-70%
        disk: Math.floor(Math.random() * 15) + 65 // 65-80%
    };

    // 更新进度条
    updateProgressBar('CPU使用率', systemStatus.cpu);
    updateProgressBar('内存使用率', systemStatus.memory);
    updateProgressBar('磁盘使用率', systemStatus.disk);
}

// 更新进度条
function updateProgressBar(label, value) {
    const statusItem = Array.from(document.querySelectorAll('.status-item'))
        .find(item => item.querySelector('.status-label').textContent === label);
    
    if (statusItem) {
        const progressBar = statusItem.querySelector('.progress');
        const statusValue = statusItem.querySelector('.status-value');
        
        progressBar.style.width = `${value}%`;
        statusValue.textContent = `${value}%`;
        
        // 根据使用率设置颜色
        if (value >= 80) {
            progressBar.style.backgroundColor = '#ff4d4f';
        } else if (value >= 60) {
            progressBar.style.backgroundColor = '#faad14';
        } else {
            progressBar.style.backgroundColor = 'rgb(57, 98, 214)';
        }
    }
} 