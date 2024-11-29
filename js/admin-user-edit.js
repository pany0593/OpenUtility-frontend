document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取URL参数中的用户ID
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // 如果有用户ID，则加载用户数据
    if (userId) {
        loadUserData(userId);
        document.querySelector('.top-bar h1').textContent = '编辑用户';
    } else {
        document.querySelector('.top-bar h1').textContent = '添加用户';
    }

    // 表单提交处理
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            saveUser();
        }
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 加载用户数据
function loadUserData(userId) {
    // 这里模拟从后端获取用户数据
    const userData = {
        username: 'zhangsan',
        realName: '张三',
        studentId: '2021001',
        building: '1',
        roomNumber: '101',
        phone: '13812345678',
        email: 'zhangsan@example.com',
        status: 'active'
    };

    // 填充表单
    Object.keys(userData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = userData[key];
        }
    });
}

// 表单验证
function validateForm() {
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (username.length < 4) {
        alert('用户名至少需要4个字符');
        return false;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号');
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