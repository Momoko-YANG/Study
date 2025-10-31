# Go Todo 应用

一个使用 Go 语言构建的现代化 Todo 应用，具有完整的用户认证、任务管理和 PWA 功能。

## 功能特性

- ✅ **任务管理**: 创建、编辑、删除和查看任务
- 🔐 **用户认证**: 用户注册、登录和会话管理
- 📱 **响应式设计**: 支持桌面和移动设备
- 💾 **PWA 支持**: 可安装为桌面应用，支持离线使用
- 🎨 **现代 UI**: 美观的用户界面和流畅的交互体验
- ⚡ **高性能**: 使用 Go 语言构建的高性能后端

## 技术栈

### 后端
- **Go 1.21+**: 主要编程语言
- **Gorilla Mux**: HTTP 路由器和 URL 匹配器
- **Gorilla Sessions**: 会话管理
- **HTML 模板**: 服务端渲染

### 前端
- **HTML5**: 语义化标记
- **CSS3**: 现代样式和动画
- **JavaScript (ES6+)**: 客户端交互
- **PWA**: 渐进式 Web 应用功能

## 项目结构

```
golang-todolist/
├── main.go              # 主程序文件
├── go.mod               # Go 模块依赖
├── go.sum               # 依赖校验文件
├── static/              # 静态资源
│   ├── css/
│   │   └── style.css    # 样式文件
│   ├── js/
│   │   └── app.js       # JavaScript 文件
│   ├── manifest.json    # PWA 清单文件
│   └── sw.js            # Service Worker
└── templates/           # HTML 模板
    ├── index.html       # 首页
    ├── todos.html       # 任务列表
    ├── detail.html      # 任务详情
    ├── edit.html        # 编辑任务
    ├── login.html       # 登录页面
    └── signup.html      # 注册页面
```

## 快速开始

### 1. 安装依赖

确保您已安装 Go 1.21 或更高版本，然后运行：

```bash
go mod tidy
```

### 2. 运行应用

```bash
go run main.go
```

应用将在 `http://localhost:8080` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:8080`，您将看到应用首页。

## 使用说明

### 演示账户

为了方便测试，应用提供了一个演示账户：

- **用户名**: `admin`
- **密码**: `password`

### 主要功能

1. **注册/登录**: 创建新账户或使用演示账户登录
2. **创建任务**: 点击"新建任务"按钮创建新的待办事项
3. **管理任务**: 查看、编辑、删除和标记任务完成状态
4. **搜索和筛选**: 使用搜索框查找任务，或按状态筛选
5. **PWA 功能**: 可以将应用安装到设备主屏幕

### 键盘快捷键

- `Ctrl/Cmd + N`: 新建任务
- `Ctrl/Cmd + F`: 搜索任务
- `Ctrl/Cmd + S`: 保存更改（编辑页面）
- `Ctrl/Cmd + Z`: 重置表单（编辑页面）
- `Escape`: 返回上一页

## API 端点

### 页面路由
- `GET /`: 首页
- `GET /login`: 登录页面
- `GET /signup`: 注册页面
- `GET /todos`: 任务列表（需要认证）
- `GET /todos/{id}`: 任务详情（需要认证）
- `GET /todos/{id}/edit`: 编辑任务（需要认证）

### API 路由
- `GET /api/todos`: 获取所有任务（JSON）
- `GET /api/todos/{id}`: 获取单个任务（JSON）

### 表单提交
- `POST /login`: 用户登录
- `POST /signup`: 用户注册
- `POST /logout`: 用户登出
- `POST /todos/new`: 创建新任务
- `POST /todos/{id}/edit`: 更新任务
- `POST /todos/{id}/delete`: 删除任务

## 开发说明

### 添加新功能

1. 在 `main.go` 中添加新的路由处理器
2. 在 `templates/` 目录中创建或修改 HTML 模板
3. 在 `static/css/style.css` 中添加样式
4. 在 `static/js/app.js` 中添加客户端逻辑

### 自定义样式

应用使用 CSS 变量和现代 CSS 特性，您可以轻松自定义：

- 颜色主题：修改 CSS 变量
- 布局：调整网格和弹性布局
- 动画：自定义过渡和动画效果

### PWA 配置

PWA 功能通过以下文件配置：

- `static/manifest.json`: 应用清单
- `static/sw.js`: Service Worker
- HTML 模板中的相关 meta 标签

## 部署

### 本地部署

1. 编译应用：
   ```bash
   go build -o todo-app main.go
   ```

2. 运行编译后的二进制文件：
   ```bash
   ./todo-app
   ```

### 生产环境

1. 设置环境变量（如数据库连接等）
2. 使用反向代理（如 Nginx）
3. 配置 HTTPS
4. 设置进程管理（如 systemd）

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 完整的任务管理功能
- 用户认证系统
- PWA 支持
- 响应式设计
