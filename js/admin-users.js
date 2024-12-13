document.addEventListener('DOMContentLoaded', async function() {
    await loadUsers();

    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 查询功能
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', async function() {
        const building = document.getElementById('buildingInput').value;
        const dormitory = document.getElementById('dormitoryInput').value;
        await searchUsers(building, dormitory);
    });
});

// 获取所有用户
async function loadUsers() {
    try {
        const token = localStorage.getItem("token");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        
        var requestOptions = {
           method: 'GET',
           headers: headers,
           redirect: 'follow'
        };
        const response = await fetch("http://120.24.176.40:80/api/users/admin", requestOptions);
        const data1 = await response.json();
        console.log(data1); // 查看返回的数据结构

        if (data1.base.code === 0) {
            const users = Object.values(data1.data); // 假设返回的数据结构中包含用户数组
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = ''; // 清空表格

            users.forEach(user => {
                if (user.building === undefined || user.dormitory === undefined) {
                    console.warn(`Missing building or dormitory for user: ${JSON.stringify(user)}`);
                    return; // 跳过没有 building 或 dormitory 的用户
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.building}</td>
                    <td>${user.dormitory}</td>
                    <td>${user.email}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" data-building="${user.building}" data-dormitory="${user.dormitory}">编辑</button>
                            <button class="delete-btn" data-id="${user.id}">删除</button>
                        </div>
                    </td>
                `;
                userTableBody.appendChild(row);
            });

            bindButtonEvents(); // 确保在数据加载后重新绑定按钮事件
        } else {
            alert(data1.base.message || '获取用户列表失败');
        }
    } catch (err) {
        console.error('获取用户列表失败:', err);
        alert('获取用户列表失败，请稍后重试');
    }
}

function bindButtonEvents() {
// 只声明一次 editButtons 和 deleteButtons 变量
const editButtons = document.querySelectorAll('.edit-btn');
const deleteButtons = document.querySelectorAll('.delete-btn');

// 为编辑按钮绑定点击事件
editButtons.forEach(button => {
    button.addEventListener('click', function() {
        const building = this.getAttribute('data-building');  // 获取 building
        const dormitory = this.getAttribute('data-dormitory');  // 获取 dormitory
        if (building && dormitory) {
            alert(`编辑用户, Building: ${building}, Dormitory: ${dormitory}`);
            // 跳转到 admin-user-edit.html 并通过 URL 参数传递 building 和 dormitory
            const targetURL = `admin-user-edit.html?building=${building}&dormitory=${dormitory}`;
            window.location.href = targetURL;
        } else {
            console.warn('没有找到有效的 building 或 dormitory');
        }
    });
});

// 为每个删除按钮添加点击事件
deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');  // 获取用户 ID
        const userRow = this.closest('tr');  // 获取当前行
        if (userId) {
            const token = localStorage.getItem("token");  // 从 localStorage 获取 token
            if (token) {
                // 调用删除 API
                deleteUser(userId, token, userRow);  // 传递 userRow 用于移除行
            } else {
                console.warn('没有找到有效的 token');
                alert('请登录后删除用户');
            }
        } else {
            console.warn('没有找到有效的 userId');
            alert('用户 ID 无效');
        }
    });
});

// 删除用户函数
async function deleteUser(userId, token, userRow) {
    if (confirm(`确定要删除用户 ID: ${userId} 吗？`)){
    try{
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    // 设置请求选项
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    console.log(userId);
    // 执行删除请求
    const response = await fetch(`http://120.24.176.40:80/api/users/admin/${userId}`, requestOptions);
    const data = await response.json();
    console.log(data);
    if (data.base.code === 0) {
         alert(`用户 ID: ${userId} 删除成功`);
        // 删除成功后，移除用户行
          userRow.remove();
       } else {
                alert(`删除失败: ${data.message || '未知错误'}`);
        }
    }
        catch(error){
            console.error('删除请求出错:', error);
            alert('删除失败，请稍后重试');
        };
    }
}  
}
// 查询用户
async function searchUsers(building, dormitory) {
    try {
        const response = await fetch(`http://120.24.176.40:80/api/users/by-room?building=${building}&dormitory=${dormitory}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // 假设使用 token 进行身份验证
            }
        });

        const data = await response.json();

        if (data.base.code === 0) {
            const users = data.data; // 假设返回的数据结构中包含用户数组
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = ''; // 清空表格

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.building}</td>
                    <td>${user.dormitory}</td>
                    <td>${user.email}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="editUser(${user.id})">编辑</button>
                            <button class="delete-btn" onclick="deleteUser(${user.id})">删除</button>
                        </div>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        } else {
            alert(data.base.message || '查询用户失败');
        }
    } catch (err) {
        console.error('查询用户失败:', err);
        alert('查询用户失败，请稍后重试');
    }
}