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
        const response = await fetch(`120.24.176.40:80/post/article_get=${articleId}`);
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
