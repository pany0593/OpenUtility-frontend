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
            searchReports(searchText);
        }
    });

    // 筛选功能
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterReports);

    // 删除帖子按钮
    document.querySelectorAll('.delete-post-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[1].textContent;
            deletePost(title, row);
        });
    });

    // 删除评论按钮
    document.querySelectorAll('.delete-comment-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[1].textContent;
            deleteComment(title, row);
        });
    });

    // 删除举报按钮
    document.querySelectorAll('.delete-report-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row.cells[1].textContent;
            deleteReport(title, row);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadReportsPage(this.textContent);
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

// 搜索举报
function searchReports(keyword) {
    console.log('搜索举报:', keyword);
    // 这里添加搜索逻辑
}

// 筛选举报
function filterReports() {
    const status = document.getElementById('statusFilter').value;
    console.log('筛选状态:', status);
    // 这里添加筛选逻辑
}

// 删除帖子
function deletePost(title, row) {
    if (confirm(`确定要删除帖子"${title}"吗？此操作不可恢复。`)) {
        // 这里添加删除帖子的逻辑
        console.log('删除帖子:', title);
        
        // 更新状态显示
        updateReportStatus(row, 'processed');
        
        // 禁用操作按钮
        disableActionButtons(row);
        
        // 提示成功
        alert('帖子删除成功！');
    }
}

// 删除评论
function deleteComment(title, row) {
    if (confirm(`确定要删除帖子"${title}"的相关评论吗？`)) {
        // 这里添加删除评论的逻辑
        console.log('删除评论:', title);
        
        // 更新状态显示
        updateReportStatus(row, 'processed');
        
        // 禁用操作按钮
        disableActionButtons(row);
        
        // 提示成功
        alert('评论删除成功！');
    }
}

// 删除举报
function deleteReport(title, row) {
    if (confirm(`确定要删除对帖子"${title}"的举报吗？`)) {
        // 这里添加删除举报的逻辑
        console.log('删除举报:', title);
        
        // 从表格中移除该行
        row.remove();
        
        // 提示成功
        alert('举报删除成功！');
    }
}

// 更新举报状态
function updateReportStatus(row, status) {
    const statusCell = row.cells[4];
    const statusSpan = statusCell.querySelector('.status');
    statusSpan.className = `status ${status}`;
    statusSpan.textContent = status === 'processed' ? '已处理' : '待处理';
}

// 禁用操作按钮
function disableActionButtons(row) {
    const buttons = row.querySelectorAll('.action-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

// 加载指定页码的举报数据
function loadReportsPage(page) {
    console.log('加载第', page, '页举报');
    // 这里添加分页加载逻辑
} 