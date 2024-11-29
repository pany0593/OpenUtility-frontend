document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 获取表单元素
    const postForm = document.getElementById('postForm');
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const charCount = document.querySelector('.char-count');
    const cancelBtn = document.querySelector('.cancel-btn');

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
    postForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单数据
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const tag = document.querySelector('input[name="tag"]:checked')?.value;

        // 从localStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        // 表单验证
        if (title.length < 4) {
            alert('标题至少需要4个字符');
            return;
        }

        if (content.length < 10) {
            alert('内容至少需要10个字符');
            return;
        }



        try {
            // 构建发帖数据
            const postData = {
                title,
                authorId: userInfo.id || '',  // 用户ID
                authorName: userInfo.name || '', // 用户名
                desc: content.substring(0, 200), // 取前200字作为描述
                content,
                tag,
                timestamp: new Date().toISOString()
            };

            // 发送发帖请求
            const response = await fetch('/post/article_add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            
            if (data.code === 0) {
                alert('发布成功！');
                window.location.href = 'forum-posts.html';
            } else {
                alert(data.message || '发布失败');
            }
        } catch (err) {
            console.error('发布失败:', err);
            alert('发布失败,请稍后重试');
        }
    });

    // 取消按钮处理
    cancelBtn.addEventListener('click', function() {
        if (confirm('确定要取消发帖吗？已输入的内容将会丢失。')) {
            window.location.href = 'forum-posts.html';
        }
    });

    // 退出登录
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';
            }
        });
    }
}); 