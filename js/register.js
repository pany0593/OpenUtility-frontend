document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单数据
        const building = document.getElementById('building').value;
        const dormitory = document.getElementById('dormitory').value;
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
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
               id:"string",
               username: username,
               password: password,
               email: email,
               building: parseInt(building, 10),
               dormitory: parseInt(dormitory, 10)
            });
           // console.log(id);
            var requestOptions = {
               method: 'POST',
               headers: myHeaders,
               body: raw,
               redirect: 'follow'
            };
            
            const response = await fetch("http://120.24.176.40:80/api/users/register", requestOptions);

            const data1 = await response.json();
            console.log(data1);
            data1.base.code=0;
            if (data1.base.code === 0) {
                // 注册成功,保存用户信息
                localStorage.setItem('userInfo', JSON.stringify(data1.data));
                alert('注册成功！');
                // 跳转到登录页面
                window.location.href = 'index.html';
            } else {
                alert(data1.message || '注册失败');
            }
        } catch (err) {
            console.error('注册失败:', err);
            alert('注册失败,请稍后重试');
        }
    });
}); 