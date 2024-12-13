document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const building = String(urlParams.get('building'));  // 将 building 转为字符串
    const dormitory = String(urlParams.get('dormitory'));  // 将 dormitory 转为字符串
    
    // 打印查看获取的参数值
    // 如果有 building 和 dormitory，则加载用户数据
    if (building && dormitory) {
        loadUserData(building, dormitory);
    } else {
        alert('缺少必要的参数:building 或 dormitory');
        // 可选择跳转回上一页或某个错误页面
        // history.back();
    }
    
    // 表单提交处理
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // 获取表单数据并处理
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const building = document.getElementById('building').value;
        const dormitory = document.getElementById('dormitory').value;
        // 提交或保存更新的用户数据
        // 这里你可以调用一个 API 来更新用户数据
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 根据 building 和 dormitory 查询用户数据
async function loadUserData(building, dormitory) {
    try {
        const token = localStorage.getItem("token");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);

        // 拼接 URL 参数，确保 URL 格式正确
        const url = new URL("http://120.24.176.40:80/api/users/by-room");
        url.searchParams.append("building", building);
        url.searchParams.append("dormitory", dormitory);

        console.log('Request URL:', url.href);
        console.log('Building:', building);
        console.log('Dormitory:', dormitory);

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        // 发送请求并处理响应
        const response = await fetch(url.href, requestOptions);
        const data = await response.json();

        console.log(data);

        // 判断返回数据是否正常
        if (data.base.code === 0) {
            const user = data.data[0];  // 获取返回的第一个用户数据对象
            // 将返回的用户数据填充到表单中
            console.log(user);
            document.getElementById('username').value = user.username;
            document.getElementById('building').value = user.building;
            document.getElementById('roomNumber').value = user.dormitory;
            document.getElementById('email').value = user.email;
        } else {
           // throw new Error(data.message || '获取用户数据失败');
        }
    } catch (err) {
        console.error('加载用户数据失败:', err);
       // alert('加载用户数据失败，请稍后重试');
    }
}


// 表单验证
function validateForm() {
    const username = document.getElementById('username').value.trim();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (username.length < 4) {
        alert('用户名至少需要4个字符');
        return false;
    }


    if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
        alert('请输入正确的邮箱地址');
        return false;
    }

    if (password && password.length < 6) {
        alert('密码长度不能小于6位');
        return false;
    }

    return true;
}

// 保存用户
function saveUser() {
    const formData = new FormData(document.getElementById('userForm'));
    const userData = Object.fromEntries(formData.entries());
    
    // 这里添加保存用户的逻辑
    console.log('保存用户数据:', userData);
    alert('保存成功！');
    
    // 返回用户列表页面
    window.location.href = 'admin-users.html';
}