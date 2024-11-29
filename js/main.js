// 使用立即执行函数避免全局变量污染
(function() {
    // 创建一个Promise来管理图表初始化
    const chartsPromise = new Promise((resolve) => {
        if (window.echarts) {
            resolve();
        } else {
            document.querySelector('script[src*="echarts"]').addEventListener('load', resolve);
        }
    });

    // 初始化函数
    async function initializePage() {
        try {
            // 等待图表库加载完成
            await chartsPromise;
            
            // 初始化图表
            initializeCharts();
            
            // 设置事件监听器
            setupEventListeners();
            
            // 移除加载指示器，显示内容
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.layout').classList.add('loaded');
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 图表初始化函数
    function initializeCharts() {
        // 使用requestAnimationFrame确保在下一帧渲染图表
        requestAnimationFrame(() => {
            const usagePieChart = echarts.init(document.getElementById('usagePieChart'));
            const historyBarChart = echarts.init(document.getElementById('historyBarChart'));

            // 使用简化的配置选项
            const pieOption = {
                series: [{
                    type: 'pie',
                    radius: '50%',
                    data: [
                        {value: 50, name: '水费'},
                        {value: 100, name: '电费'}
                    ]
                }]
            };

            const barOption = {
                xAxis: {
                    type: 'category',
                    data: ['10月', '11月', '12月', '1月', '2月', '3月']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '水费',
                    type: 'bar',
                    data: [45, 48, 52, 50, 47, 50]
                }, {
                    name: '电费',
                    type: 'bar',
                    data: [90, 95, 105, 100, 95, 100]
                }]
            };

            // 使用防抖优化resize事件
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    usagePieChart.resize();
                    historyBarChart.resize();
                }, 250);
            });

            usagePieChart.setOption(pieOption);
            historyBarChart.setOption(barOption);
        });
    }

    // 图片加载错误处理
    function handleImageError(img, type) {
        img.onerror = null; // 防止循环调用
        if (type === 'logo') {
            img.src = 'https://via.placeholder.com/200x200.png?text=Logo';
        } else if (type === 'avatar') {
            img.src = 'https://via.placeholder.com/128x128.png?text=Avatar';
        }
    }

    // 事件监听器设置
    function setupEventListeners() {
        document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('确定要退出登录吗？')) {
                window.location.href = 'index.html';
            }
        });
        
        // 添加图片错误处理
        const logoImg = document.querySelector('.logo img');
        const avatarImg = document.querySelector('.avatar');
        
        if (logoImg) {
            logoImg.onerror = () => handleImageError(logoImg, 'logo');
        }
        if (avatarImg) {
            avatarImg.onerror = () => handleImageError(avatarImg, 'avatar');
        }
    }

    // 当DOM加载完成后初始化页面
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }
})(); 