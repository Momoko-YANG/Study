// Todo App JavaScript 功能增强
document.addEventListener('DOMContentLoaded', function() {
    // 添加淡入动画
    const elements = document.querySelectorAll('.todo-item, .add-form, .todo-list');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // 表单提交动画
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const button = form.querySelector('button[type="submit"]');
            if (button) {
                button.style.transform = 'scale(0.95)';
                button.style.opacity = '0.7';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                    button.style.opacity = '1';
                }, 150);
            }
        });
    });

    // 按钮点击效果
    const buttons = document.querySelectorAll('.btn, .detail-btn, .edit-btn, .toggle-btn, .delete-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 输入框焦点效果
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // 删除确认
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this todo?')) {
                e.preventDefault();
            }
        });
    });

    // 自动保存功能（本地存储）
    const todoForm = document.querySelector('form[th\\:action*="/todos"]');
    if (todoForm) {
        const titleInput = todoForm.querySelector('input[name="title"]');
        if (titleInput) {
            // 从本地存储恢复
            const savedTitle = localStorage.getItem('todoTitle');
            if (savedTitle) {
                titleInput.value = savedTitle;
            }
            
            // 保存到本地存储
            titleInput.addEventListener('input', function() {
                localStorage.setItem('todoTitle', this.value);
            });
            
            // 表单提交后清除
            todoForm.addEventListener('submit', function() {
                localStorage.removeItem('todoTitle');
            });
        }
    }
});

// 添加波纹效果样式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
