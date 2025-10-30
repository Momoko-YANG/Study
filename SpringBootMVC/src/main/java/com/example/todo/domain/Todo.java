package com.example.todo.domain;

import java.time.LocalDateTime;

public class Todo {
    private Integer id;
    private String title;
    private boolean done;
    private LocalDateTime creatAt;

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

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public LocalDateTime getCreatAt() {
        return creatAt;
    }

    public void setCreatAt(LocalDateTime creatAt) {
        this.creatAt = creatAt;
    }

    public Todo(Integer id, String title, boolean done, LocalDateTime creatAt) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.creatAt = creatAt;
    }

    public Todo() {
        
    }
}
