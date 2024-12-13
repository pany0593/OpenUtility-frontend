document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    searchBtn.addEventListener('click', function() {
        const searchText = searchInput.value.trim();
        if (searchText) {
            searchAnnouncements(searchText);
        }
    });

    // 筛选功能
    // const timeFilter = document.getElementById('timeFilter');
    // const typeFilter = document.getElementById('typeFilter');

    // timeFilter.addEventListener('change', function() {
    //     filterAnnouncements();
    // });

    // typeFilter.addEventListener('change', function() {
    //     filterAnnouncements();
    // });

    // 查看详情按钮
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const announcementItem = this.closest('.announcement-item');
            const title = announcementItem.querySelector('h3').textContent;
            showAnnouncementDetail(title);
        });
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn:not([disabled])');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                this.classList.add('active');
                loadAnnouncementPage(this.textContent);
            }
        });
    });

    // 退出登录
    // document.querySelector('.logout-btn').addEventListener('click', function() {
    //     if(confirm('确定要退出登录吗？')) {
    //         window.location.href = 'index.html';
    //     }
    // });
});





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
    
            card.innerHTML = `
                <h3>${notice.title}</h3>
                <p>${notice.desc}</p>
                <div class="meta-info">
                    <span>发布人：${notice.authorName}</span> | 
                    <span>发布时间：${notice.createTime}</span>
                </div>
            `;
    
            announcementCards.appendChild(card);
        });
    
        // document.querySelectorAll(".delete-btn").forEach((btn) =>
        //     btn.addEventListener("click", function () {
        //         const articleId = this.getAttribute("data-id");
        //         deleteAnnouncement(articleId);
        //     })
        // );
        
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



    

    // 初始加载第一页公告
    fetchAnnouncements(currentPage);


