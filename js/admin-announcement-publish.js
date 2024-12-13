document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "http://120.24.176.40:80/api/post/notice_add";

    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取表单元素
    const publishForm = document.getElementById('publishForm');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const charCount = document.querySelector('.char-count');


    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // 更新字数统计
    function updateCharCount() {
        const count = contentInput.value.length;
        charCount.textContent = `${count}/2000`;
        
        // 更新字数颜色
        charCount.style.color = count > 2000 ? '#ff4d4f' : '#666';
    }

    // 监听内容输入
    contentInput.addEventListener('input', updateCharCount);

    // 表单提交处理
    publishForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        console.log("userInfo.id:",userInfo.id);
        console.log("userInfo.name:",userInfo.username);
        

        // 获取表单数据
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const authorId = userInfo.id; 
        const authorName = userInfo.username; 
        const desc = content.length > 10 ? content.substring(0, 10) + "..." : content; // 简介

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
            authorId,
            authorName,
            desc,
            content
        };

        // 调用后端接口发布公告
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(announcementData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.base.code === 0) {
                    alert('公告发布成功！');
                    window.location.href = 'admin-announcements.html';
                } else {
                    alert(`发布失败: ${data.base.message}`);
                }
            })
            .catch((error) => {
                console.error("发布公告时出错:", error);
                alert('发布公告时发生错误，请稍后再试！');
            });
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});
