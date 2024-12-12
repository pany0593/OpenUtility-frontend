document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const backBtn = document.querySelector('.back-btn');
    
    // 管理员登录表单提交
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const building = document.getElementById('building').value || 0; // 默认值为0
        const dormitory = document.getElementById('dormitory').value || 0; // 默认值为0
        
        // 发送登录请求
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, building, dormitory })
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                // 登录成功，跳转到管理员主页
                window.location.href = 'admin.html';
            } else {
                alert('用户名或密码错误！');
            }
        })
        .catch(err => {
            console.error('登录失败:', err);
            alert('登录失败，请稍后重试');
        });
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