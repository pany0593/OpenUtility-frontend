document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchAnnouncements(searchText);
        }
    });

    // 筛选功能
    const timeFilter = document.getElementById('timeFilter');
    const typeFilter = document.getElementById('typeFilter');

    timeFilter.addEventListener('change', function() {
        filterAnnouncements();
    });

    typeFilter.addEventListener('change', function() {
        filterAnnouncements();
    });

    // 查看详情按钮
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const announcementItem = this.closest('.announcement-item');
            const title = announcementItem.querySelector('h3').textContent;
            showAnnouncementDetail(title);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadAnnouncementPage(this.textContent);
            }
        });
    });

    // 退出登录
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if(confirm('确定要退出登录吗？')) {
            window.location.href = 'index.html';
        }
    });
});

// 搜索公告
function searchAnnouncements(keyword) {
    console.log('搜索公告:', keyword);
    // 这里添加搜索逻辑
}

// 筛选公告
function filterAnnouncements() {
    const timeValue = document.getElementById('timeFilter').value;
    const typeValue = document.getElementById('typeFilter').value;
    console.log('筛选条件:', { time: timeValue, type: typeValue });
    // 这里添加筛选逻辑
}

// 加载指定页码的公告
function loadAnnouncementPage(page) {
    console.log('加载第', page, '页公告');
    // 这里添加分页加载逻辑
}

// 显示公告详情
function showAnnouncementDetail(title) {
    console.log('查看公告详情:', title);
    // 这里添加显示详情的逻辑
    alert('正在开发中...');
} 