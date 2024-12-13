document.addEventListener('DOMContentLoaded', function () {
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 绑定退出登录按钮的点击事件
    document.querySelector('.logout-btn')?.addEventListener('click', function () {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        }
    });

    const API_URL = "http://120.24.176.40:80/api/bill/rangeByMonth";
    const rankingList = document.getElementById('ranking-list');
    const paginationControls = document.getElementById('pagination-controls');
    const yearInput = document.getElementById('yearInput');
    const monthInput = document.getElementById('monthInput');
    const searchButton = document.getElementById('searchButton');
    let currentPage = 1;
    const pageSize = 5; // 每页显示的条数

    // 点击查询按钮
    searchButton.addEventListener('click', () => {
        currentPage = 1; // 重置到第一页
        updateRanking();
    });

    // 更新排行榜
    function updateRanking() {
        const year = parseInt(yearInput.value, 10);
        const month = parseInt(monthInput.value, 10);

        if (isNaN(year) || isNaN(month) || year < 2000 || year > 2100 || month < 1 || month > 12) {
            alert("请输入有效的年份和月份！");
            return;
        }

        fetchRankingData({ year, month });
    }


    
    
// 获取排行榜数据
async function fetchRankingData(filters) {
    rankingList.innerHTML = "<tr><td colspan='6'>加载中...</td></tr>"; // 显示加载提示
    paginationControls.innerHTML = ""; // 清空分页控件

    // 构造请求体
    const requestBody = {
        year: filters.year,
        month: filters.month
    };

    console.log("发送到后端的请求体:", requestBody);

    try {
        const response = await fetch('http://120.24.176.40:80/api/bill/rangeByMonth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("后端返回的数据:", data);

        // 检查返回的数据是否符合预期
        if (data.base.code === 0) {
            if (Array.isArray(data.data) && data.data.length > 0) {
                // 对 data.data 按 total_cost 升序排序
                const sortedData = data.data.sort((a, b) => a.total_cost - b.total_cost);

                const totalRecords = sortedData.length;
                const totalPages = Math.ceil(totalRecords / pageSize);
                const paginatedData = sortedData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                );

                renderRankingList(paginatedData);
                renderPagination(totalPages);
            } else {
                rankingList.innerHTML = "<tr><td colspan='6'>暂无相关数据</td></tr>";
            }
        } else {
            rankingList.innerHTML = `<tr><td colspan='6'>错误: ${data.base.message || '未知错误'}</td></tr>`;
        }
    } catch (error) {
        console.error("获取排行榜数据时出错:", error);
        rankingList.innerHTML = "<tr><td colspan='6'>加载失败，请稍后重试</td></tr>";
    }
}


    






    // 渲染排行榜表格
    function renderRankingList(data) {
        rankingList.innerHTML = ""; // 清空旧内容
    
        data.forEach((item, index) => {
            const rank = (currentPage - 1) * pageSize + index + 1; // 根据数组位置计算排名
            let rankClass = "rank"; // 默认排名样式
    
            // 为前三名设置特殊样式
            if (rank === 1) {
                rankClass = "rank-1";
            } else if (rank === 2) {
                rankClass = "rank-2";
            } else if (rank === 3) {
                rankClass = "rank-3";
            }
    
            // 根据奇偶数设置背景颜色
            const rowClass = rank % 2 === 0 ? "even-row" : "odd-row";
    
            const buildingName = `${item.building}号楼`; // 将 building 转换为字符串形式
            const row = document.createElement("tr");
            row.classList.add(rowClass); // 添加背景颜色类
            row.innerHTML = `
                <td><span class="rank ${rankClass}">${rank}</span></td>
                <td>${buildingName}</td>
                <td>${item.dormitory}</td>
                <td>${item.water_usage.toFixed(1)}</td>
                <td>${item.electricity_usage.toFixed(1)}</td>
                <td>¥${item.total_cost.toFixed(2)}</td>
            `;
            rankingList.appendChild(row);
        });
    }
    

    



    // 渲染分页控件
    function renderPagination(totalPages) {
        paginationControls.innerHTML = ""; // 清空旧分页控件

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("page-btn");
            if (i === currentPage) button.classList.add("active");

            button.addEventListener("click", () => {
                currentPage = i;
                updateRanking();
            });

            paginationControls.appendChild(button);
        }
    }
});
