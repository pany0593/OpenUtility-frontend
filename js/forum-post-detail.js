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
        // window.location.href = 'forum-posts.html';
        return;
    }


    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                // 清除 localStorage 中的 token
                localStorage.removeItem('token');

               // 可以清除其他与用户相关的存储项
                localStorage.removeItem('userInfo');
                window.location.href = 'index.html';
            }
        });
    }

    // 加载帖子内容
    await loadPostDetail(articleId);
    // 加载评论
    await loadComments(articleId);



// 点赞文章事件
document.querySelector('.like-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token 

    if (!token) {
        alert('用户未登录，请先登录！');
        return;
    }

    try {
        // 确保从 localStorage 获取 token
        const token = localStorage.getItem('token');

        // const articleId = articleId; // 替换为实际文章 ID（或者通过页面动态获取）
        const response = await fetch('http://120.24.176.40:80/api/post/article_like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 添加 Authorization 请求头
            },
            body: JSON.stringify({"userInfo.id":userInfo.id, "articleId":articleId })
        });

        const data = await response.json();

        if (data.base.code === 0) {
            const likeBtn = document.querySelector('.like-btn');
            likeBtn.classList.toggle('liked'); // 切换按钮的 liked 样式
            const likeCount = likeBtn.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent, 10) + 1; // 更新点赞数
        } else {
            alert(`点赞失败: ${data.base.message}`);
        }
    } catch (err) {
        console.error('点赞失败:', err);
        alert('点赞请求失败，请稍后重试！');
    }
});


    

    // 发表评论
    document.querySelector('.submit-comment').addEventListener('click', async () => {
        const content = document.getElementById('commentContent').value.trim();
        if (!content) {
            alert('请输入评论内容');
            return;
        }


        try {
            const response = await fetch('http://120.24.176.40:80/api/post/comment_add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fatherId: currentArticleId,
                    userId: userInfo.id,
                    userName: userInfo.username,
                    content
                })
            });

            const data = await response.json();
            if (data.base.code === 0) {
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



const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');



// 加载帖子详情
async function loadPostDetail(articleId) {
    try {
        // 发送请求获取帖子详情
        const response = await fetch('http://120.24.176.40:80/api/post/article_get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleId })
        });

        if (!response.ok) {
            throw new Error(`HTTP 错误，状态码: ${response.status}`);
        }

        const result = await response.json();

        // 检查返回的基础状态码
        if (result.base.code === 0) { 
            const post = result.data;

            // 填充帖子内容
            document.querySelector('.post-title').textContent = post.title;
            document.querySelector('.author').textContent = `作者：${post.authorName}`;
            document.querySelector('.time').textContent = formatDate(post.createTime);
            document.querySelector('.post-text').textContent = post.content;
            document.querySelector('.like-count').textContent = post.likes;

            // 保存当前帖子ID，供评论使用
            window.currentArticleId = post.articleId;

            // 可选：日志输出浏览量
            if (post.clicks !== undefined) {
                console.log('浏览量：', post.clicks);
            }
        } else {
            throw new Error(result.base.message || '获取帖子失败');
        }
    } catch (err) {
        console.error('加载帖子失败:', err);
        alert('加载帖子失败，请稍后重试');
    }
}



// 加载评论列表
async function loadComments(articleId) {
    console.log('loadComments called with Article ID:', articleId);

    try {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = '<p>评论加载中...</p>';

        const response = await fetch('http://120.24.176.40:80/api/post/comment_get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articleId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP 错误，状态码: ${response.status}`);
        }

        const result = await response.json();

        if (result.base && result.base.code === 0) {
            console.log('Comments fetched:', result.data);
            renderComments(result.data);
        } else {
            throw new Error(result.base.message || '加载评论失败');
        }
    } catch (err) {
        console.error('加载评论失败:', err);
        alert('加载评论失败，请稍后重试');
    }
}





