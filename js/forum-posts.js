document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 初始化加载第一页
    await loadArticles(1);

    // 为帖子列表添加点击事件
    const postsList = document.querySelector('.posts-list');
    postsList.addEventListener('click', (e) => {
        const postItem = e.target.closest('.post-item');
        if (postItem) {
            const postId = postItem.dataset.id;
            if (postId) {
                window.location.href = `forum-post-detail.html?id=${postId}`;
            }
        }
    });

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const searchText = searchInput.value.trim();
            if (searchText) {
                // 这里可以添加搜索逻辑
                console.log('搜索:', searchText);
            }
        });
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


    // 分页功能
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.addEventListener('click', async (e) => {
            const btn = e.target.closest('.page-btn:not([disabled])');
            if (btn && !btn.classList.contains('active')) {
                const page = parseInt(btn.dataset.page || btn.textContent);
                await loadArticles(page);
            }
        });
    }
});

// 加载文章列表
async function loadArticles(page, sort = 0) {
    try {
        const response = await fetch('/post/article_list_get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                page,
                sort 
            })
        });

        const data = await response.json();
        
        if (data.code === '0') {
            renderArticles(data.data.articles);
            updatePagination(page, data.data.totalPages);
        } else {
            throw new Error(data.message || '获取文章列表失败');
        }
    } catch (err) {
        console.error('加载文章列表失败:', err);
        alert('加载文章列表失败，请稍后重试');
    }
}

// 渲染文章列表
function renderArticles(articles) {
    const postsList = document.querySelector('.posts-list');
    
    postsList.innerHTML = articles.map(article => `
        <div class="post-item" data-id="${article.articleId}">
            <div class="post-avatar">
                <img src="assets/images/avatar.png" alt="用户头像" loading="lazy">
            </div>
            <div class="post-content">
                <div class="post-title">
                    <h3>${article.title}</h3>
                </div>
                <div class="post-info">
                    <span class="author">作者：${article.authorName}</span>
                    <span class="time">发布时间：${formatDate(article.CreateTime)}</span>
                    <span class="views">浏览：${article.clicks || 0}</span>
                    <span class="comments">评论：${article.commentCount || 0}</span>
                </div>
                <p class="post-preview">${article.desc}</p>
            </div>
        </div>
    `).join('');
}

// 更新分页控件
function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector('.pagination');
    let html = '';

    // 上一页按钮
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">上一页</button>`;

    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span class="page-ellipsis">...</span>`;
        }
    }

    // 下一页按钮
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">下一页</button>`;

    pagination.innerHTML = html;
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
