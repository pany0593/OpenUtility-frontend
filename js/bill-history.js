document.addEventListener('DOMContentLoaded', function () {
    // 获取表单元素
    const searchForm = document.getElementById('searchForm');
    
    // 表单提交处理
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await searchBills();
    });

    // 重置按钮处理
    searchForm.addEventListener('reset', function() {
        document.getElementById('resultTableBody').innerHTML = '';
    });

    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }
    // 添加窗口大小改变事件监听器
    addResizeListener();

    // 退出登录功能
    setupLogoutHandler();
});
// 处理窗口大小调整事件
function addResizeListener() {
    window.addEventListener('resize', function () {
        if (window.billTrendChart) {
            window.billTrendChart.resize();
        }
    });
}

// 绑定退出登录按钮事件
function setupLogoutHandler() {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';
            }
        });
    } else {
        console.warn('Warning: Logout button not found.');
    }
}

// 查询账单
// 查询账单
async function searchBills() {
    try {
        // 获取表单数据
        const formData = {
            year: parseInt(document.getElementById('year').value) || undefined,
            month: parseInt(document.getElementById('month').value) || undefined,
            building: parseInt(document.getElementById('building').value) || undefined,
            dormitory: parseInt(document.getElementById('dormitory').value) || undefined
        };

        // 移除undefined的字段
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined) {
                delete formData[key];
            }
        });
        
        // 构建查询参数
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // 使用 formData 生成请求体
        const raw = JSON.stringify(formData);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("http://120.24.176.40:80/api/bill/getDataByDormitory", requestOptions);
        
        const data1 = await response.json();
        console.log(data1);

        if (data1.base.code === 0) {
            // 渲染查询结果
            renderResults(data1.data);
        } else {
            alert(data1.message || '查询失败');
        }
    } catch (err) {
        console.error('查询失败:', err);
        alert('查询失败, 请稍后重试');
    }
}


// 渲染查询结果
function renderResults(bills) {
    const tableBody = document.getElementById('resultTableBody');
    
    // 如果返回单个对象,转换为数组
    if (!Array.isArray(bills)) {
        bills = [bills];
    }
    // 生成表格行HTML
    const rowsHtml = bills.map(bill => `
        <tr>
            <td>${bill.year || '-'}</td>
            <td>${bill.month || '-'}</td>
            <td>${bill.days || '-'}</td>
            <td>${bill.building || '-'}</td>
            <td>${bill.dormitory || '-'}</td>
            <td>${formatNumber(bill.electricity_usage)}</td>
            <td>${formatNumber(bill.electricity_cost)}</td>
            <td>${formatNumber(bill.water_uasge)}</td>
            <td>${formatNumber(bill.water_cost)}</td>
            <td>${formatNumber(bill.total_cost)}</td>
        </tr>
    `).join('');

    // 更新表格内容
    tableBody.innerHTML = rowsHtml || '<tr><td colspan="11">暂无数据</td></tr>';
}

// 格式化数字,保留2位小数
function formatNumber(num) {
    if (num === undefined || num === null) return '-';
    return Number(num).toFixed(2);
}
