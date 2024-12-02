document.addEventListener('DOMContentLoaded', function () {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 筛选功能
    const buildingFilter = document.getElementById('buildingFilter');
    const timeFilter = document.getElementById('timeFilter');
    const typeFilter = document.getElementById('typeFilter');

    // 监听筛选条件变化
    [buildingFilter, timeFilter, typeFilter].forEach((filter) =>
        filter.addEventListener('change', updateRanking)
    );

    // 初始化排名
    updateRanking();

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach((btn) =>
        btn.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadRankingPage(this.textContent);
            }
        })
    );

    // 高亮当前用户所在宿舍
    highlightCurrentDorm();
});

// 更新排行榜
function updateRanking() {
    const filters = {
        building: document.getElementById('buildingFilter').value,
        time: document.getElementById('timeFilter').value,
        type: document.getElementById('typeFilter').value,
    };

    console.log('更新排行榜:', filters);

    // 排序后重新更新排名序号
    sortAndUpdateRanking();
}

// 排名按总费用降序排序并更新序号
function sortAndUpdateRanking() {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    rows.sort((a, b) => {
        const costA = parseFloat(a.cells[5].textContent.replace(/[¥,]/g, ''));
        const costB = parseFloat(b.cells[5].textContent.replace(/[¥,]/g, ''));
        return costB - costA; // 按总费用降序排序
    });

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // 清空原始内容

    rows.forEach((row, index) => {
        // 更新序号
        const rankCell = row.cells[0];
        rankCell.innerHTML = `<span class="rank rank-${index + 1}">${index + 1}</span>`;
        tbody.appendChild(row);
    });

    console.log('表格排序并更新排名序号完成');
}

// 加载指定页码的排行数据
function loadRankingPage(page) {
    console.log('加载第', page, '页排行');
    // 这里可以添加分页加载逻辑
}

// 高亮显示当前用户所在宿舍
function highlightCurrentDorm() {
    const currentDorm = { building: '1号楼', room: '101' };
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row) => {
        const building = row.children[1].textContent;
        const room = row.children[2].textContent;
        if (building === currentDorm.building && room === currentDorm.room) {
            row.classList.add('highlight');
        }
    });
}
