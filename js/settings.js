document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 获取当前用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // 填充用户信息
    if (userInfo) {
        document.getElementById('username').value = userInfo.username || '';
        document.getElementById('building').value = userInfo.building || '';
        document.getElementById('dormitory').value = userInfo.dormitory || '';
        document.getElementById('email').value = userInfo.email || '';
    }

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'index.html';
        }
    });

    // 密码修改表单提交
    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 表单验证
        if (newPassword !== confirmPassword) {
            alert('两次输入的新密码不一致');
            return;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(newPassword)) {
            alert('新密码必须包含字母和数字，长度6-20位');
            return;
        }

        try {
            const response = await fetch('/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword
                })
            });

            const data = await response.json();
            
            if (data.code === 0) {
                alert('密码修改成功！');
                hidePasswordModal();
            } else {
                throw new Error(data.message || '密码修改失败');
            }
        } catch (err) {
            console.error('密码修改失败:', err);
            alert(err.message || '密码修改失败，请稍后重试');
        }
    });
});

// 显示密码修改模态框
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'block';
    
    // 清空表单
    document.getElementById('passwordForm').reset();
}

// 隐藏密码修改模态框
function hidePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('passwordModal');
    if (event.target === modal) {
        hidePasswordModal();
    }
} 