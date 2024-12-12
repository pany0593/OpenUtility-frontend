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
        console.log(data1);
        if (data1.base.code === 0) {
            const users = Object.values(data1.data);; // 假设返回的数据结构中包含用户数组
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
            alert(data1.base.message || '获取用户列表失败');
        }
    } catch (err) {
        console.error('获取用户列表失败:', err);
        alert('获取用户列表失败，请稍后重试');
    }
}

// 编辑用户
function editUser(userId) {
    window.location.href = `admin-user-edit.html?id=${userId}`;
}

// 删除用户
function deleteUser(userId) {
    if (confirm('确定要删除该用户吗？此操作不可恢复。')) {
        // 这里添加删除用户的逻辑
        console.log('删除用户:', userId);
        // 发送删除请求
        fetch(`/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.base.code === 0) {
                alert('用户删除成功！');
                loadUsers(); // 重新加载用户列表
            } else {
                alert(data.base.message || '删除用户失败');
            }
        })
        .catch(err => {
            console.error('删除用户失败:', err);
            alert('删除用户失败，请稍后重试');
        });
    }
}

// 查询用户
async function searchUsers(building, dormitory) {
    try {
        const response = await fetch(`/users/by-room?building=${building}&dormitory=${dormitory}`, {
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