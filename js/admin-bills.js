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
    const buildingFilter = document.getElementById('buildingFilter');
    const monthFilter = document.getElementById('monthFilter');
    const statusFilter = document.getElementById('statusFilter');

    [buildingFilter, monthFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', filterBills);
    });

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
async function initializeBillsTable() {
    try {
        // 从后端获取账单数据
        const response = await fetch('/bill/getData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.code === 0) {
            // 渲染账单数据
            renderBillsTable(data.data);
        } else {
            throw new Error(data.message || '获取账单数据失败');
        }
    } catch (err) {
        console.error('初始化账单表格失败:', err);
        alert('加载账单数据失败,请稍后重试');
    }
}

// 渲染账单表格
function renderBillsTable(bills) {
    const tableBody = document.getElementById('billTableBody');
    tableBody.innerHTML = bills.map(bill => `
        <tr data-id="${bill.id}">
            <td data-field="id">${bill.id}</td>
            <td data-field="year">${bill.year}</td>
            <td data-field="month">${bill.month}</td>
            <td data-field="days">${bill.days}</td>
            <td data-field="building">${bill.building}</td>
            <td data-field="dormitory">${bill.dormitory}</td>
            <td data-field="electricity_usage">${bill.electricity_usage}</td>
            <td data-field="electricity_cost">${bill.electricity_cost}</td>
            <td data-field="water_uasge">${bill.water_uasge}</td>
            <td data-field="water_cost">${bill.water_cost}</td>
            <td data-field="total_cost">${bill.total_cost}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editBill('${bill.id}')">编辑</button>
                    <button class="delete-btn" onclick="deleteBill('${bill.id}')">删除</button>
                </div>
            </td>
        </tr>
    `).join('');

    // 重新绑定按钮事件
    bindButtonEvents();
}

// 绑定按钮事件
function bindButtonEvents() {
    // 编辑按钮
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const billId = this.closest('tr').dataset.id;
            editBill(billId);
        });
    });

    // 删除按钮
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const billId = this.closest('tr').dataset.id;
            deleteBill(billId);
        });
    });
}



// 编辑账单
function editBill(billId) {
    console.log('编辑账单:', billId);
    // 这里添加编辑账单的逻辑
    window.location.href = `admin-bill-edit.html?id=${billId}`;
}

// 删除账单
async function deleteBill(billId) {
    if (confirm('确定要删除该账单吗？此操作不可恢复。')) {
        try {
            // 获取要删除的账单行
            const row = document.querySelector(`tr[data-id="${billId}"]`);
            if (!row) {
                throw new Error('找不到要删除的账单数据');
            }

            // 构建删除请求的数据
            const billData = {
                id: billId,
                year: parseInt(row.querySelector('[data-field="year"]').textContent),
                month: parseInt(row.querySelector('[data-field="month"]').textContent),
                days: parseInt(row.querySelector('[data-field="days"]').textContent),
                building: parseInt(row.querySelector('[data-field="building"]').textContent),
                dormitory: parseInt(row.querySelector('[data-field="dormitory"]').textContent),
                electricity_usage: parseFloat(row.querySelector('[data-field="electricity_usage"]').textContent),
                electricity_cost: parseFloat(row.querySelector('[data-field="electricity_cost"]').textContent),
                water_uasge: parseFloat(row.querySelector('[data-field="water_uasge"]').textContent),
                water_cost: parseFloat(row.querySelector('[data-field="water_cost"]').textContent),
                total_cost: parseFloat(row.querySelector('[data-field="total_cost"]').textContent)
            };

            // 发送删除请求
            const response = await fetch('/bill/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(billData)
            });

            const data = await response.json();
            
            if (data.code === 0) {
                // 删除成功,从DOM中移除该行
                row.remove();
                alert('账单删除成功！');
            } else {
                alert(data.message || '账单删除失败');
            }
        } catch (err) {
            console.error('删除账单失败:', err);
            alert('删除账单失败,请稍后重试');
        }
    }
}

