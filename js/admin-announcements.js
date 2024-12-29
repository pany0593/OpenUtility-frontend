document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');

    // 加载公告列表
    // loadAnnouncements();

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchAnnouncements(searchText);
        } else {
            loadAnnouncements(); // 搜索框为空时显示所有公告
        }
    });

    // 退出登录
    document.querySelector('.logout-btn')?.addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'admin-login.html';
        }
    });
});

// 加载公告列表
// function loadAnnouncements() {
//     const tbody = document.querySelector('.announcements-table tbody');
//     const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');

//     if (!tbody) {
//         console.error("Table body element not found!");
//         return;
//     }
    
//     // 清空现有内容
//     if (tbody.innerHTML.trim() !== '') {
//         tbody.innerHTML = '';
//     }

    
//     // 添加公告列表
//     announcements.forEach(announcement => {
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//             <td>${announcement.title}</td>
//             <td>${announcement.content}</td>
//             <td>${formatDate(announcement.timestamp)}</td>
//             <td>${announcement.publisher}</td>
//             <td>
//                 <button class="delete-btn" onclick="deleteAnnouncement('${announcement.timestamp}')">删除</button>
//             </td>
//         `;
//         tbody.appendChild(tr);
//     });
// }



// 搜索公告
function searchAnnouncements(keyword) {
    const tbody = document.querySelector('.announcements-table tbody');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    // 过滤匹配的公告
    const filteredAnnouncements = announcements.filter(announcement => 
        announcement.title.includes(keyword) || 
        announcement.content.includes(keyword)
    );
    
    // 清空现有内容
    tbody.innerHTML = '';
    
    // 显示搜索结果
    filteredAnnouncements.forEach(announcement => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${announcement.title}</td>
            <td>${announcement.content}</td>
            <td>${formatDate(announcement.timestamp)}</td>
            <td>${announcement.publisher}</td>
            <td>
                <button class="delete-btn" onclick="deleteAnnouncement('${announcement.timestamp}')">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}




const API_URL = "http://120.24.176.40:80/api/post/notice_list_get";
const announcementList = document.getElementById("announcement-list");
const paginationControls = document.getElementById("pagination-controls");
let currentPage = 1;

// 获取公告列表
function fetchAnnouncements(page) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ page }), // 发送页码信息到后端
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                
            }
            return response.json(); // 解析 JSON 数据
        })
        .then((data) => {
            if (data.base.code === 0) {
                renderAnnouncements(data.data.notices); // 渲染公告列表
                renderPagination(data.data.totalPages, page); // 渲染分页控件
            } else {
                alert(data.base.message); // 如果后端返回错误信息，弹窗提示
            }
        })
        .catch((error) => {
            console.error("Error fetching announcements:", error);
            alert("公告列表加载失败，请稍后重试！");
        });
}


    //渲染公告
    function renderAnnouncements(notices) {
        const announcementCards = document.getElementById("announcement-cards");
        announcementCards.innerHTML = ""; // 清空旧数据
    
        notices.forEach((notice) => {
            const card = document.createElement("div");
            card.classList.add("announcement-card");

            console.log(notice);
            
    
            card.innerHTML = `
                <h3 class="announcement-title" data-id="${notice.noticeId}">${notice.title}</h3>
                <p>${notice.desc}</p>
                <div class="meta-info">
                    <span>发布人：${notice.authorName}</span> | 
                    <span>发布时间：${notice.createTime}</span>
                </div>
                <div class="actions">
                    <button class="delete-btn" data-id="${notice.noticeId}">删除</button>
                </div>
            `;
    
            announcementCards.appendChild(card);
        });
    
        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", function () {
                const articleId = this.getAttribute("data-id");
                deleteAnnouncement(articleId);
            })
        );


        // 给公告标题添加点击事件
        document.querySelectorAll('.announcement-title').forEach(titleElement => {
            titleElement.addEventListener('click', function() {
                const announcementId = this.getAttribute('data-id');
                if (announcementId) {
                    window.location.href = `announcement-detail.html?id=${announcementId}`;
                }
            });
        });



}



    


    //分页控件

    function renderPagination(totalPages, currentPage) {
        paginationControls.innerHTML = "";

        const createButton = (text, page) => {
            const button = document.createElement("button");
            button.classList.add("page-btn");
            if (page === currentPage) button.classList.add("active");
            button.textContent = text;
            button.addEventListener("click", () => fetchAnnouncements(page));
            return button;
        };

        if (currentPage > 1) {
            paginationControls.appendChild(createButton("上一页", currentPage - 1));
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationControls.appendChild(createButton(i, i));
        }

        if (currentPage < totalPages) {
            paginationControls.appendChild(createButton("下一页", currentPage + 1));
        }
    }

    //删除公告
    function deleteAnnouncement(articleId) {
        if (confirm("确认删除该公告吗？")) {
            console.log("noticeId:",articleId);

            const token = localStorage.getItem('token'); // 从 localStorage 获取 token 
            
            const API_URL = "http://120.24.176.40:80/api/post/notice_delete";
            fetch(API_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "articleId": articleId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.base.code === 0) {
                        alert("公告已成功删除！");
                        fetchAnnouncements(currentPage); // 刷新列表
                    } else {
                        alert(`删除失败: ${data.base.message}`);
                    }
                })
                .catch((error) => {
                    console.error("删除公告时出错:", error);
                    alert("删除公告时发生错误，请稍后再试！");
                });
        }
    }

    

    // 初始加载第一页公告
    fetchAnnouncements(currentPage);








// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
} 