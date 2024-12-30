document.addEventListener('DOMContentLoaded', function () { 
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.querySelector('.register-btn');
    const adminLoginBtn = document.querySelector('.admin-login-btn');
    const forgetPwdLink = document.querySelector('.forget-pwd');

    // 点击注册按钮跳转到注册页面
    registerBtn.addEventListener('click', function () {
        window.location.href = 'register.html';
    });

    // 点击管理员登录按钮跳转到管理员登录页面
    adminLoginBtn.addEventListener('click', function () {
        window.location.href = 'admin-login.html';
    });

    // 点击忘记密码链接跳转到忘记密码页面
    forgetPwdLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'forget-password.html';
    });

    // 登录表单提交处理
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 防止表单默认提交行为

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const building = parseInt(document.getElementById('building').value, 10); // 转为整数
        const dormitory = parseInt(document.getElementById('dormitory').value, 10); // 转为整数

        // 简单表单验证：确保用户名和密码非空
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }

        if (isNaN(building) || isNaN(dormitory)) {
            alert('请输入有效的楼号和宿舍号');
            return;
        }

        // 发送登录请求
        try {
            const response = await fetch('http://120.24.176.40:80/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    password,
                    building,
                    dormitory
                }),
            });

            const result = await response.json();

            if (result.base.code === 0) {
                const token = result.data; // 获取 JWT token

                // 存储 token 到 localStorage
                localStorage.setItem("token", token);

                // 解码 token 并提取用户信息
                // const userInfo = decodeJwtToken(token);
                
                


                
    if (token) {
        // 使用 fetch 发送 GET 请求
        fetch("http://120.24.176.40:80/api/users/profile", {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`, // 将 token 添加到请求头
            "Content-Type": "application/json",
            },
        })
            .then((response) => {
            if (response.ok) {
                return response.json(); // 解析响应为 JSON
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            })
            .then((data) => {
            if (data.base && data.base.code === 0) {
                // console.log("用户信息:", data.data); // 打印用户信息

                const userInfo = data.data;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                // console.log("用户信息已存储到 localStorage:", localStorage.getItem('userInfo'));

                
                const storedUserInfo = localStorage.getItem('userInfo');
                if (storedUserInfo) {
                    console.log("用户信息已存储到 localStorage:", storedUserInfo);
                    window.location.href = "main.html";
                } 


            }  else {
                console.error("响应错误信息:", data.base ? data.base.message : "未知错误");
            }
            })
            .catch((error) => {
            console.error("请求失败:", error.message);
            });

        } else {
        console.error("未找到 Token，请先登录。");
        }

            } else {
                // 登录失败
                alert(result.base.message || '登录失败');
            }
        } catch (err) {
            console.error('登录失败:', err);
            alert('登录失败，请稍后重试');
        }
    });





    /**
     * 解码 JWT token 并提取用户信息（处理中文字符乱码问题）
     * @param {string} token - JWT token
     * @returns {object|null} - 用户信息对象或 null
     */
    function decodeJwtToken(token) {
        // 确保 token 格式正确
        if (typeof token !== 'string' || token.split('.').length !== 3) {
            console.error("Invalid JWT token format");
            return null;
        }

        const parts = token.split('.');  // 拆分 token
        const payload = parts[1];  // 获取 payload 部分
        const decodedPayload = safeBase64Decode(payload);  // 解码 payload
        if (!decodedPayload) {
            console.error("Failed to decode payload");
            return null;
        }

        try {
            return JSON.parse(decodedPayload);  // 返回解码后的 JSON 数据
        } catch (error) {
            console.error("Failed to parse payload JSON:", error);
            return null;
        }
    }



    /**
     * 安全 Base64 解码，解决 UTF-8 字符乱码问题
     * @param {string} base64String - Base64 编码的字符串
     * @returns {string|null} - 解码后的字符串或 null
     */
    function safeBase64Decode(base64String) {
        // 将 URL-safe Base64 转换为标准 Base64
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
        
        // 添加填充字符 '='，使其长度为4的倍数
        while (base64String.length % 4) {
            base64String += '=';
        }

        try {
            // 使用 atob 解码 Base64
            const decodedStr = atob(base64String);

            // 处理 UTF-8 解码
            const byteCharacters = decodedStr.split('').map(char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteCharacters);
            const decoder = new TextDecoder('utf-8');
            const decodedUtf8 = decoder.decode(byteArray);

            return decodedUtf8;
        } catch (error) {
            console.error('Base64 decoding failed:', error);
            return null;
        }
    }





});
