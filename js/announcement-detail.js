document.addEventListener('DOMContentLoaded', async function () {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 从URL获取公告ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    console.log('公告ID:', articleId);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // 退出登录逻辑
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.href = 'index.html';
            }
        });
    }

    // 加载公告内容
    await loadPostDetail(articleId);

    // 加载公告详情
    async function loadPostDetail(articleId) {
        try {
            const response = await fetch('http://120.24.176.40:80/api/post/notice_get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "noticeId": articleId })
            });

            if (!response.ok) {
                throw new Error(`HTTP 错误，状态码: ${response.status}`);
            }

            const result = await response.json();

            if (result.base.code === 0 && result.data) {
                const post = result.data;

                if (post) {
                    // 填充帖子内容
                    document.querySelector('.post-title').textContent = post.title;
                    document.querySelector('.author').textContent = `作者：${post.authorName}`;
                    document.querySelector('.time').textContent = `发布时间：${post.createTime}`;
                    document.querySelector('.post-text').textContent = post.content;

                    // 保存当前帖子ID
                    window.currentArticleId = post.noticeId;

                    // 如果是管理员，显示“修改公告”按钮
                    if (userInfo.username === 'admin') {
                        showModifyButton(post);
                    }
                } else {
                    throw new Error('公告数据为空或无效');
                }
            } else {
                throw new Error(result.base.message || '获取帖子失败');
            }
        } catch (err) {
            console.error('加载公告失败:', err);
            alert('加载公告失败，请稍后重试');
        }
    }

    // 显示“修改公告”按钮
    function showModifyButton(post) {
        const actionsContainer = document.querySelector('.post-actions');
        if (!actionsContainer) {
            console.error('未找到 .post-actions 容器，无法显示修改按钮');
            return;
        }

        const modifyButton = document.createElement('button');
        modifyButton.textContent = '修改公告';
        modifyButton.classList.add('modify-btn');
        actionsContainer.appendChild(modifyButton);

        // 添加点击事件
        modifyButton.addEventListener('click', () => {
            showModifyModal(post); // 显示修改弹窗
        });
    }

    // 显示修改公告弹窗
    function showModifyModal(post) {
        console.log('正在显示修改公告弹窗');
    
        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        document.body.appendChild(overlay);
    
        // 创建模态框
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>修改公告</h2>
                <label for="new-title">标题：</label>
                <input type="text" id="new-title" value="${post.title}" />
                <label for="new-content">内容：</label>
                <textarea id="new-content">${post.content}</textarea>
                <button id="confirm-modify">确认修改</button>
                <button id="cancel-modify">取消</button>
            </div>
        `;
        document.body.appendChild(modal);
    
        // 禁用背景滚动
        document.body.classList.add('modal-open');
    
        console.log('弹窗已插入 DOM');
    
        // 绑定按钮事件
        const confirmButton = document.getElementById('confirm-modify');
        const cancelButton = document.getElementById('cancel-modify');
    
        if (confirmButton && cancelButton) {
            confirmButton.addEventListener('click', async () => {
                console.log('点击确认修改按钮');
                const newTitle = document.getElementById('new-title').value.trim();
                const newContent = document.getElementById('new-content').value.trim();
                const newDesc = newContent.substring(0, 10)+"..."; // 自动截取内容前10个字符
    
                if (!newTitle || !newContent) {
                    alert('标题或内容不能为空！');
                    return;
                }
    
                try {
                    const response = await fetch('http://120.24.176.40:80/api/post/notice_update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            articleId: window.currentArticleId,
                            title: newTitle,
                            desc: newDesc,
                            content: newContent
                        })
                    });
    
                    const result = await response.json();
                    console.log('修改接口返回数据:', result);
    
                    if (result.base.code === 0) {
                        alert('公告修改成功！');
                        window.location.href = 'admin-announcements.html'; // 跳转到公告列表页面
                    } else {
                        alert(`修改失败：${result.base.message}`);
                    }
                } catch (err) {
                    console.error('修改公告失败:', err);
                    alert('修改公告时发生错误，请稍后重试！');
                } finally {
                    closeModal(modal, overlay); // 关闭弹窗
                }
            });
    
            cancelButton.addEventListener('click', () => {
                console.log('点击取消修改按钮');
                closeModal(modal, overlay); // 关闭弹窗
            });
        } else {
            console.error('未找到确认或取消按钮');
        }
    }
    
    // 关闭模态框及遮罩
    function closeModal(modal, overlay) {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
        document.body.classList.remove('modal-open'); // 恢复背景滚动
    }
    




});
