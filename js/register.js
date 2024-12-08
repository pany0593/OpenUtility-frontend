document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单数据
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value.trim();

        // 表单验证
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
            alert('请输入正确的邮箱地址');
            return;
        }

        // 发送注册请求
        try {
            const response = await fetch('120.24.176.40:80/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    email
                })
            });

            const data1 = await response.json();
            if (data1.base.code === 0) {
                // 注册成功, 保存用户信息
                localStorage.setItem('userInfo', JSON.stringify(data1.data));
                alert('注册成功！');
                // 跳转到登录页面或首页
                window.location.href = 'index.html';  // 你可以根据需要跳转到登录页或其他页面
            } else {
                alert(data1.message || '注册失败');
            }
        } catch (err) {
            console.error('注册失败:', err);
            alert('注册失败,请稍后重试');
        }
    });
});
