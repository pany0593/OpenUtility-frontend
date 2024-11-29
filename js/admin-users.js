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
            searchUsers(searchText);
        }
    });

    // 筛选功能
    const buildingFilter = document.getElementById('buildingFilter');
    const statusFilter = document.getElementById('statusFilter');

    [buildingFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', filterUsers);
    });

    // 编辑按钮
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            window.location.href = `admin-user-edit.html?id=${userId}`;
        });
    });

    // 删除按钮
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            deleteUser(userId);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadUsersPage(this.textContent);
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

// 搜索用户
function searchUsers(keyword) {
    console.log('搜索用户:', keyword);
    // 这里添加搜索逻辑
}

// 筛选用户
function filterUsers() {
    const filters = {
        building: document.getElementById('buildingFilter').value,
        status: document.getElementById('statusFilter').value
    };
    console.log('筛选条件:', filters);
    // 这里添加筛选逻辑
}

// 编辑用户
function editUser(userId) {
    console.log('编辑用户:', userId);
    // 这里添加编辑用户的逻辑
    window.location.href = `admin-user-edit.html?id=${userId}`;
}

// 删除用户
function deleteUser(userId) {
    if (confirm('确定要删除该用户吗？此操作不可恢复。')) {
        console.log('删除用户:', userId);
        // 这里添加删除用户的逻辑
    }
}

// 加载指定页码的用户数据
function loadUsersPage(page) {
    console.log('加载第', page, '页用户数据');
    // 这里添加分页加载逻辑
} 