document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取表单元素
    const publishForm = document.getElementById('publishForm');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const charCount = document.querySelector('.char-count');
    const importantCheckbox = document.getElementById('important');
    const notificationCheckbox = document.getElementById('sendNotification');

    // 更新字数统计
    function updateCharCount() {
        const count = contentInput.value.length;
        charCount.textContent = `${count}/2000`;
        
        // 更新字数颜色
        if (count > 2000) {
            charCount.style.color = '#ff4d4f';
        } else {
            charCount.style.color = '#666';
        }
    }

    // 监听内容输入
    contentInput.addEventListener('input', updateCharCount);

    // 表单提交处理
    publishForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 获取表单数据
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const isImportant = importantCheckbox.checked;
        const sendNotification = notificationCheckbox.checked;

        // 表单验证
        if (title.length < 4) {
            alert('标题至少需要4个字符');
            return;
        }

        if (content.length < 10) {
            alert('内容至少需要10个字符');
            return;
        }

        if (content.length > 2000) {
            alert('内容不能超过2000个字符');
            return;
        }

        // 收集表单数据
        const announcementData = {
            title,
            content,
            isImportant,
            sendNotification,
            timestamp: new Date().toISOString(),
            publisher: '管理员'
        };

        // 这里添加发布公告的逻辑
        console.log('发布公告:', announcementData);

        // 将公告数据存储到 localStorage
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements.unshift(announcementData); // 新公告添加到列表开头
        localStorage.setItem('announcements', JSON.stringify(announcements));

        // 发布成功后跳转
        alert('公告发布成功！');
        window.location.href = 'admin-announcements.html';
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
}); 