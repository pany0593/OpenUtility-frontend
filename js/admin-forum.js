document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');



    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', async function () {
        const searchText = searchInput.value.trim();
        if (searchText) {
            try {
                // 调用搜索功能，查找与搜索词匹配的文章
                const articleId = await searchPosts(searchText);
                if (articleId) {
                    // 文章 ID 存在，调用获取详情的函数
                    await getArticleDetail(articleId);
                } else {
                    alert('未找到匹配的文章，请更换搜索关键词');
                }
            } catch (error) {
                console.error('搜索文章时出错:', error);
                alert('搜索文章时发生错误，请稍后重试');
            }
        }
    });

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

    // 搜索文章函数，返回匹配的文章 ID
    async function searchPosts(searchText) {
        try {
            // 发送 GET 请求搜索文章，使用查询参数传递搜索关键词
            const url = `/article/search?query=${encodeURIComponent(searchText)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 检查响应
            if (!response.ok) {
                throw new Error(`HTTP 错误，状态码: ${response.status}`);
            }

            const result = await response.json();

            // 假设后端返回的结果中包含一个匹配的 articleId
            if (result.base.code === 0 && result.data.articleId) {
                console.log('搜索成功，文章 ID:', result.data.articleId);
                return result.data.articleId; // 返回找到的文章 ID
            } else {
                console.warn('未找到匹配的文章:', result.base.message);
                return null;
            }
        } catch (error) {
            console.error('搜索文章时出错:', error);
            alert('搜索文章时发生错误，请稍后重试');
            return null;
        }
    }

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
async function updateArticle(articleData) {
    try {
        // 发送 POST 请求
        const response = await fetch('/post/article_update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleData) // 将文章数据转换为 JSON 格式
        });

        // 解析响应数据
        const result = await response.json();

        // 根据响应处理结果
        if (result.code === 0) {
            alert('文章更新成功！');
            console.log('更新的文章:', articleData);
            // 可选：跳转到文章详情页或刷新列表页面
            window.location.href = '/articles'; // 示例：跳转到文章列表
        } else {
            alert(`更新失败: ${result.message}`);
        }
    } catch (error) {
        console.error('更新文章时出错:', error);
        alert('更新文章失败，请稍后重试');
    }
}

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

// 显示评论的函数
function displayComments(comments) {
    const commentSection = document.getElementById('commentSection');
    commentSection.innerHTML = ''; // 清空现有内容

    comments.forEach(comment => {
        // 一级评论
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.innerHTML = `
            <p><strong>${comment.userName}:</strong> ${comment.content}</p>
            <p>点赞数: ${comment.likes} - 时间: ${comment.createTime}</p>
        `;

        // 二级评论（子评论）
        if (comment.subComment && comment.subComment.length > 0) {
            const subCommentList = document.createElement('div');
            subCommentList.classList.add('sub-comment-list');

            comment.subComment.forEach(subComment => {
                const subCommentItem = document.createElement('div');
                subCommentItem.classList.add('sub-comment-item');
                subCommentItem.innerHTML = `
                    <p><strong>${subComment.userName}:</strong> ${subComment.content}</p>
                    <p>点赞数: ${subComment.likes} - 时间: ${subComment.createTime}</p>
                `;
                subCommentList.appendChild(subCommentItem);
            });

            commentItem.appendChild(subCommentList);
        }

        commentSection.appendChild(commentItem);
    });
}









    // 筛选功能
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterPosts);

    // 审核通过按钮
    document.querySelectorAll('.approve-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const postItem = this.closest('.post-item');
            const title = postItem.querySelector('.post-title').textContent;
            approvePost(title, postItem);
        });
    });

    // 审核拒绝按钮
    document.querySelectorAll('.reject-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const postItem = this.closest('.post-item');
            const title = postItem.querySelector('.post-title').textContent;
            rejectPost(title, postItem);
        });
    });

    // 删除按钮
    // document.querySelectorAll('.delete-btn').forEach(btn => {
    //     btn.addEventListener('click', function() {
    //         const postItem = this.closest('.post-item');
    //         const title = postItem.querySelector('.post-title').textContent;
    //         deletePost(title, postItem);
    //     });
    // });




    

    // 删除文章的函数
async function deleteArticle(articleId, postItem) {
    if (!confirm(`确定要删除文章 ID: ${articleId} 吗？`)) {
        return; // 用户取消操作
    }

    try {
        // 发送删除请求
        const response = await fetch('/post/article_delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleId })
        });

        // 解析响应数据
        const result = await response.json();

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
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const postItem = this.closest('.post-item'); // 找到父级文章元素
        const articleId = postItem?.getAttribute('data-article-id'); // 获取文章 ID

        if (!articleId) {
            alert('无法找到文章 ID，操作取消');
            return;
        }

        // 调用删除函数
        deleteArticle(articleId, postItem);
    });
});





    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadPostsPage(this.textContent);
            }
        });
    });



    //查询文章列表
        const buttons = document.querySelectorAll('.page-btn');
        console.log('找到的按钮数量:', buttons.length); // 调试输出
    
        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                console.log('按钮点击事件触发:', this); // 调试输出
                const page = this.getAttribute('data-page'); // 获取页码
                const sort = this.getAttribute('data-sort'); // 获取排序方式
                console.log(`获取页码: ${page}, 排序: ${sort}`); // 调试输出
                getArticleList(parseInt(page, 10), parseInt(sort, 10));
            });
        });
    
    
    async function getArticleList(page, sort) {
        console.log(`getArticleList 被调用, page=${page}, sort=${sort}`); // 调试输出
        try {
            // 拼接 URL 参数
            const url = `http://120.24.176.40:80/api/post/article_list_get?page=${page}&sort=${sort}`;
            console.log(`请求 URL: ${url}`); // 调试输出
    
            const response = await fetch(url, {
                method: 'GET', // 使用 GET 方法
                headers: {
                    'Content-Type': 'application/json', // 请求头可选
                },
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
                // 更新页面内容
                // updateArticleList(result.data.articles);
            } else {
                alert(`获取文章列表失败: ${result.base?.message || '未知错误'}`);
            }
        } catch (error) {
            console.error('获取文章列表时出错:', error);
            alert('加载文章列表失败，请稍后重试');
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

// 审核通过
function approvePost(title, postItem) {
    if (confirm(`确定通过帖子"${title}"的审核吗？`)) {
        // 这里添加审核通过的逻辑
        console.log('通过帖子:', title);
        
        // 更新状态显示
        const statusSpan = postItem.querySelector('.post-status');
        statusSpan.className = 'post-status approved';
        statusSpan.textContent = '已通过';
        
        // 禁用审核按钮
        const buttons = postItem.querySelectorAll('.approve-btn, .reject-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // 提示成功
        alert('审核通过成功！');
    }
}

// 审核拒绝
function rejectPost(title, postItem) {
    if (confirm(`确定拒绝帖子"${title}"的审核吗？`)) {
        // 这里添加审核拒绝的逻辑
        console.log('拒绝帖子:', title);
        
        // 更新状态显示
        const statusSpan = postItem.querySelector('.post-status');
        statusSpan.className = 'post-status rejected';
        statusSpan.textContent = '已拒绝';
        
        // 禁用审核按钮
        const buttons = postItem.querySelectorAll('.approve-btn, .reject-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // 提示成功
        alert('审核拒绝成功！');
    }
}

// 删除帖子
function deletePost(title, postItem) {
    if (confirm(`确定要删除帖子"${title}"吗？此操作不可恢复。`)) {
        // 这里添加删除帖子的逻辑
        console.log('删除帖子:', title);
        
        // 从列表中移除该帖子
        postItem.remove();
        
        // 提示成功
        alert('帖子删除成功！');
    }
}

// 加载指定页码的帖子数据
function loadPostsPage(page) {
    console.log('加载第', page, '页帖子');
    // 这里添加分页加载逻辑

} 

