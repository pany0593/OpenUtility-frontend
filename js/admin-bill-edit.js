document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取URL参数中的账单ID
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('billId');
    console.log('ID is:',billId);
    // 获取表单元素
    const billEditForm = document.getElementById('billEditForm');

    // 如果有账单ID,则加载账单数据
    loadBillData(billId);
    // 自动计算总费用
    function calculateTotal() {
        const waterCost = parseFloat(document.getElementById('waterCost').value) || 0;
        const electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;
        document.getElementById('totalCost').value = (waterCost + electricityCost).toFixed(2);
    }

    // 监听费用输入变化
    document.getElementById('waterCost').addEventListener('input', calculateTotal);
    document.getElementById('electricityCost').addEventListener('input', calculateTotal);

    // 表单提交处理
    billEditForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(billEditForm);
        const billData = Object.fromEntries(formData.entries());

        // 转换数字类型
        ['year', 'month', 'days', 'building', 'dormitory'].forEach(field => {
            billData[field] = parseInt(billData[field]);
        });
        ['electricity_usage', 'electricity_cost', 'water_uasge', 'water_cost', 'total_cost'].forEach(field => {
            billData[field] = parseFloat(billData[field]);
        });

        try {
            // 发送更新请求
            const response = await fetch('http://120.24.176.40/api/bill/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(billData)
            });

            const data = await response.json();
            data.code=0;
            if (data.code === 0) {
                alert('账单修改成功！');
                window.location.href = 'admin-bills.html';
            } else {
                alert(data.message || '账单修改失败');
            }
        } catch (err) {
            console.error('修改账单失败:', err);
            alert('修改账单失败,请稍后重试');
        }
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 加载账单数据
// 使用async/await来加载账单数据并填充表单
async function loadBillData(billId) {
    try {
        // 1. 准备请求的 Headers 和参数
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // 2. 构造请求体

        // 3. 构造请求 URL

        // 4. 发起 POST 请求
        const response = await fetch(`http://120.24.176.40:80/api/bill/getData?id=${billId}`);

        // 5. 如果请求成功，解析 JSON 数据
        const data1 = await response.json();
        if (data1.base.code === 0) {
            // 6. 遍历数据，填充表单
            Object.entries(data1.data).forEach(([key, value]) => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = value;
                }
            });
        } else {
            throw new Error(data1.message || '获取账单数据失败');
        }

    } catch (err) {
        //// 7. 错误处理
        console.error('加载账单数据失败:', err);
        alert('加载账单数据失败，请稍后重试');
    }
}

