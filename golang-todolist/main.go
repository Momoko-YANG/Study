package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

// Todo 结构体定义
type Todo struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// User 结构体定义
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

// 全局变量
var todos []Todo
var users []User
var nextTodoID = 1
var nextUserID = 1
var store = sessions.NewCookieStore([]byte("your-secret-key"))

// 初始化数据
func init() {
	// 添加示例数据
	todos = []Todo{
		{
			ID:          1,
			Title:       "学习 Go 语言",
			Description: "完成 Go 语言基础教程",
			Completed:   false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          2,
			Title:       "构建 Todo 应用",
			Description: "使用 Go 和 HTML 模板构建一个完整的 Todo 应用",
			Completed:   true,
			CreatedAt:   time.Now().Add(-24 * time.Hour),
			UpdatedAt:   time.Now().Add(-12 * time.Hour),
		},
	}
	nextTodoID = 3

	users = []User{
		{
			ID:       1,
			Username: "admin",
			Email:    "admin@example.com",
		},
	}
	nextUserID = 2
}

// 主页处理器
func homeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, nil)
}

// Todo 列表处理器
func todosHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/todos.html"))
	data := struct {
		Todos []Todo
	}{
		Todos: todos,
	}
	tmpl.Execute(w, data)
}

// Todo 详情处理器
func todoDetailHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var todo *Todo
	for i, t := range todos {
		if t.ID == id {
			todo = &todos[i]
			break
		}
	}

	if todo == nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	tmpl := template.Must(template.ParseFiles("templates/detail.html"))
	tmpl.Execute(w, todo)
}

// 编辑 Todo 处理器
func editTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var todo *Todo
	for i, t := range todos {
		if t.ID == id {
			todo = &todos[i]
			break
		}
	}

	if todo == nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	if r.Method == "GET" {
		tmpl := template.Must(template.ParseFiles("templates/edit.html"))
		tmpl.Execute(w, todo)
		return
	}

	if r.Method == "POST" {
		todo.Title = r.FormValue("title")
		todo.Description = r.FormValue("description")
		todo.Completed = r.FormValue("completed") == "on"
		todo.UpdatedAt = time.Now()

		http.Redirect(w, r, "/todos", http.StatusSeeOther)
	}
}

// 创建新 Todo 处理器
func createTodoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		title := r.FormValue("title")
		description := r.FormValue("description")
		completed := r.FormValue("completed") == "on"

		newTodo := Todo{
			ID:          nextTodoID,
			Title:       title,
			Description: description,
			Completed:   completed,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		todos = append(todos, newTodo)
		nextTodoID++

		http.Redirect(w, r, "/todos", http.StatusSeeOther)
	}
}

// 删除 Todo 处理器
func deleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	for i, todo := range todos {
		if todo.ID == id {
			todos = append(todos[:i], todos[i+1:]...)
			break
		}
	}

	http.Redirect(w, r, "/todos", http.StatusSeeOther)
}

// 登录处理器
func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		tmpl := template.Must(template.ParseFiles("templates/login.html"))
		tmpl.Execute(w, nil)
		return
	}

	if r.Method == "POST" {
		username := r.FormValue("username")
		password := r.FormValue("password")

		// 简单的验证逻辑（实际应用中应该使用数据库和密码哈希）
		if username == "admin" && password == "password" {
			session, _ := store.Get(r, "session")
			session.Values["authenticated"] = true
			session.Values["username"] = username
			session.Save(r, w)
			http.Redirect(w, r, "/todos", http.StatusSeeOther)
		} else {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		}
	}
}

// 注册处理器
func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		tmpl := template.Must(template.ParseFiles("templates/signup.html"))
		tmpl.Execute(w, nil)
		return
	}

	if r.Method == "POST" {
		username := r.FormValue("username")
		email := r.FormValue("email")
		password := r.FormValue("password")

		// 简单的注册逻辑（实际应用中应该使用数据库和密码哈希）
		newUser := User{
			ID:       nextUserID,
			Username: username,
			Email:    email,
		}

		users = append(users, newUser)
		nextUserID++

		http.Redirect(w, r, "/login", http.StatusSeeOther)
	}
}

// 登出处理器
func logoutHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	session.Values["authenticated"] = false
	session.Save(r, w)
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

// API 处理器 - 获取所有 Todos
func apiTodosHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

// API 处理器 - 获取单个 Todo
func apiTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	for _, todo := range todos {
		if todo.ID == id {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(todo)
			return
		}
	}

	http.Error(w, "Todo not found", http.StatusNotFound)
}

// 中间件 - 认证检查
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, _ := store.Get(r, "session")
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		next(w, r)
	}
}

func main() {
	r := mux.NewRouter()

	// 静态文件服务
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static/"))))

	// 公开路由
	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/login", loginHandler).Methods("GET", "POST")
	r.HandleFunc("/signup", signupHandler).Methods("GET", "POST")
	r.HandleFunc("/logout", logoutHandler).Methods("GET")

	// 需要认证的路由
	r.HandleFunc("/todos", authMiddleware(todosHandler)).Methods("GET")
	r.HandleFunc("/todos/new", authMiddleware(createTodoHandler)).Methods("POST")
	r.HandleFunc("/todos/{id}", authMiddleware(todoDetailHandler)).Methods("GET")
	r.HandleFunc("/todos/{id}/edit", authMiddleware(editTodoHandler)).Methods("GET", "POST")
	r.HandleFunc("/todos/{id}/delete", authMiddleware(deleteTodoHandler)).Methods("POST")

	// API 路由
	r.HandleFunc("/api/todos", apiTodosHandler).Methods("GET")
	r.HandleFunc("/api/todos/{id}", apiTodoHandler).Methods("GET")

	fmt.Println("服务器启动在 http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
