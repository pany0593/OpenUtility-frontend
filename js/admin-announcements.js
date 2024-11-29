document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 加载公告列表
    loadAnnouncements();

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchAnnouncements(searchText);
        } else {
            loadAnnouncements(); // 搜索框为空时显示所有公告
        }
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 加载公告列表
function loadAnnouncements() {
    const tbody = document.querySelector('.announcements-table tbody');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    // 清空现有内容
    tbody.innerHTML = '';
    
    // 添加公告列表
    announcements.forEach(announcement => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${announcement.title}</td>
            <td>${announcement.content}</td>
            <td>${formatDate(announcement.timestamp)}</td>
            <td>${announcement.publisher}</td>
            <td>
                <button class="delete-btn" onclick="deleteAnnouncement('${announcement.timestamp}')">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 搜索公告
function searchAnnouncements(keyword) {
    const tbody = document.querySelector('.announcements-table tbody');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    // 过滤匹配的公告
    const filteredAnnouncements = announcements.filter(announcement => 
        announcement.title.includes(keyword) || 
        announcement.content.includes(keyword)
    );
    
    // 清空现有内容
    tbody.innerHTML = '';
    
    // 显示搜索结果
    filteredAnnouncements.forEach(announcement => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${announcement.title}</td>
            <td>${announcement.content}</td>
            <td>${formatDate(announcement.timestamp)}</td>
            <td>${announcement.publisher}</td>
            <td>
                <button class="delete-btn" onclick="deleteAnnouncement('${announcement.timestamp}')">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 删除公告
function deleteAnnouncement(timestamp) {
    if (confirm('确定要删除这条公告吗？此操作不可恢复。')) {
        let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements = announcements.filter(a => a.timestamp !== timestamp);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        
        // 重新加载列表
        loadAnnouncements();
        
        // 提示成功
        alert('公告删除成功！');
    }
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
} 