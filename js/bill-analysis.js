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

    // 初始化图表
    const initCharts = async () => {
        const echarts = await waitForECharts();

        // 初始化饼图
        const pieChart = echarts.init(document.getElementById('monthPieChart'));
        pieChart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left', data: ['水费', '电费'] },
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    data: [
                        { value: 50, name: '水费', itemStyle: { color: 'rgb(57, 98, 214)' } },
                        { value: 100, name: '电费', itemStyle: { color: 'rgb(82, 196, 26)' } },
                    ],
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
                { name: '水费', type: 'bar', data: [45, 48, 52, 50, 47, 50], itemStyle: { color: 'rgb(57, 98, 214)' } },
                { name: '电费', type: 'bar', data: [90, 95, 105, 100, 95, 100], itemStyle: { color: 'rgb(82, 196, 26)' } },
                { name: '总费用', type: 'line', data: [135, 143, 157, 150, 142, 150], itemStyle: { color: 'rgb(255, 77, 79)' } },
            ],
        });

        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            pieChart.resize();
            barChart.resize();
        });

        console.log('图表初始化完成');
    };

    await initCharts();

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
