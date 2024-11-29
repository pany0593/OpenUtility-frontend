document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const backBtn = document.querySelector('.back-btn');
    
    // 管理员登录表单提交
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 这里添加管理员登录验证逻辑
        if (validateAdminLogin(username, password)) {
            // 登录成功，跳转到管理员主页
            window.location.href = 'admin.html';
        } else {
            alert('用户名或密码错误！');
        }
    });

    // 返回用户登录页面
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

// 验证管理员登录
function validateAdminLogin(username, password) {
    // 这里添加实际的管理员登录验证逻辑
    if (username === '666' && password === '666666') {
        return true;
    } else {
        return false;
    }
} 