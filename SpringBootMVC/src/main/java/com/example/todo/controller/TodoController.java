package com.example.todo.controller;

import com.example.todo.service.TodoService;
import com.example.todo.form.TodoForm;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;

@Controller
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/todos")
    public String list(Model model, @ModelAttribute("todoForm") TodoForm todoForm) {
        model.addAttribute("todos", todoService.findAll());
        return "todos";
    }

    @PostMapping("/todos")
    public String add(@Validated @ModelAttribute("todoForm") TodoForm todoForm, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("todos", todoService.findAll());
            return "todos";
        }
        todoService.add(todoForm.getTitle());
        return "redirect:/todos";
    }
    
    @GetMapping("/todos/{id}/edit")
    public String editForm(@PathVariable Integer id, Model model) {
        model.addAttribute("todo", todoService.findById(id));
        model.addAttribute("todoForm", new TodoForm());
        return "edit";
    }

    @PostMapping("/todos/{id}/edit")
    public String edit(@PathVariable Integer id, @Validated @ModelAttribute("todoForm") TodoForm todoForm, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("todo", todoService.findById(id));
            return "edit";
        }
        todoService.update(id, todoForm.getTitle());
        return "redirect:/todos";
    }

    @GetMapping("/todos/{id}/detail")
    public String detail(@PathVariable Integer id, Model model) {
        model.addAttribute("todo", todoService.findById(id));
        return "detail";
    }
    
    @PostMapping("/todos/{id}/toggle")
    public String toggle(@PathVariable Integer id) {
        todoService.toggle(id);
        return "redirect:/todos";
    }

    @PostMapping("/todos/{id}/delete")
    public String delete(@PathVariable Integer id) {
        todoService.delete(id);
        return "redirect:/todos";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

}
