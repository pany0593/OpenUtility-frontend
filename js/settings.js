document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 获取当前用户ID
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.id;
    /*
    if (!userId) {
        alert('请先登录');
        window.location.href = 'index.html';
        return;
    }*/

    // 加载用户信息
    try {
        const response = await fetch(`/users/${userId}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.code === 0) {
            // 填充用户信息
            fillUserProfile(data.data);
        } else {
            throw new Error(data.message || '获取用户信息失败');
        }
    } catch (err) {
        console.error('加载用户信息失败:', err);
        alert('加载用户信息失败，请稍后重试');
    }

    // 头像上传处理
    const avatarInput = document.getElementById('avatarInput');
    const currentAvatar = document.querySelector('.current-avatar');

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (validateImage(file)) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentAvatar.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // 个人信息表单提交
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveProfile(userId);
    });

    // 修改手机号/邮箱按钮
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.closest('.edit-field').querySelector('input').id;
            handleFieldEdit(field);
        });
    });

    // 通知设置开关
    document.querySelectorAll('.switch input').forEach(switchInput => {
        switchInput.addEventListener('change', function() {
            const setting = this.closest('.switch-group').querySelector('.switch-label').textContent;
            updateNotificationSetting(setting, this.checked);
        });
    });

    // 退出登录
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if(confirm('确定要退出登录吗？')) {
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

// 验证图片
function validateImage(file) {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        alert('请上传jpg或png格式的图片');
        return false;
    }

    // 验证文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return false;
    }

    return true;
}

// 填充用户信息
function fillUserProfile(profileData) {
    // 设置头像
    const currentAvatar = document.querySelector('.current-avatar');
    if (profileData.avatar) {
        currentAvatar.src = profileData.avatar;
    }

    // 设置用户名
    document.querySelector('.username').textContent = profileData.name || '';

    // 设置手机号和邮箱
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    if (phoneInput) {
        phoneInput.value = profileData.phone || '';
    }
    if (emailInput) {
        emailInput.value = profileData.email || '';
    }

    // 设置通知开关状态
    const notificationSettings = profileData.notifications || {};
    document.querySelectorAll('.switch input').forEach(switchInput => {
        const setting = switchInput.closest('.switch-group')
            .querySelector('.switch-label').textContent;
        switchInput.checked = notificationSettings[setting] !== false;
    });
}

// 保存个人信息
async function saveProfile(userId) {
    const formData = new FormData(document.getElementById('profileForm'));
    const profileData = {
        name: formData.get('username'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        notifications: {}
    };

    // 获取通知设置
    document.querySelectorAll('.switch input').forEach(switchInput => {
        const setting = switchInput.closest('.switch-group')
            .querySelector('.switch-label').textContent;
        profileData.notifications[setting] = switchInput.checked;
    });

    try {
        const response = await fetch(`/users/${userId}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();
        
        if (data.code === 0) {
            alert('保存成功！');
            // 更新本地存储的用户信息
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            userInfo.name = profileData.name;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            throw new Error(data.message || '保存失败');
        }
    } catch (err) {
        console.error('保存个人信息失败:', err);
        alert('保存失败，请稍后重试');
    }
}

// 处理字段编辑
function handleFieldEdit(field) {
    const input = document.getElementById(field);
    const editField = input.closest('.edit-field');
    const editBtn = editField.querySelector('.edit-btn');
    const verifyGroup = editField.querySelector('.verify-group');
    const verifyBtn = editField.querySelector('.verify-btn');
    const saveBtn = editField.querySelector('.save-btn');
    const cancelBtn = editField.querySelector('.cancel-btn');

    // 显示验证码输入区域
    editBtn.style.display = 'none';
    verifyGroup.style.display = 'flex';
    input.readOnly = false;

    // 获取验证码
    let countdown = 60;
    verifyBtn.addEventListener('click', function() {
        if (this.disabled) return;

        // 发送验证码
        sendVerificationCode(field);

        // 开始倒计时
        this.disabled = true;
        const timer = setInterval(() => {
            if (countdown > 0) {
                this.textContent = `重新获取(${countdown}s)`;
                countdown--;
            } else {
                clearInterval(timer);
                this.disabled = false;
                this.textContent = '获取验证码';
                countdown = 60;
            }
        }, 1000);
    });

    // 保存修改
    saveBtn.addEventListener('click', function() {
        const verifyCode = editField.querySelector('.verify-code').value;
        if (!verifyCode) {
            alert('请输入验证码');
            return;
        }

        saveFieldEdit(field, input.value, verifyCode);
        resetEditState(editField);
    });

    // 取消修改
    cancelBtn.addEventListener('click', function() {
        resetEditState(editField);
    });
}

// 发送验证码
function sendVerificationCode(field) {
    // 这里添加发送验证码的逻辑
    console.log('发送验证码到:', field);
    alert('验证码已发送，请注意查收');
}

// 保存字段编辑
function saveFieldEdit(field, value, code) {
    // 这里添加保存修改的逻辑
    console.log('保存修改:', { field, value, code });
    alert('修改成功！');
}

// 重置编辑状态
function resetEditState(editField) {
    const input = editField.querySelector('input[type="tel"], input[type="email"]');
    const editBtn = editField.querySelector('.edit-btn');
    const verifyGroup = editField.querySelector('.verify-group');

    input.readOnly = true;
    editBtn.style.display = 'block';
    verifyGroup.style.display = 'none';
    
    // 重置验证码输入
    const verifyInput = editField.querySelector('.verify-code');
    if (verifyInput) {
        verifyInput.value = '';
    }
    
    // 重置验证码按钮
    const verifyBtn = editField.querySelector('.verify-btn');
    if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.textContent = '获取验证码';
    }
}

// 更新通知设置
function updateNotificationSetting(setting, enabled) {
    console.log('更新通知设置:', setting, enabled);
    // 这里添加更新设置的逻辑
}

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