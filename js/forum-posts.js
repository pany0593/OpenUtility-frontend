document.addEventListener('DOMContentLoaded', async function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 初始化加载第一页的文章
    await loadArticles(1);

    // 为帖子列表添加点击事件，跳转到帖子详情
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
        searchBtn.addEventListener('click', async () => {
            const searchText = searchInput.value.trim();
            if (searchText) {
                await searchArticles(searchText);
            } else {
                // 如果搜索框为空，重新加载所有文章
                await loadArticles(1);
            }
        });
    }
});

// 加载文章列表（默认加载第一页）
async function loadArticles(page = 1) {
    try {
        const response = await fetch(`http://ty9c9v.natappfree.cc/post/article_list?page=${page}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            const postsList = document.querySelector('.posts-list');
            postsList.innerHTML = ''; // 清空当前文章列表

            result.data.forEach(article => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.dataset.id = article.articleId;

                postItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <span class="post-date">${formatDate(article.timestamp)}</span>
                `;
                
                postsList.appendChild(postItem);
            });

            // 更新分页
            updatePagination(result.currentPage, result.totalPages);
        }
    } catch (error) {
        console.error('加载文章失败:', error);
    }
}

// 搜索文章
async function searchArticles(searchText) {
    try {
        // 使用GET请求进行搜索
        const response = await fetch(`http://ty9c9v.natappfree.cc/post/article_search?query=${encodeURIComponent(searchText)}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            const postsList = document.querySelector('.posts-list');
            postsList.innerHTML = ''; // 清空当前文章列表

            result.data.forEach(article => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.dataset.id = article.articleId;

                postItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <span class="post-date">${formatDate(article.timestamp)}</span>
                `;
                
                postsList.appendChild(postItem);
            });

            // 更新分页
            updatePagination(result.currentPage, result.totalPages);
        } else {
            alert('没有找到相关内容');
        }
    } catch (error) {
        console.error('搜索失败:', error);
    }
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

    // 为每个分页按钮绑定点击事件
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const page = parseInt(btn.dataset.page, 10);
            if (!isNaN(page)) {
                await loadArticles(page);  // 加载指定页面的文章
            }
        });
    });
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
