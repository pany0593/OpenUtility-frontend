document.addEventListener('DOMContentLoaded', async function () {
    // 页面加载动画
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 检查 ECharts 加载状态
    const waitForECharts = () =>
        new Promise((resolve) => {
            if (window.echarts) resolve(window.echarts);
            else {
                const script = document.querySelector('script[src*="echarts"]');
                script.addEventListener('load', () => resolve(window.echarts));
            }
        });
        const getUserInfoByToken = async () => {
            // 从 localStorage 或 sessionStorage 中获取 token
            const token = localStorage.getItem("token"); // 假设 token 存储在 localStorage 中
            console.log(token);
            if (!token) {
                console.error("没有找到用户的 token,无法查询用户信息！");
                return null;
            }
        
            try {
                const response = await fetch("http://120.24.176.40:80/api/users/profile", {
                    method: 'GET', // 使用 GET 请求
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`  // 将 token 放入 Authorization 请求头中
                    }
                });
        
                const data = await response.json();
                console.log("User Info:", data);
                const { building, dormitory } = data.data; // 假设 data.data 包含这些信息
                return { building, dormitory };
                // 假设返回的数据结构中包含 building 和 dormitory 信息
            } catch (error) {
                console.error("获取用户信息失败:", error);
                return null;
            }
        };
        const fetchData = async (month, building, dormitory) => {
            try {
                const buildingInt = parseInt(building, 10);
                const dormitoryInt = parseInt(dormitory, 10);
                console.log(building);
                console.log(dormitory);
                
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");  // 确保 Content-Type 是 application/json
                
                const raw = JSON.stringify({
                    year: 2024,
                    month: month,
                    building: buildingInt,  // 动态传递 building
                    dormitory: dormitoryInt  // 动态传递 dormitory
                });
        
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch("http://120.24.176.40:80/api/bill/getDataByDormitory", requestOptions);
                const data = await response.json();
                console.log(`Data for month ${month}:`, data);
                return data;
            } catch (error) {
                console.error(`数据请求失败 for month ${month}:`, error);
                return null;
            }
        };
    const initCharts = async () => {
        const echarts = window.echarts;
        const months = [12, 11, 10, 9];  // 月份数组（根据需求修改）
        const allPieData = [];            // 用于存储饼图的数据
        const allBarData = {              // 用于存储柱状图的数据
            water_cost: [],
            electricity_cost: [],
            total_cost: []
        };
    
        const userInfo = await getUserInfoByToken();
        console.log(userInfo);
        if (!userInfo) {
            console.error("无法获取用户信息，无法进行数据查询。");
            return;
        }

        const { building, dormitory } = userInfo;  // 从用户信息中提取 building 和 dormitory

        // 并行获取所有月份的数据
        const promises = months.map(month => fetchData(month, building, dormitory));
        const results = await Promise.all(promises);

        // 处理每个月的数据
        results.forEach((data, index) => {
            if (!data || !data.data) {
                alert(`无法获取 ${months[index]} 月的数据`);
                return;
            }
    
            const monthData = data.data;  // 获取当前月份的数据
            const { water_cost, electricity_cost, total_cost } = monthData;
    
            // 饼图数据
            allPieData.push(
                { name: '同月水费', value: water_cost },
                { name: `${months[index]}月电费`, value: electricity_cost }
            );
    
            // 柱状图数据
            allBarData.water_cost.push(water_cost);
            allBarData.electricity_cost.push(electricity_cost);
            allBarData.total_cost.push(total_cost);
        });
    
        console.log("All Pie Data:", allPieData);
        console.log("All Bar Data:", allBarData);
    
        // 初始化饼图
        const pieChart = echarts.init(document.getElementById('monthPieChart'));
        pieChart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left', data: allPieData.map(item => item.name) },
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    data: allPieData.map(item => ({
                        value: item.value,
                        name: item.name,
                        itemStyle: { color: item.name === '同月水费' ? 'rgb(57, 98, 214)' : 'rgb(82, 196, 26)' }
                    })),
                },
            ],
        });
    
        // 初始化柱状图
        const barChart = echarts.init(document.getElementById('trendBarChart'));
        barChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['水费', '电费', '总费用'], bottom: 0 },
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
            xAxis: { type: 'category', data: months.reverse().map(m => `${m}月`) },  // 动态生成x轴月份
            yAxis: { type: 'value', name: '费用（元）' },
            series: [
                { name: '水费', type: 'bar', data: allBarData.water_cost, itemStyle: { color: 'rgb(57, 98, 214)' } },
                { name: '电费', type: 'bar', data: allBarData.electricity_cost, itemStyle: { color: 'rgb(82, 196, 26)' } },
                { name: '总费用', type: 'line', data: allBarData.total_cost, itemStyle: { color: 'rgb(255, 77, 79)' } },
            ],
        });
    
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            pieChart.resize();
            barChart.resize();
        });
    
        console.log('图表初始化完成');
    };
    
    initCharts();
    
    // 绑定导出按钮
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            console.log('导出分析报告');
            alert('分析报告导出成功！');
        });
    }

    // 退出登录逻辑
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) window.location.href = 'index.html';
    });
});
