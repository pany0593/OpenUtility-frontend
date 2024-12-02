document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 从URL获取帖子ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        alert('未找到帖子');
        window.location.href = 'forum-posts.html';
        return;
    }


    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';
            }
        });
    }

    // 加载帖子内容
    await loadPostDetail(articleId);
    // 加载评论
    await loadComments(articleId);

    // 点赞按钮事件
    document.querySelector('.like-btn').addEventListener('click', async () => {
        try {
            const response = await fetch('/post/article_like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ articleId })
            });

            const data = await response.json();
            if (data.code === 0) {
                const likeBtn = document.querySelector('.like-btn');
                likeBtn.classList.toggle('liked');
                const likeCount = likeBtn.querySelector('.like-count');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            }
        } catch (err) {
            console.error('点赞失败:', err);
        }
    });

    // 发表评论
    document.querySelector('.submit-comment').addEventListener('click', async () => {
        const content = document.getElementById('commentContent').value.trim();
        if (!content) {
            alert('请输入评论内容');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        try {
            const response = await fetch('/post/comment_add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fatherId: currentArticleId,
                    userId: userInfo.id,
                    userName: userInfo.name,
                    content
                })
            });

            const data = await response.json();
            if (data.code === 0) {
                // 清空输入框
                document.getElementById('commentContent').value = '';
                
                // 构造新评论数据
                const newComment = {
                    commentId: data.data.commentId,
                    fatherId: data.data.fatherId,
                    userId: data.data.userId,
                    userName: data.data.userName,
                    content: data.data.content,
                    createTime: new Date().toISOString(),
                    likes: 0,
                    level: 0
                };

                // 将新评论添加到评论列表顶部
                const commentList = document.querySelector('.comment-list');
                const newCommentHtml = `
                    <div class="comment-item" data-id="${newComment.commentId}">
                        <div class="comment-header">
                            <div class="comment-info">
                                <span class="comment-author">${newComment.userName}</span>
                                <span class="comment-time">${formatDate(newComment.createTime)}</span>
                            </div>
                            <div class="comment-actions">
                                <button class="comment-like-btn" onclick="likeComment('${newComment.commentId}')">
                                    <span class="like-count">0</span> 赞
                                </button>
                                <button class="delete-btn" onclick="deleteComment('${newComment.commentId}')">删除</button>
                            </div>
                        </div>
                        <div class="comment-content">${newComment.content}</div>
                    </div>
                `;
                
                // 在评论列表开头插入新评论
                commentList.insertAdjacentHTML('afterbegin', newCommentHtml);
                
                // 滚动到新评论
                const newCommentElement = commentList.firstElementChild;
                newCommentElement.scrollIntoView({ behavior: 'smooth' });
                
                // 添加高亮效果
                newCommentElement.classList.add('new-comment');
                setTimeout(() => {
                    newCommentElement.classList.remove('new-comment');
                }, 2000);
            } else {
                alert(data.message || '发表评论失败');
            }
        } catch (err) {
            console.error('发表评论失败:', err);
            alert('发表评论失败，请稍后重试');
        }
    });
});

// 加载帖子详情
async function loadPostDetail(articleId) {
    try {
        // 发送请求获取帖子详情
        const response = await fetch('/post/article_get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleId })
        });

        const data = await response.json();
        
        if (data.code === '0') { // 注意：code是string类型
            const post = data.data;
            // 填充帖子内容
            document.querySelector('.post-title').textContent = post.title;
            document.querySelector('.author').textContent = `作者：${post.authorName}`;
            document.querySelector('.time').textContent = formatDate(post.CreateTime); // 注意：首字母大写
            document.querySelector('.post-text').textContent = post.content;
            document.querySelector('.like-count').textContent = post.likes;
            
            // 保存当前帖子ID，供评论使用
            window.currentArticleId = post.articleId;
            
            // 更新浏览量（如果需要显示的话）
            if (post.clicks !== undefined) {
                // 可以添加浏览量显示
                console.log('浏览量：', post.clicks);
            }
        } else {
            throw new Error(data.message || '获取帖子失败');
        }
    } catch (err) {
        console.error('加载帖子失败:', err);
        alert('加载帖子失败，请稍后重试');
    }
}

