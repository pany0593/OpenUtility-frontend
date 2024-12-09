document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 获取URL参数中的账单ID
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('billId');
    console.log('ID is:',billId);
    // 获取表单元素
    loadBillData(billId);

    const billEditForm = document.getElementById('billEditForm');
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
async function loadBillData(billId1) {
    try {
        // 1. 请求头配置
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            id: billId1
        });
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
         };
         
        const response = await fetch("http://120.24.176.40:80/api/bill/getAllData", requestOptions);
        // 4. 检查响应是否成功
        // 5. 如果请求成功，解析返回的 JSON 数据
        const data1 = await response.json();
        console.log(data1.data);

        // 6. 处理返回数据
        if (data1.base.code === 0) {
            // 遍历并填充表单
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
        // 7. 错误处理
        console.error('加载账单数据失败:', err);
        alert('加载账单数据失败，请稍后重试');
    }
}
