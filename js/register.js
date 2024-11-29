document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单数据
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value.trim();

        // 表单验证
        if (password !== document.getElementById('confirmPassword').value) {
            alert('两次输入的密码不一致');
            return;
        }

        if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
            alert('请输入正确的邮箱地址');
            return;
        }

        try {
            // 发送注册请求
            const response = await fetch('/users/register', {
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

            const data = await response.json();
            
            if (data.code === 0) {
                // 注册成功,保存用户信息
                localStorage.setItem('userInfo', JSON.stringify(data.data));
                alert('注册成功！');
                // 跳转到登录页面
                window.location.href = 'index.html';
            } else {
                alert(data.message || '注册失败');
            }
        } catch (err) {
            console.error('注册失败:', err);
            alert('注册失败,请稍后重试');
        }
    });
}); 