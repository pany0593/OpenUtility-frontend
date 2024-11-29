document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 获取表单元素
    const presetForm = document.getElementById('presetForm');
    const alertForm = document.getElementById('alertForm');
    const cancelBtn = document.querySelector('.cancel-btn');

    // 加载已保存的设置
    loadSavedSettings();

    // 表单提交处理
    presetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            expectedWater: document.getElementById('expectedWater').value,
            expectedElectric: document.getElementById('expectedElectric').value,
            alertThreshold: document.getElementById('alertThreshold').value,
            emailAlert: document.getElementById('emailAlert').checked,
            smsAlert: document.getElementById('smsAlert').checked
        };

        // 验证数据
        if (!validateFormData(formData)) {
            return;
        }

        // 保存设置
        saveSettings(formData);
    });

    // 取消按钮处理
    cancelBtn.addEventListener('click', function() {
        if (confirm('确定要取消设置吗？未保存的更改将会丢失。')) {
            loadSavedSettings(); // 重新加载已保存的设置
        }
    });

    // 退出登录
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if(confirm('确定要退出登录吗？')) {
            window.location.href = 'index.html';
        }
    });
});

// 加载已保存的设置
function loadSavedSettings() {
    // 这里模拟从后端加载数据
    const savedSettings = {
        expectedWater: 50,
        expectedElectric: 100,
        alertThreshold: 200,
        emailAlert: true,
        smsAlert: true
    };

    // 填充表单
    document.getElementById('expectedWater').value = savedSettings.expectedWater;
    document.getElementById('expectedElectric').value = savedSettings.expectedElectric;
    document.getElementById('alertThreshold').value = savedSettings.alertThreshold;
    document.getElementById('emailAlert').checked = savedSettings.emailAlert;
    document.getElementById('smsAlert').checked = savedSettings.smsAlert;
}

// 验证表单数据
function validateFormData(data) {
    if (!data.expectedWater || data.expectedWater < 0) {
        alert('请输入有效的预计水费');
        return false;
    }
    if (!data.expectedElectric || data.expectedElectric < 0) {
        alert('请输入有效的预计电费');
        return false;
    }
    if (!data.alertThreshold || data.alertThreshold < 0) {
        alert('请输入有效的提醒阈值');
        return false;
    }
    return true;
}

// 保存设置
function saveSettings(data) {
    // 这里添加保存设置的逻辑
    console.log('保存设置:', data);
    alert('设置保存成功！');
} 