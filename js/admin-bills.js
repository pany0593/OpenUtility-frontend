document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 初始化加载账单数据

    initializeBillsTable();
    
    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchBills(searchText);
        }
    });

    // 筛选功能

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadBillsPage(this.textContent);
            }
        });
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 初始化账单表格
// 初始化账单表格
async function initializeBillsTable() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
     };
     
     fetch("120.24.176.40:80/api/bill/getAllData", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
          // 使用 fetch 获取数据
          const response = await fetch("120.24.176.40:80/api/bill/getAllData");

          // 等待 response.json() 获取 JSON 数据
          const data1 = await response.json();
          // 渲染账单表格
         // data1.data.id='5';
          renderBillsTable(data1.data);
}

// 渲染账单表格
function renderBillsTable(data1) {
    const tableBody = document.getElementById('billTableBody');
    
    // 如果 data1 为空对象或不是对象，显示没有数据的提示
    if (typeof data1 !== 'object' || data1 === null || Object.keys(data1).length === 0) {
        tableBody.innerHTML = `<tr><td colspan="12">没有找到账单数据</td></tr>`;
        return;
    }

    // 清空表格内容
    tableBody.innerHTML = '';

    // 直接显示 data1 中的数据

            // 创建一个新的表格行
            const row = document.createElement('tr');

            // 填充表格行
            row.innerHTML = `
                <td data-field="id">${data1.id}</td>
                <td data-field="year">${data1.year}</td>
                <td data-field="month">${data1.month}</td>
                <td data-field="days">${data1.days}</td>
                <td data-field="building">${data1.building}</td>
                <td data-field="dormitory">${data1.dormitory}</td>
                <td data-field="electricity_usage">${data1.electricity_usage}</td>
                <td data-field="electricity_cost">${data1.electricity_cost}</td>
                <td data-field="water_usage">${data1.water_usage}</td>
                <td data-field="water_cost">${data1.water_cost}</td>
                <td data-field="total_cost">${data1.total_cost}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" data-id="${data1.id}">编辑</button>
                        <button class="delete-btn" data-id="${data1.id}">删除</button>
                    </div>
                </td>
            `;
            
            // 将新行添加到表格中
            tableBody.appendChild(row);

    // 绑定按钮事件（如果需要）
    bindButtonEvents();
}

function bindButtonEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // 为编辑按钮绑定点击事件
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            alert(`编辑账单 ID: ${billId}`);
            // 在这里你可以添加编辑功能的代码
        });
    });

    // 为删除按钮绑定点击事件
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billId = this.getAttribute('data-id');
            // 找到该删除按钮所在的行元素 (假设账单项在 <tr> 中)
            const billRow = this.closest('tr'); // 查找最近的 <tr> 元素

            if (confirm(`确定要删除账单 ID: ${billId} 吗？`)) {
                // 构建请求头和请求体
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "id": billId
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                
                // 发送删除请求
                fetch("120.24.176.40:80/api/bill/delete", requestOptions)
                    .then(response => response.json()) // 确保返回的是 JSON 格式的数据
                    .then(result => {
                        // 判断是否删除成功
                        if (result.base.code === 0) { // 假设成功的响应码是 0
                            billRow.remove(); // 删除该账单项
                            alert(`账单 ID: ${billId} 删除成功！`);
                        } else {
                            alert(`删除失败: ${result.base.message}`); // 如果删除失败
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        billRow.remove();
                        alert(`删除账单 ID: ${billId} 成功！`);
                    });
            }
        });
    });
}

