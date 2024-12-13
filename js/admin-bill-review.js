document.addEventListener('DOMContentLoaded', async function() {
    await loadbill();
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchReviews(searchText);
        }
    });
     
    // 筛选功能
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterReviews);

    // 通过按钮
    document.querySelectorAll('.edit-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            approveReview(username, dormitory, row);
        });
    });

    // 拒绝按钮
    document.querySelectorAll('.reject-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            rejectReview(username, dormitory, row);
        });
    });

    // 详情按钮
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const username = row.cells[0].textContent;
            const dormitory = row.cells[1].textContent;
            showReviewDetail(username, dormitory);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadReviewsPage(this.textContent);
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
// 获取所有用户
async function loadbill() {
    try {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        const response = await fetch("http://120.24.176.40:80/api/bill/appeal/list", requestOptions);
        
        if (!response.ok) {
            throw new Error('网络错误，无法获取数据');
        }

        const data1 = await response.json();
        console.log(data1); // 查看返回的数据结构

        if (data1.base.code === 0) {
            const users = Object.values(data1.data); // 假设返回的数据结构中包含用户数组
            const userTableBody = document.getElementById('userTableBody');

            if (userTableBody) {
                userTableBody.innerHTML = ''; // 清空表格

                users.forEach(user => {
                    if (user.building === undefined || user.dormitory === undefined) {
                        console.warn(`Missing building or dormitory for user: ${JSON.stringify(user)}`);
                        return; // 跳过没有 building 或 dormitory 的用户
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.building || '未知'}</td>
                        <td>${user.dormitory}</td>
                        <td>${user.month}</td>
                        <td>${user.water_cost || '0'}</td>
                        <td>${user.electricity_cost || '0'}</td>
                        <td>${user.reason || '无'}</td>
                        <td>${user.created_time || '未知'}</td>
                        <td>${user.status || '待审核'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="edit-btn" data-id="${user.appeal_id}">通过</button>
                                <button class="delete-btn" data-id="${user.dormitory}">拒绝</button>
                            </div>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });

                bindButtonEvents(); // 确保在数据加载后重新绑定按钮事件
            } else {
                console.error('无法找到 userTableBody 元素');
            }
        } else {
            alert(data1.base.message || '获取用户列表失败');
        }
    } catch (err) {
        console.error('获取用户列表失败:', err);
        alert('获取用户列表失败，请稍后重试');
    }
}

function bindButtonEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const userId = button.getAttribute('data-id');
            const temp =1;
            const billId = 0;
            console.log('编辑用户:', userId);
            try {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify({
                    "id": "string",
                    "month": 0,
                    "year": 0,
                    "days": 0,
                    "building": 0,
                    "dormitory": 0,
                    "electricity_usage": 0,
                    "electricity_cost": 0,
                    "water_usage": 0,
                    "water_cost": 0,
                    "total_cost": 0
                });
                var requestOptions = {
                   method: 'POST',
                   headers: myHeaders,
                   body: raw,
                   redirect: 'follow'
                };
                const response = await fetch(`http://120.24.176.40:80/api/bill/appeal/resolve?appealId=${userId}&isApproved=${temp}`,requestOptions);
                alert('通过成功！');
                // 6. 处理返回数据 
                const data = await response.json();
            }
            catch (err) {
                // 7. 错误处理
                console.error('加载账单数据失败:', err);
               // alert('加载账单数据失败，请稍后重试');
            }
            // 构建跳转的 URL，传递 userId 作为查询参数
           // const editUrl = `admin-bill-edit.html?billId=${billId}`;
    
            // 跳转到编辑页面
            //window.location.href = editUrl;
        });
    });    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const userId = button.getAttribute('data-id');
            console.log('拒绝请求:', userId);
            // 这里可以添加删除逻辑，确认后发送删除请求
            if (confirm(`确定拒绝 ${userId}的复查申请吗？`)) {
                const userId = button.getAttribute('data-id');
            const temp1 = 0;
            const reason1 = "All is normal";
          //  const billId = 0;
            console.log('编辑用户:', userId);
            try {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify({
                    "id": "string",
                    "month": 0,
                    "year": 0,
                    "days": 0,
                    "building": 0,
                    "dormitory": 0,
                    "electricity_usage": 0,
                    "electricity_cost": 0,
                    "water_usage": 0,
                    "water_cost": 0,
                    "total_cost": 0
                });
                var requestOptions = {
                   method: 'POST',
                   headers: myHeaders,
                   body: raw,
                   redirect: 'follow'
                };
                const  response = await fetch(`http://120.24.176.40:80/api/bill/appeal/resolve?appealId=${userId}&isApproved=${temp1}&rejectReason=${reason1}`,requestOptions);
             
                // 6. 处理返回数据 
                const data = await response.json();
                console.log(data);  
                alert('拒绝成功！');
            }
            catch (err) {
                // 7. 错误处理
                console.error('加载账单数据失败:', err);
              //  alert('加载账单数据失败，请稍后重试');
            }
            }
        });
    });
}

// 搜索复查申请
function searchReviews(keyword) {
    console.log('搜索复查申请:', keyword);
    // 这里添加搜索逻辑

}

// 筛选复查申请
function filterReviews() {
    const status = document.getElementById('statusFilter').value;
    console.log('筛选状态:', status);
    // 这里添加筛选逻辑

}
// 显示复查详情
function showReviewDetail(username, dormitory) {
    // 这里添加显示详情的逻辑
    console.log('查看详情:', { username, dormitory });
    alert('查看详情功能开发中...');
}

// 加载指定页码的复查数据
function loadReviewsPage(page) {
    console.log('加载第', page, '页复查');
    // 这里添加分页加载逻辑
} 