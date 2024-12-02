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

        // 构建发帖数据
        const postData = {
            title,
            authorId: userInfo.id || '未知用户',  // 用户ID
            authorName: userInfo.name || '匿名', // 用户名
            desc: content.substring(0, 200), // 取前200字作为描述
            content,
            tag,
            timestamp: new Date().toISOString()
        };

        // 使用fetch发送发帖请求
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(postData);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            // 发送请求到后端接口
            const response = await fetch("http://120.24.176.40:80/api/post/article_add", requestOptions);
            const data = await response.json();
            
            if (data.base.code != 0) {
               // console.log(data.data); // 打印获取的数据
                alert('发布成功！');
                window.location.href = 'forum-posts.html';  // 发布成功后跳转到帖子列表
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
            window.location.href = 'forum-posts.html';  // 取消时跳转回帖子列表
        }
    });

    // 退出登录
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';  // 退出登录后跳转到首页
            }
        });
    }
});
