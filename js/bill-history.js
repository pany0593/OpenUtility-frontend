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

    // 初始化图表
    initializeChart();

    // 添加窗口大小改变事件监听器
    addResizeListener();

    // 退出登录功能
    setupLogoutHandler();
});

// 初始化 ECharts 图表
function initializeChart() {
    const chartDom = document.getElementById('billTrendChart');
    if (!chartDom) {
        console.error('Error: Unable to find chart container.');
        return;
    }

    const billTrendChart = echarts.init(chartDom);

    // 配置选项
    const chartOptions = getChartOptions();
    billTrendChart.setOption(chartOptions);

    // 绑定图表重新绘制
    window.billTrendChart = billTrendChart;
}

// 获取图表配置
function getChartOptions() {
    return {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['水费', '电费', '总费用'],
            bottom: 10,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: ['10月', '11月', '12月', '1月', '2月', '3月'],
        },
        yAxis: {
            type: 'value',
            name: '费用（元）',
        },
        series: [
            {
                name: '水费',
                type: 'bar',
                data: [45, 48, 52, 50, 47, 50],
                itemStyle: {
                    color: 'rgb(57, 98, 214)',
                },
            },
            {
                name: '电费',
                type: 'bar',
                data: [90, 95, 105, 100, 95, 100],
                itemStyle: {
                    color: 'rgb(82, 196, 26)',
                },
            },
            {
                name: '总费用',
                type: 'line',
                data: [135, 143, 157, 150, 142, 150],
                itemStyle: {
                    color: 'rgb(255, 77, 79)',
                },
                lineStyle: {
                    width: 3,
                },
                symbol: 'circle',
                symbolSize: 8,
            },
        ],
    };
}

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
async function searchBills() {
    try {
        // 获取表单数据
        const formData = {
            year: parseInt(document.getElementById('year').value) || undefined,
            month: parseInt(document.getElementById('month').value) || undefined,
            days: parseInt(document.getElementById('days').value) || undefined,
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
        const queryString = new URLSearchParams(formData).toString();

        // 发送查询请求
        const response = await fetch(`http://120.24.176.40:80/api/bill/getDataByDormitory?${queryString}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

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
        alert('查询失败,请稍后重试');
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
