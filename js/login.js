document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.querySelector('.register-btn');
    const adminLoginBtn = document.querySelector('.admin-login-btn');
    const forgetPwdLink = document.querySelector('.forget-pwd');

    registerBtn.addEventListener('click', function() {
        window.location.href = 'register.html';
    });

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (data.code === 0) {
                // 登录成功,保存token
                localStorage.setItem('token', data.token);
                window.location.href = 'main.html';
            } else {
                alert(data.message || '登录失败');
            }
        } catch (err) {
            console.error('登录失败:', err);
            alert('登录失败,请稍后重试');
        }
    });

    adminLoginBtn.addEventListener('click', function() {
        // 跳转到管理员登录页面
        window.location.href = 'admin-login.html';
    });

    forgetPwdLink.addEventListener('click', function(e) {
        e.preventDefault();
        // 跳转到忘记密码页面
        window.location.href = 'forget-password.html';
    });
}); 