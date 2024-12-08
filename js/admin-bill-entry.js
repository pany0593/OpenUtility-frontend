document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取表单元素
    const billEntryForm = document.getElementById('billEntryForm');
    if (!billEntryForm) {
        console.error('Form element not found!');
        return;
    }

    // 自动计算总费用
    function calculateTotal() {
        const waterCostElement = document.getElementById('waterCost');
        const electricityCostElement = document.getElementById('electricityCost');
        
        const waterCost = parseFloat(waterCostElement ? waterCostElement.value : 0) || 0;
        const electricityCost = parseFloat(electricityCostElement ? electricityCostElement.value : 0) || 0;
        
        const totalCostElement = document.getElementById('totalCost');
        if (totalCostElement) {
            totalCostElement.value = (waterCost + electricityCost).toFixed(2);
        }
    }

    // 监听费用输入变化
    const waterCostInput = document.getElementById('waterCost');
    const electricityCostInput = document.getElementById('electricityCost');
    
    if (waterCostInput) {
        waterCostInput.addEventListener('input', calculateTotal);
    }
    
    if (electricityCostInput) {
        electricityCostInput.addEventListener('input', calculateTotal);
    }

    // 表单提交处理
    billEntryForm.addEventListener('submit', async function(e) {
        e.preventDefault();  // 阻止表单的默认提交行为

        // 获取表单中的数据，添加空值检查
        const idElement = document.getElementById('id');
        const id = idElement ? idElement.value : "string";
        
        const yearElement = document.getElementById('year');
        const year = yearElement ? parseInt(yearElement.value) : 0;

        const monthElement = document.getElementById('month');
        const month = monthElement ? parseInt(monthElement.value) : 0;

        const daysElement = document.getElementById('days');
        const days = daysElement ? parseInt(daysElement.value) : 0;

        const buildingElement = document.getElementById('building');
        const building = buildingElement ? parseInt(buildingElement.value) : 0;

        const dormitoryElement = document.getElementById('dormitory');
        const dormitory = dormitoryElement ? parseInt(dormitoryElement.value) : 0;

        const electricityUsageElement = document.getElementById('electricityUsage');
        const electricityUsage = electricityUsageElement ? parseFloat(electricityUsageElement.value) : 0;

        const electricityCostElement = document.getElementById('electricityCost');
        const electricityCost = electricityCostElement ? parseFloat(electricityCostElement.value) : 0;

        const waterUsageElement = document.getElementById('waterUsage');
        const waterUsage = waterUsageElement ? parseFloat(waterUsageElement.value) : 0;

        const waterCostElement = document.getElementById('waterCost');
        const waterCost = waterCostElement ? parseFloat(waterCostElement.value) : 0;

        const totalCostElement = document.getElementById('totalCost');
        const totalCost = totalCostElement ? parseFloat(totalCostElement.value) : 0;

        // 构建请求体
        const raw = JSON.stringify({
            id: id,
            year: year,
            month: month,
            days: days,
            building: building,
            dormitory: dormitory,
            electricity_usage: electricityUsage,
            electricity_cost: electricityCost,
            water_usage: waterUsage,
            water_cost: waterCost,
            total_cost: totalCost
        });

        // 设置请求头
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // 发起请求
        fetch("120.24.176.40:80/api/bill/add", requestOptions)
            .then(response => response.text())
            .then(result => console.log("Response:", result))
            .catch(error => console.error("Error:", error));
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});
