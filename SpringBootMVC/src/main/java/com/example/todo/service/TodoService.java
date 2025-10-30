package com.example.todo.service;

import com.example.todo.domain.Todo;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Comparator;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Service
public class TodoService {

    private final Map<Integer, Todo> todoMap = new ConcurrentHashMap<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1000);

    public List<Todo> findAll() {
        return todoMap.values().stream()
               .sorted(Comparator.comparing(Todo::getCreatAt).reversed())
               .toList();
    }

    public Todo findById(Integer id) {
        return todoMap.get(id);
    }

    public Todo add(String title) {
        Integer id = idGenerator.getAndIncrement();
        Todo todo = new Todo(id, title, false, LocalDateTime.now());
        todoMap.put(id, todo);
        return todo;
    }

    public void update(Integer id, String title) {
        Todo todo = todoMap.get(id);
        if (todo != null) {
            todo.setTitle(title);
        }
    }

    public void toggle(Integer id) {
        Todo todo = todoMap.get(id);
        if (todo != null) {
            todo.setDone(!todo.isDone());
        }
    }

    public void delete(Integer id) {
        todoMap.remove(id);
    }
}
