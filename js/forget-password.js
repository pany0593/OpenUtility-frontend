document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const getCodeBtn = document.querySelector('.get-code-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // 验证码倒计时
    let countdown = 60;
    let timer = null;
    
    // 获取验证码
    getCodeBtn.addEventListener('click', function() {
        const contact = document.getElementById('contact').value;
        if (!contact) {
            alert('请输入手机号或邮箱');
            return;
        }
        
        // 开始倒计时
        this.disabled = true;
        timer = setInterval(() => {
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
        
        // 这里添加发送验证码的逻辑
        console.log('发送验证码到:', contact);
    });
    
    // 表单提交
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        // 这里添加重置密码的逻辑
        console.log('重置密码成功');
        
        // 重置成功后返回登录页面
        window.location.href = 'index.html';
    });
    
    // 取消按钮
    cancelBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}); 