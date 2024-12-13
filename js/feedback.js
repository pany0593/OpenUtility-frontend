document.addEventListener("DOMContentLoaded", function() {
    const appealForm = document.getElementById('appealForm');
    const billIdInput = document.getElementById('billId');
    const appealContentInput = document.getElementById('appealContent');
    const charCount = document.querySelector('.char-count');
    const submitBtn = document.querySelector('.submit-btn');


    
    const layout = document.querySelector('.layout');
    if (layout) layout.classList.add('loaded');
    if (!appealForm) {
        console.error('表单未加载，请检查 HTML 文件是否完整！');
        return;
    }
   // console.log('表单内容:', appealForm.innerHTML);
   // console.log(document.querySelector('.main-content').innerHTML);


    // 字符计数更新函数
    appealContentInput.addEventListener('input', function() {
        const currentLength = appealContentInput.value.length;
        charCount.textContent = `${currentLength}/500`;

        // 限制最多输入 500 字符
        if (currentLength > 500) {
            appealContentInput.value = appealContentInput.value.slice(0, 500);
            charCount.textContent = '500/500';
        }
    });

    

    // 获取 token 和通过接口获取 userId
    function getUserIdFromAPI(token) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch("http://120.24.176.40:80/api/users/profile", requestOptions)
            .then(response => response.json())  // 假设返回的是 JSON 格式
            .then(data => {
                console.log(data);
                if (data.base.code === 0 ) {
                    return data.data.id;  // 从 data 中提取 userId
                } else {
                    throw new Error(data.base ? data.base.message : '获取用户信息失败');
                }
            })
            .catch(error => {
                console.error('获取 userId 错误:', error);
                return null;  // 如果发生错误，返回 null
            });
    }

    // 提交表单时的处理
    appealForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 防止表单默认提交行为

        const billId = billIdInput.value.trim();
        const appealContent = appealContentInput.value.trim();

        // 获取 token
        const token = localStorage.getItem('token');
        if (!token) {
            alert("用户未登录，无法提交申诉！");
            return;
        }

        // 获取 userId
        // 获取 userId
getUserIdFromAPI(token).then(userId => {
    console.log(userId);
    console.log(billId);
    if (!userId) {
        alert("获取用户信息失败，请稍后再试！");
        return;
    }

    // 表单验证
    if (!billId || !appealContent || !userId) {
        alert("账单ID、申诉内容和用户信息不能为空!");
        return;
    }

    // 提交数据到后端接口
    submitBtn.disabled = true; // 禁用提交按钮
    submitBtn.textContent = "提交中...";

    // 使用 Fetch API 发送 POST 请求
    fetch(`http://120.24.176.40:80/api/bill/appeal/submit?billId=${billId}&reason=${encodeURIComponent(appealContent)}&userId=${userId}`, {
        method: 'POST',  // 你可以继续使用 POST 方法，如果 API 仍然要求 POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // 这里可以保持空请求体，如果 API 要求 POST 方法
    })
    .then(response => {
        if (response.status === 404) {
            alert("请求的资源未找到，请检查 API 地址！");
            throw new Error('API 地址未找到');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.base.code === 0) {
            alert("您的申诉已提交成功，我们会尽快处理！");
            // 清空表单
            billIdInput.value = '';
            appealContentInput.value = '';
            charCount.textContent = '0/500';
        } else {
            alert("提交失败，请稍后再试！");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("网络错误，请稍后再试！");
    })
    .finally(() => {
        submitBtn.disabled = false; // 恢复提交按钮
        submitBtn.textContent = "提交申诉";
    }); 
});

    });
});