// 渲染评论列表
function renderComments(comments) {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = ''; // 清空现有评论

    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.dataset.id = comment.commentId;

        // 一级评论内容
        commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-info">
                    <span class="comment-author">${comment.userName}</span>
                    <span class="comment-time">${formatDate(comment.createTime)}</span>
                </div>
                <div class="comment-actions">
                    <button class="comment-like-btn" onclick="likeComment('${comment.commentId}')">
                        <span class="like-count">${comment.likes}</span> 赞
                    </button>

                    <button class="reply-btn" onclick="replyToComment('${comment.commentId}')">回复</button>

                    ${comment.userId === userInfo.id ? 
                        `<button class="delete-btn" onclick="deleteComment('${comment.commentId}')">删除</button>` 
                        : ''}
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
        `;

        // 如果有二级评论，递归渲染
        if (comment.subComments && comment.subComments.length > 0) {
            const subCommentsContainer = document.createElement('div');
            subCommentsContainer.classList.add('sub-comments');
            subCommentsContainer.innerHTML = renderSubComments(comment.subComments);
            commentItem.appendChild(subCommentsContainer);
        }

        commentList.appendChild(commentItem);
    });
}

// 渲染子评论
function renderSubComments(subComments) {
    return subComments.map(subComment => `
        <div class="comment-item sub-comment" data-id="${subComment.commentId}">
            <div class="comment-header">
                <div class="comment-info">
                    <span class="comment-author">${subComment.userName}</span>
                    <span class="comment-time">${formatDate(subComment.createTime)}</span>
                </div>
                <div class="comment-actions">
                    <button class="comment-like-btn" onclick="likeComment('${subComment.commentId}')">
                        <span class="like-count">${subComment.likes}</span> 赞
                    </button>
                    ${subComment.userId === userInfo.id ? 
                        `<button class="delete-btn" onclick="deleteComment('${subComment.commentId}')">删除</button>` 
                        : ''}
                </div>
            </div>
            <div class="comment-content">${subComment.content}</div>
        </div>
    `).join('');
    
}



// 回复一级评论
function replyToComment(commentId) {
    const replyContent = prompt('请输入回复内容:');
    if (!replyContent) {
        alert('回复内容不能为空');
        return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    fetch('http://120.24.176.40:80/api/post/comment_add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fatherId: commentId,
            userId: userInfo.id,
            userName: userInfo.username,
            content: replyContent,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.base.code === 0) {
                alert('回复成功');
                loadComments(window.currentArticleId); // 重新加载评论
            } else {
                alert(data.message || '回复失败');
            }
        })
        .catch(err => {
            console.error('回复失败:', err);
            alert('回复失败，请稍后重试');
        });
}





// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 获取当前用户ID
function getCurrentUserId() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.id || null;
}

// 点赞评论
async function likeComment(commentId) {
    try {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token 
        const response = await fetch('http://120.24.176.40:80/api/post/comment_like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 添加 Authorization 请求头
            },
            body: JSON.stringify({ "commentId":commentId }),
        });

        const result = await response.json();
        const message = result.message || "操作成功";
        if (result.code === 0) {
            const likeBtn = document.querySelector(`[data-id="${commentId}"] .comment-like-btn`);
            const likeCount = likeBtn.querySelector('.like-count');
            // likeCount.textContent = parseInt(likeCount.textContent) + 1;

            // 更新为后端返回的最新点赞数
            if (result.data && typeof result.data.likes === "number") {
                likeCount.textContent = result.data.likes;
             } 
            //  else {
            //     // 如果后端未返回最新点赞数，前端加 1
            //     likeCount.textContent = parseInt(likeCount.textContent) + 1;
            // }

            likeBtn.classList.add('liked');
        }else{
            console.log(message);
            
        }
    } catch (err) {
        console.error('点赞评论失败:', err);
    }
}

// 删除评论
async function deleteComment(commentId) {
    if (!confirm('确定要删除这条评论吗？')) {
        return;
    }

    try {
        const response = await fetch('http://120.24.176.40:80/api/post/comment_delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId:commentId }),
        });

        const result = await response.json();
        if (result.base.code === 0) {
            // 从DOM中移除评论
            const commentElement = document.querySelector(`[data-id="${commentId}"]`);
            if (commentElement) {
                commentElement.remove();
            }
        } else {
            alert(result.base.message || '删除评论失败');
        }
    } catch (err) {
        console.error('删除评论失败:', err);
    }
}


// 显示评论弹窗
function showCommentModal(articleId) {
    console.log('Show Comment Modal triggered for Article ID:', articleId);
    const modal = document.getElementById('commentModal');
    modal.style.display = 'block';

    // 加载评论
    loadComments(articleId);
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
};


// // 删除评论
// async function deleteComment(commentId) {
//     if (!confirm('确定要删除这条评论吗？')) {
//         return;
//     }

//     try {
//         const response = await fetch('/post/comment_delete', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ commentId })
//         });

//         const data = await response.json();
//         if (data.code === 0) {
//             // 从DOM中移除评论
//             const commentElement = document.querySelector(`[data-id="${commentId}"]`);
//             if (commentElement) {
//                 commentElement.remove();
//             }
//         } else {
//             alert(data.message || '删除评论失败');
//         }
//     } catch (err) {
//         console.error('删除评论失败:', err);
//         alert('删除评论失败，请稍后重试');
//     }
// }