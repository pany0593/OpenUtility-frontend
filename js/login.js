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
        const building = document.getElementById('building').value;
        const dormitory = document.getElementById('dormitory').value;
        
        try {
            var myHeaders = new Headers();
             myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
             username: username,
             password: password,
             building: parseInt(building, 10),
             dormitory: parseInt(dormitory, 10)
            });

             var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

            const response=await fetch("http://120.24.176.40:80/api/users/login", requestOptions);
            
            const data = await response.json();
            console.log(data);
            if (data.base.code === 0) {
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