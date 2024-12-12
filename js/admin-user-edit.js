document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取URL参数中的用户ID
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // 如果有用户ID，则加载用户数据
    if (userId) {
        await loadUserData(userId);
    } else {
        alert('未找到要编辑的用户');
        history.back();
    }

    // 表单提交处理
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // 获取表单数据并处理
        // ...
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 加载用户数据
async function loadUserData(userId) {
    try {
        const response = await fetch(`/users/${userId}`);
        const data = await response.json();

        if (data.code === 0) {
            const user = data.data;
            document.getElementById('username').value = user.username;
            document.getElementById('building').value = user.building;
            document.getElementById('dormitory').value = user.dormitory;
            document.getElementById('email').value = user.email;
        } else {
            throw new Error(data.message || '获取用户数据失败');
        }
    } catch (err) {
        console.error('加载用户数据失败:', err);
        alert('加载用户数据失败，请稍后重试');
        history.back();
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