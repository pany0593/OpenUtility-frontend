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
            searchReviews(searchText);
        }
    });

    // 筛选功能
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterReviews);

    // 通过按钮
    document.querySelectorAll('.approve-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            approveReview(username, dormitory, row);
        });
    });

    // 拒绝按钮
    document.querySelectorAll('.reject-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            rejectReview(username, dormitory, row);
        });
    });

    // 详情按钮
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            showReviewDetail(username, dormitory);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadReviewsPage(this.textContent);
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

// 搜索复查申请
function searchReviews(keyword) {
    console.log('搜索复查申请:', keyword);
    // 这里添加搜索逻辑
}

// 筛选复查申请
function filterReviews() {
    const status = document.getElementById('statusFilter').value;
    console.log('筛选状态:', status);
    // 这里添加筛选逻辑
}

// 通过复查
function approveReview(username, dormitory, row) {
    if (confirm(`确定通过 ${username}（${dormitory}）的复查申请吗？`)) {
        // 这里添加通过复查的逻辑
        console.log('通过复查:', { username, dormitory });
        
        // 更新状态显示
        const statusCell = row.cells[7];
        statusCell.innerHTML = '<span class="status approved">已通过</span>';
        
        // 禁用操作按钮
        const buttons = row.querySelectorAll('.approve-btn, .reject-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // 提示成功
        alert('复查申请已通过！');
    }
}

// 拒绝复查
function rejectReview(username, dormitory, row) {
    if (confirm(`确定拒绝 ${username}（${dormitory}）的复查申请吗？`)) {
        // 这里添加拒绝复查的逻辑
        console.log('拒绝复查:', { username, dormitory });
        
        // 更新状态显示
        const statusCell = row.cells[7];
        statusCell.innerHTML = '<span class="status rejected">已拒绝</span>';
        
        // 禁用操作按钮
        const buttons = row.querySelectorAll('.approve-btn, .reject-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // 提示成功
        alert('复查申请已拒绝！');
    }
}

// 显示复查详情
function showReviewDetail(username, dormitory) {
    // 这里添加显示详情的逻辑
    console.log('查看详情:', { username, dormitory });
    alert('查看详情功能开发中...');
}

// 加载指定页码的复查数据
function loadReviewsPage(page) {
    console.log('加载第', page, '页复查');
    // 这里添加分页加载逻辑
} 