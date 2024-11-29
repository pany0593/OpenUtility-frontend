document.addEventListener('DOMContentLoaded', function() {
    // 显示页面内容
    const layout = document.querySelector('.layout');
    if (layout) {
        layout.classList.add('loaded');
    }

    // 获取表单元素
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackContent = document.getElementById('feedbackContent');
    const charCount = document.querySelector('.char-count');

    // 更新字数统计
    function updateCharCount() {
        const count = feedbackContent.value.length;
        charCount.textContent = `${count}/500`;
        
        // 更新字数颜色
        if (count > 500) {
            charCount.style.color = '#ff4d4f';
        } else {
            charCount.style.color = '#666';
        }
    }

    // 监听内容输入
    feedbackContent.addEventListener('input', updateCharCount);

    // 表单提交处理
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('feedbackTitle').value.trim();
        const content = feedbackContent.value.trim();

        // 表单验证
        if (title.length < 4) {
            alert('标题至少需要4个字符');
            return;
        }

        if (content.length < 10) {
            alert('内容至少需要10个字符');
            return;
        }

        if (content.length > 500) {
            alert('内容不能超过500个字符');
            return;
        }

        // 收集表单数据
        const feedbackData = {
            title,
            content,
            timestamp: new Date().toISOString()
        };

        // 提交反馈
        submitFeedback(feedbackData);
    });

    // 快捷操作按钮处理
    document.querySelector('.review-btn').addEventListener('click', function() {
        handleReviewRequest();
    });

    document.querySelector('.invoice-btn').addEventListener('click', function() {
        handleInvoiceRequest();
    });

    // 历史反馈详情按钮处理
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const historyItem = this.closest('.history-item');
            const title = historyItem.querySelector('h4').textContent;
            showFeedbackDetail(title);
        });
    });

    // 退出登录
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if(confirm('确定要退出登录吗？')) {
            window.location.href = 'index.html';
        }
    });
});

// 提交反馈
function submitFeedback(data) {
    // 这里添加提交反馈的逻辑
    console.log('提交反馈:', data);
    alert('反馈提交成功！');
    // 重置表单
    document.getElementById('feedbackForm').reset();
    document.querySelector('.char-count').textContent = '0/500';
}

// 处理复查申请
function handleReviewRequest() {
    const reviewData = {
        type: 'review',
        timestamp: new Date().toISOString()
    };
    console.log('申请复查:', reviewData);
    alert('复查申请已提交，工作人员将尽快处理！');
}

// 处理发票申请
function handleInvoiceRequest() {
    const invoiceData = {
        type: 'invoice',
        timestamp: new Date().toISOString()
    };
    console.log('申请发票:', invoiceData);
    alert('发票申请已提交，请注意查收邮件！');
}

// 显示反馈详情
function showFeedbackDetail(title) {
    // 这里添加显示反馈详情的逻辑
    console.log('查看反馈详情:', title);
    alert('正在开发中...');
} 