document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchPosts(searchText);
        }
    });

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
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postItem = this.closest('.post-item');
            const title = postItem.querySelector('.post-title').textContent;
            deletePost(title, postItem);
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