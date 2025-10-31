// Todo 应用 JavaScript 功能

// 全局变量
let todos = [];
let currentUser = null;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 检查用户认证状态
    checkAuthStatus();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 加载初始数据
    loadTodos();
    
    // 初始化 PWA 功能
    initializePWA();
}

// 检查认证状态
function checkAuthStatus() {
    // 这里可以添加检查用户是否已登录的逻辑
    // 在实际应用中，这可能会检查 localStorage 或发送请求到服务器
    console.log('检查用户认证状态...');
}

// 绑定事件监听器
function bindEventListeners() {
    // Todo 表单提交
    const todoForm = document.getElementById('todoForm');
    if (todoForm) {
        todoForm.addEventListener('submit', handleTodoSubmit);
    }
    
    // 编辑表单提交
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
    
    // 删除按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            handleDeleteTodo(e);
        }
    });
    
    // 完成状态切换
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('todo-checkbox')) {
            handleToggleComplete(e);
        }
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // 筛选功能
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
}

// 处理 Todo 表单提交
function handleTodoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const todoData = {
        title: formData.get('title'),
        description: formData.get('description'),
        completed: formData.get('completed') === 'on'
    };
    
    // 验证输入
    if (!todoData.title.trim()) {
        showAlert('请输入 Todo 标题', 'error');
        return;
    }
    
    // 发送创建请求
    createTodo(todoData);
}

// 处理编辑表单提交
function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const todoId = e.target.dataset.todoId;
    const todoData = {
        title: formData.get('title'),
        description: formData.get('description'),
        completed: formData.get('completed') === 'on'
    };
    
    // 验证输入
    if (!todoData.title.trim()) {
        showAlert('请输入 Todo 标题', 'error');
        return;
    }
    
    // 发送更新请求
    updateTodo(todoId, todoData);
}

// 处理删除 Todo
function handleDeleteTodo(e) {
    e.preventDefault();
    
    const todoId = e.target.dataset.todoId;
    
    if (confirm('确定要删除这个 Todo 吗？')) {
        deleteTodo(todoId);
    }
}

// 处理完成状态切换
function handleToggleComplete(e) {
    const todoId = e.target.dataset.todoId;
    const completed = e.target.checked;
    
    updateTodoStatus(todoId, completed);
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterTodos(searchTerm);
}

// 处理筛选
function handleFilter(e) {
    const filterType = e.target.value;
    filterTodosByStatus(filterType);
}

// API 调用函数
async function loadTodos() {
    try {
        showLoading(true);
        const response = await fetch('/api/todos');
        if (response.ok) {
            todos = await response.json();
            renderTodos();
        } else {
            throw new Error('加载 Todos 失败');
        }
    } catch (error) {
        console.error('加载 Todos 错误:', error);
        showAlert('加载 Todos 失败', 'error');
    } finally {
        showLoading(false);
    }
}

async function createTodo(todoData) {
    try {
        showLoading(true);
        const response = await fetch('/todos/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(todoData)
        });
        
        if (response.ok) {
            showAlert('Todo 创建成功', 'success');
            // 重新加载页面或更新列表
            window.location.reload();
        } else {
            throw new Error('创建 Todo 失败');
        }
    } catch (error) {
        console.error('创建 Todo 错误:', error);
        showAlert('创建 Todo 失败', 'error');
    } finally {
        showLoading(false);
    }
}

async function updateTodo(todoId, todoData) {
    try {
        showLoading(true);
        const response = await fetch(`/todos/${todoId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(todoData)
        });
        
        if (response.ok) {
            showAlert('Todo 更新成功', 'success');
            // 重新加载页面或更新列表
            window.location.reload();
        } else {
            throw new Error('更新 Todo 失败');
        }
    } catch (error) {
        console.error('更新 Todo 错误:', error);
        showAlert('更新 Todo 失败', 'error');
    } finally {
        showLoading(false);
    }
}

async function updateTodoStatus(todoId, completed) {
    try {
        const todo = todos.find(t => t.id == todoId);
        if (todo) {
            todo.completed = completed;
            await updateTodo(todoId, {
                title: todo.title,
                description: todo.description,
                completed: completed
            });
        }
    } catch (error) {
        console.error('更新 Todo 状态错误:', error);
        showAlert('更新 Todo 状态失败', 'error');
    }
}

async function deleteTodo(todoId) {
    try {
        showLoading(true);
        const response = await fetch(`/todos/${todoId}/delete`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showAlert('Todo 删除成功', 'success');
            // 重新加载页面或更新列表
            window.location.reload();
        } else {
            throw new Error('删除 Todo 失败');
        }
    } catch (error) {
        console.error('删除 Todo 错误:', error);
        showAlert('删除 Todo 失败', 'error');
    } finally {
        showLoading(false);
    }
}

// 渲染 Todos
function renderTodos(todosToRender = todos) {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
    if (todosToRender.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <h3>暂无 Todo 项目</h3>
                <p>点击"新建 Todo"按钮开始创建您的第一个任务</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = todosToRender.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''} fade-in">
            <div class="todo-title">${escapeHtml(todo.title)}</div>
            <div class="todo-description">${escapeHtml(todo.description)}</div>
            <div class="todo-meta">
                <span class="status-badge ${todo.completed ? 'status-completed' : 'status-pending'}">
                    ${todo.completed ? '已完成' : '进行中'}
                </span>
                <span>${formatDate(todo.created_at)}</span>
            </div>
            <div class="todo-actions">
                <a href="/todos/${todo.id}" class="btn btn-secondary">查看</a>
                <a href="/todos/${todo.id}/edit" class="btn btn-primary">编辑</a>
                <button class="btn btn-danger delete-btn" data-todo-id="${todo.id}">删除</button>
            </div>
        </div>
    `).join('');
}

// 筛选 Todos
function filterTodos(searchTerm) {
    const filteredTodos = todos.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm)
    );
    renderTodos(filteredTodos);
}

function filterTodosByStatus(status) {
    let filteredTodos = todos;
    
    switch (status) {
        case 'completed':
            filteredTodos = todos.filter(todo => todo.completed);
            break;
        case 'pending':
            filteredTodos = todos.filter(todo => !todo.completed);
            break;
        case 'all':
        default:
            filteredTodos = todos;
            break;
    }
    
    renderTodos(filteredTodos);
}

// 工具函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showAlert(message, type = 'info') {
    // 移除现有的警告
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 创建新的警告
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // 插入到页面顶部
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// PWA 功能
function initializePWA() {
    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration);
            })
            .catch(error => {
                console.log('Service Worker 注册失败:', error);
            });
    }
    
    // 处理安装提示
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // 显示安装按钮
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('用户接受了安装提示');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N: 新建 Todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const newTodoLink = document.querySelector('a[href*="/todos/new"]');
        if (newTodoLink) {
            window.location.href = newTodoLink.href;
        }
    }
    
    // Ctrl/Cmd + F: 搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// 导出函数供全局使用
window.TodoApp = {
    loadTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    renderTodos,
    showAlert,
    showLoading
};
