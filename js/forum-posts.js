document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 绑定查询文章ID的按钮点击事件
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', async () => {
            const articleId = searchInput.value.trim();
            if (articleId) {
                await searchArticlesById(articleId);
            } else {
                alert("请输入文章ID！");
            }
        });
    }
});

// 根据文章ID查询文章
async function searchArticlesById(articleId) {
    try {
        const response = await fetch(`120.24.176.40:80/api/post/article_get=${articleId}`);
        const result = await response.json();

        if (result.status === 'success') {
            const postsList = document.querySelector('.posts-list');
            postsList.innerHTML = ''; // 清空当前文章列表

            const article = result.data;
            const postItem = document.createElement('div');
            postItem.classList.add('post-item');
            postItem.dataset.id = article.articleId;

            postItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <span class="post-date">${formatDate(article.timestamp)}</span>
            `;
            
            postsList.appendChild(postItem);
        } else {
            alert('没有找到该ID的文章');
        }
    } catch (error) {
        console.error('根据ID查询失败:', error);
    }
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}





async function getArticleList(page, sort = 0) {
    console.log(`getArticleList 被调用, page=${page}, sort=${sort}`); // 调试输出
    try {
        const url = `http://120.24.176.40:80/api/post/article_list_get`;
        console.log(`请求 URL: ${url}`);

        // 构建请求体
        const requestBody = { page, sort };

        // 发送 POST 请求
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP 错误，状态码: ${response.status}, 响应体: ${errorText}`);
            throw new Error(`HTTP 错误，状态码: ${response.status}`);
        }

        const result = await response.json();
        console.log('接口返回结果:', result);

        if (result.base && result.base.code === 0) {
            console.log('文章列表数据:', result.data.articles);
            updateArticleList(result.data.articles); // 更新文章列表
            generatePagination(result.data.totalPages, page); // 动态生成分页按钮
        } else {
            alert(`获取文章列表失败: ${result.base?.message || '未知错误'}`);
        }
    } catch (error) {
        console.error('获取文章列表时出错:', error);
        alert('加载文章列表失败，请稍后重试');
    }
}

// 更新文章列表
function updateArticleList(articles) {
    const postsList = document.querySelector('.posts-list');
    postsList.innerHTML = ''; // 清空现有文章列表

    articles.forEach(article => {
        const postItem = document.createElement('div');
        postItem.classList.add('post-item');
        postItem.dataset.id = article.articleId; // 设置 data-id

        postItem.innerHTML = `
            <div class="post-avatar">
                <img src="assets/images/avatar.png" alt="用户头像" loading="lazy">
            </div>
            <div class="post-content">
                <div class="post-title">
                    <h3>${article.title}</h3>
                    <span class="post-tag">文章标签</span>
                </div>
                <div class="post-info">
                    <span class="author">作者：${article.authorName}</span>
                    <span class="time">发布时间：${article.createTime}</span>
                    <span class="views">浏览：${article.clicks}</span>
                    <span class="comments">点赞：${article.likes}</span>
                </div>
                <p class="post-preview">${article.desc}</p>
            </div>
        `;
        postsList.appendChild(postItem);
    });
}

// 动态生成分页按钮
function generatePagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = ''; // 清空现有分页按钮

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.classList.add('active'); // 当前页高亮
        }
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            getArticleList(i); // 点击页码时加载对应页的文章
        });
        pagination.appendChild(pageButton);
    }
}