// 加载评论列表
async function loadComments(articleId) {
    try {
        // 模拟从后端获取的评论数据
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const mockComments = {
            code: 0,
            data: {
                comment: [
                    {
                        commentId: "1",
                        fatherId: articleId,
                        userId: userInfo.id,
                        userName: userInfo.name,
                        content: "这些建议很实用，特别是空调的使用技巧，已经开始尝试了！",
                        createTime: "2024-11-29T11:00:00",
                        likes: 8,
                        level: 0
                    },
                    {
                        commentId: "2",
                        fatherId: articleId,
                        userId: "user2",
                        userName: "王五",
                        content: "我们宿舍按这个方法试了一个月，电费确实降低了不少。",
                        createTime: "2024-11-29T11:30:00",
                        likes: 5,
                        level: 0,
                        subComment: [
                            {
                                commentId: "3",
                                fatherId: "2",
                                userId: "user3",
                                userName: "赵六",
                                content: "能分享具体降低了多少吗？",
                                createTime: "2024-11-29T12:00:00",
                                likes: 2,
                                level: 0
                            }
                        ]
                    }
                ]
            }
        };

        const data = mockComments;
        
        if (data.code === 0) {
            renderComments(data.data.comment);
        }
    } catch (err) {
        console.error('加载评论失败:', err);
    }
}

// 渲染评论列表
function renderComments(comments) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const commentList = document.querySelector('.comment-list');
    
    commentList.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.commentId}">
            <div class="comment-header">
                <div class="comment-info">
                    <span class="comment-author">${comment.userName}</span>
                    <span class="comment-time">${formatDate(comment.createTime)}</span>
                </div>
                <div class="comment-actions">
                    <button class="comment-like-btn" onclick="likeComment('${comment.commentId}')">
                        <span class="like-count">${comment.likes || 0}</span> 赞
                    </button>
                    ${comment.userId === userInfo.id ? 
                        `<button class="delete-btn" onclick="deleteComment('${comment.commentId}')">删除</button>` 
                        : ''
                    }
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
            ${comment.subComment ? renderSubComments(comment.subComment, userInfo.id) : ''}
        </div>
    `).join('');
}

// 渲染子评论
function renderSubComments(subComments, currentUserId) {
    return `
        <div class="sub-comments">
            ${subComments.map(comment => `
                <div class="comment-item sub-comment" data-id="${comment.commentId}">
                    <div class="comment-header">
                        <div class="comment-info">
                            <span class="comment-author">${comment.userName}</span>
                            <span class="comment-time">${formatDate(comment.createTime)}</span>
                        </div>
                        <div class="comment-actions">
                            <button class="comment-like-btn" onclick="likeComment('${comment.commentId}')">
                                <span class="like-count">${comment.likes || 0}</span> 赞
                            </button>
                            ${comment.userId === currentUserId ? 
                                `<button class="delete-btn" onclick="deleteComment('${comment.commentId}')">删除</button>` 
                                : ''
                            }
                        </div>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 点赞评论
async function likeComment(commentId) {
    try {
        const response = await fetch('/post/comment_like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId })
        });

        const data = await response.json();
        if (data.code === 0) {
            const likeBtn = document.querySelector(`[data-id="${commentId}"] .comment-like-btn`);
            const likeCount = likeBtn.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            likeBtn.classList.add('liked');
        }
    } catch (err) {
        console.error('点赞评论失败:', err);
    }
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 显示评论弹窗
function showCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'block';
    // 加载评论
    loadComments(currentArticleId);
}

// 隐藏评论弹窗
function hideCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'none';
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('commentModal');
    if (event.target === modal) {
        hideCommentModal();
    }
}

// 删除评论
async function deleteComment(commentId) {
    if (!confirm('确定要删除这条评论吗？')) {
        return;
    }

    try {
        const response = await fetch('/post/comment_delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId })
        });

        const data = await response.json();
        if (data.code === 0) {
            // 从DOM中移除评论
            const commentElement = document.querySelector(`[data-id="${commentId}"]`);
            if (commentElement) {
                commentElement.remove();
            }
        } else {
            alert(data.message || '删除评论失败');
        }
    } catch (err) {
        console.error('删除评论失败:', err);
        alert('删除评论失败，请稍后重试');
    }
}