package com.example.todo.form;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class TodoForm {

    private Integer id;

    @NotEmpty(message = "Title cannot be empty")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
