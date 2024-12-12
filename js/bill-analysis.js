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

    // 请求后端数据
    const fetchData1 = async () => {
        try {
            // 从 localStorage 获取 token
            const token = localStorage.getItem("token");
            
            // 如果没有获取到 token，抛出错误
            if (!token) {
                console.error('Token 未找到');
                return null;
            }

            // 设置请求头，包含 Authorization
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
    
            // 发起请求
            const response = await fetch("http://120.24.176.40:80/api/users/profile", requestOptions);
              
            // 解析 JSON 响应
            const data1 = await response.json();
            console.log(data1);
            return data1;
    
        } catch (error) {
            console.error('数据请求失败:', error);
            return null;
        }
    };    
    const fetchData = async (month) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                year: 2024,
                month: month,
                building: 33,
                dormitory: 101
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

        const months = [12, 11, 10, 9]; // 从12月到9月
        const allPieData = [];
        const allBarData = { water_cost: [], electricity_cost: [], total_cost: [] };

        // 获取每个月的数据
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            const data = await fetchData(month); // 获取当前月的数据

            if (!data) {
                alert(`无法获取 ${month} 月的数据`);
                return;
            }

            // 确保 data.data.pieData 是数组类型
            const pieData = data.data.pieData || [];
            const barData = data.data.barData || {};

            // 合并所有的饼图数据
            allPieData.push(...pieData);

            // 合并所有的柱状图数据
            allBarData.water_cost.push(...(barData.water_cost || []));
            allBarData.electricity_cost.push(...(barData.electricity_cost || []));
            allBarData.total_cost.push(...(barData.total_cost || []));
        }

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
                        itemStyle: { color: item.name === '水费' ? 'rgb(57, 98, 214)' : 'rgb(82, 196, 26)' }
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
            xAxis: { type: 'category', data: ['10月', '11月', '12月', '1月', '2月', '3月'] },
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
