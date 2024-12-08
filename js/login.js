document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.querySelector('.register-btn');
    const adminLoginBtn = document.querySelector('.admin-login-btn');
    const forgetPwdLink = document.querySelector('.forget-pwd');

    // 点击注册按钮跳转到注册页面
    registerBtn.addEventListener('click', function () {
        window.location.href = 'register.html';
    });

    // 点击管理员登录按钮跳转到管理员登录页面
    adminLoginBtn.addEventListener('click', function () {
        window.location.href = 'admin-login.html';
    });

    // 点击忘记密码链接跳转到忘记密码页面
    forgetPwdLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'forget-password.html';
    });

    // 登录表单提交处理
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 防止表单默认提交行为

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // 简单表单验证：确保用户名和密码非空
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }

        // 发送登录请求
        try {
            const response = await fetch('120.24.176.40:80/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            // 获取响应数据
            const data1 = await response.json();
            if (data1.base.code === 0) {
                // 登录成功
                localStorage.setItem('token', data1.token);  // 保存 token
                localStorage.setItem('userInfo', JSON.stringify(data1.data));  // 保存用户信息
                alert('登录成功！');
                window.location.href = 'main.html';  // 跳转到主页面
            } else {
                // 登录失败
                alert(data1.message || '登录失败');
            }
        } catch (err) {
            console.error('登录失败:', err);
            alert('登录失败，请稍后重试');
        }
    });
});
