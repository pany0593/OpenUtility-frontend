document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');



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
             alert('搜索文章时发生错误，请稍后重试');
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
         alert('获取文章详情失败，请稍后重试');
         return null;
     }
 }

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
             <button class="delete-btn" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer; position: absolute; right: 10px; top: 10px;">删除</button>
         </div>
     `;

     postsList.appendChild(postItem);

     // 为删除按钮绑定事件
     const deleteButton = postItem.querySelector('.delete-btn');
     deleteButton.addEventListener('click', async () => {
         const confirmed = confirm(`确定要删除文章 "${article.title}" 吗？`);
         if (confirmed) {
             try {
                 await deleteArticle(article.articleId, postItem);
             } catch (error) {
                 console.error('删除文章时出错:', error);
                 alert('删除文章失败，请稍后重试');
             }
         }
     });
 }

 

    // 查询文章详情
    async function getArticleDetail(articleId) {
        try {
            // 发送 POST 请求获取文章详情
            const response = await fetch('/article/getDetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ articleId }),
            });

            // 解析响应
            const result = await response.json();

            // 处理响应
            if (result.base.code === 0) {
                console.log('文章详情:', result.data);
                displayArticleDetail(result.data); // 调用函数显示文章内容
            } else {
                alert(`获取文章失败: ${result.base.message}`);
            }
        } catch (error) {
            console.error('请求文章详情失败:', error);
            alert('请求文章详情时发生错误，请稍后重试');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // 显示页面内容
        const layout = document.querySelector('.layout');
        if (layout) layout.classList.add('loaded');
    
       
    });
    

    // 显示文章详情的函数
    function displayArticleDetail(data) {
        const articleSection = document.getElementById('articleSection');
        articleSection.innerHTML = `
            <h1>${data.title}</h1>
            <p><strong>作者:</strong> ${data.authorName}</p>
            <p><strong>简介:</strong> ${data.desc}</p>
            <p><strong>创建时间:</strong> ${data.CreateTime}</p>
            <p><strong>点赞:</strong> ${data.likes} 次</p>
            <p><strong>点击:</strong> ${data.clicks} 次</p>
            <div>
                <h2>内容</h2>
                <p>${data.content}</p>
            </div>
        `;
    }


    //更新文章
// async function updateArticle(articleData) {
//     try {
//         // 发送 POST 请求
//         const response = await fetch('/post/article_update', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(articleData) // 将文章数据转换为 JSON 格式
//         });

//         // 解析响应数据
//         const result = await response.json();

//         // 根据响应处理结果
//         if (result.code === 0) {
//             alert('文章更新成功！');
//             console.log('更新的文章:', articleData);
//             // 可选：跳转到文章详情页或刷新列表页面
//             window.location.href = '/articles'; // 示例：跳转到文章列表
//         } else {
//             alert(`更新失败: ${result.message}`);
//         }
//     } catch (error) {
//         console.error('更新文章时出错:', error);
//         alert('更新文章失败，请稍后重试');
//     }
// }

//发表评论
async function addComment(commentData) {
    try {
        // 发送 POST 请求
        const response = await fetch('/post/comment_add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData) // 将评论数据转换为 JSON 格式
        });

        // 解析响应数据
        const result = await response.json();

        // 根据响应处理结果
        if (result.Base.code === 0) {
            alert('评论添加成功！');
            console.log('新增的评论 ID:', result.data.commentId);
            // 可选：刷新评论列表或清空输入框
            document.getElementById('commentContent').value = ''; // 清空评论输入框
        } else {
            alert(`评论添加失败: ${result.Base.message}`);
        }
    } catch (error) {
        console.error('添加评论时出错:', error);
        alert('添加评论失败，请稍后重试');
    }
}

// 删除评论
async function deleteComment(commentId) {
    if (!confirm(`确定要删除评论 ID: ${commentId} 吗？`)) {
        return; // 用户取消操作
    }

    try {
        // 发送 POST 请求
        const response = await fetch('/post/comment_delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId }) // 请求体
        });

        // 解析响应数据
        const result = await response.json();

        // 根据响应结果处理
        if (result.code === "0") {
            alert('评论删除成功！');
            console.log('删除的评论 ID:', commentId);
            // 可选：移除对应的评论 DOM
            document.querySelector(`[data-comment-id="${commentId}"]`)?.remove();
        } else {
            alert(`删除失败: ${result.message}`);
        }
    } catch (error) {
        console.error('删除评论时出错:', error);
        alert('删除评论失败，请稍后重试');
    }
}


// 获取评论的函数
async function getComments(articleId) {
    try {
        // 构建请求 URL
        const url = `/post/comment_get?articleId=${encodeURIComponent(articleId)}`;

        // 发送 GET 请求
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 解析响应数据
        const result = await response.json();

        // 根据响应处理结果
        if (result.Base.code === 0) {
            console.log('评论数据:', result.data.comment);
            displayComments(result.data.comment); // 显示评论
        } else {
            alert(`获取评论失败: ${result.Base.message}`);
        }
    } catch (error) {
        console.error('获取评论时出错:', error);
        alert('加载评论失败，请稍后重试');
    }
}



// 筛选功能
const statusFilter = document.getElementById('statusFilter');
statusFilter.addEventListener('change', filterPosts);


    

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



// 为所有删除按钮绑定事件
// document.querySelectorAll('.delete-btn').forEach(btn => {
//     btn.addEventListener('click', function() {
//         const postItem = this.closest('.post-item'); // 找到父级文章元素
//         const articleId = postItem?.getAttribute('data-article-id'); // 获取文章 ID

//         if (!articleId) {
//             alert('无法找到文章 ID，操作取消');
//             return;
//         }

//         // 调用删除函数
//         deleteArticle(articleId, postItem);
//     });
// });





//获取文章列表
window.getArticleList = async function(page, sort = 0) {
    console.log(`getArticleList 被调用, page=${page}, sort=${sort}`);
    try {
        const url = `http://120.24.176.40:80/api/post/article_list_get`;
        const requestBody = { page, sort };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            updateArticleList(result.data.articles);
            generatePagination(result.data.totalPages, page);
        } else {
            alert(`获取文章列表失败: ${result.base?.message || '未知错误'}`);
        }
    } catch (error) {
        console.error('获取文章列表时出错:', error);
        alert('加载文章列表失败，请稍后重试');
    }
};



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
                <button class="delete-btn" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer; position: absolute; right: 10px; top: 10px;">删除</button>
            </div>
        `;
        

        // 绑定删除按钮的事件
        const deleteButton = postItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', async () => {
            const confirmed = confirm(`确定要删除文章 "${article.title}" 吗？`);
            if (confirmed) {
                try {
                    await deleteArticle(article.articleId, postItem);
                } catch (error) {
                    console.error('删除文章时出错:', error);
                    alert('删除文章失败，请稍后重试');
                }
            }
        });

        // 绑定标题的点击事件
        const titleElement = postItem.querySelector('.post-title h3');
        titleElement.addEventListener('click', () => {
            console.log(article.articleId);
            
            window.location.href = `forum-post-detail.html?id=${article.articleId}`;
        });

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



// 退出登录
document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 搜索帖子
function searchPosts(keyword) {
    console.log('搜索帖子:', keyword);
    // 这里添加搜索逻辑
}

// 筛选帖子
function filterPosts() {
    const status = document.getElementById('statusFilter').value;
    console.log('筛选状态:', status);
    // 这里添加筛选逻辑
}



// 加载指定页码的帖子数据
function loadPostsPage(page) {
    console.log('加载第', page, '页帖子');
    // 这里添加分页加载逻辑

} 

