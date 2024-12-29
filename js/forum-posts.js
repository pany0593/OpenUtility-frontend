document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }


    // 绑定退出登录按钮的点击事件
document.querySelector('.logout-btn')?.addEventListener('click', function () {
    if (confirm('确定要退出登录吗？')) {
        // 清除 localStorage 中的 token
        localStorage.removeItem('token');

        // 可以清除其他与用户相关的存储项
        localStorage.removeItem('userInfo'); // 如果有存储用户信息，也可以清除

        // 跳转到 index.html
        window.location.href = 'index.html';
    }
});


    // 搜索功能
 const searchBtn = document.querySelector('.search-btn');
 const searchInput = document.querySelector('#searchInput');

 searchBtn.addEventListener('click', async function () {
     const searchText = searchInput.value.trim();
     if (searchText) {
         try {
             // 使用输入的搜索词（文章ID）查询文章
             const article = await getArticleById(searchText);
             if (article) {
                 // 渲染文章
                 renderArticleDetails(article);
             } else {
                 alert('未找到匹配的文章，请更换搜索关键词');
             }
         } catch (error) {
             console.error('搜索文章时出错:', error);
         }
     }
 });

 // 根据文章ID获取文章详情
 async function getArticleById(articleId) {
     try {
         // 发送 POST 请求查找对应文章
         const response = await fetch(`http://120.24.176.40:80/api/post/article_get`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ articleId })
         });

         const result = await response.json();

         // 检查响应
         if (result.base.code === 0) {
             return result.data; // 返回文章详情
         } else {
             console.warn('未找到该文章:', result.base.message);
             return null;
         }
     } catch (error) {
         console.error('获取文章详情时出错:', error);
         return null;
     }
 }


});


const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'); // 确保在这里初始化


 // 渲染文章详情
 function renderArticleDetails(article) {
    const postsList = document.querySelector('.posts-list');
    postsList.innerHTML = ''; // 清空现有列表

    const pagination = document.querySelector('.pagination');
   pagination.innerHTML = ''; // 清空现有分页按钮

    const postItem = document.createElement('div');
    postItem.classList.add('post-item');
    postItem.dataset.id = article.articleId;

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
            ${article.authorId === userInfo.id ? 
                `<button class="delete-btn" onclick="deleteArticle('${article.articleId}')" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer; position: absolute; right: 10px; top: 10px;">删除</button>` 
                : ''}
        </div>
    `;

    postsList.appendChild(postItem);

    // 为删除按钮绑定事件
    // const deleteButton = postItem.querySelector('.delete-btn');
    // deleteButton.addEventListener('click', async () => {
    //     const confirmed = confirm(`确定要删除文章 "${article.title}" 吗？`);
    //     if (confirmed) {
    //         try {
    //             await deleteArticle(article.articleId, postItem);
    //         } catch (error) {
    //             console.error('删除文章时出错:', error);
    //             alert('删除文章失败，请稍后重试');
    //         }
    //     }
    // });


}



// 删除文章的函数
async function deleteArticle(articleId, postItem) {
    if (!confirm(`确定要删除文章 ID: ${articleId} 吗？`)) {
        return; // 用户取消操作
    }

    try {
        // 发送删除请求
        const response = await fetch('http://120.24.176.40:80/api/post/article_delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleId })
        });

        // 解析响应数据
        const result = await response.json();

        // console.log("result.base.message:"+result.base.message);
        // console.log("result.base.code:"+result.base.code);

        // 根据响应处理结果
        if (result.base.code === 0) {
            alert('文章删除成功！');
            console.log('删除成功的文章 ID:', articleId);
            // 从页面中移除对应的文章 DOM
            if (postItem) {
                postItem.remove();
            }
        } else {
            alert(`删除失败: ${result.base.message}`);
        }
    } catch (error) {
        console.error('删除文章时出错:', error);
        alert('删除文章失败，请稍后重试');
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
                <img src= assets/images/avatar.png   alt="用户头像" loading="lazy">  
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
                ${article.authorId === userInfo.id ? 
                    `<button class="delete-btn" onclick="deleteArticle('${article.articleId}')" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer; position: absolute; right: 10px; top: 10px;">删除</button>` 
                    : ''}
            </div>
        `;
        


        // 绑定标题的点击事件
        const titleElement = postItem.querySelector('.post-title h3');
        titleElement.addEventListener('click', () => {
            console.log(article.articleId);
            
            window.location.href = `forum-post-detail.html?id=${article.articleId}`;
        });

        postsList.appendChild(postItem);
    });


    console.log(userInfo);



    
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

