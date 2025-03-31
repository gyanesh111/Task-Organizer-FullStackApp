package com.example.taskManager.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskManager.model.Task;
import com.example.taskManager.service.TaskService;

@RestController
@RequestMapping("/api")
public class TaskController {
	
	TaskService taskService;
	
	@Autowired
	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}
	
	// Get all the tasks
	@PostMapping("/tasks")
	public ResponseEntity<List<Task>> getAllTask(@RequestHeader("Authorization") String header){
		List<Task> response = taskService.getAllTasks(header);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	// When we add a task all the task should send to the user which are related to the user
	@PostMapping("/task/add")
	public ResponseEntity<Task> addTask(@RequestBody Task task, @RequestHeader("Authorization") String header){
		Task response = taskService.addTask(task, header);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/task/update")
	public ResponseEntity<Task> updateTask(@RequestBody Task task, @RequestHeader("Authorization") String header){
		Task response = taskService.updateTask(task, header);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("task/delete")
	public ResponseEntity<Task> deleteTask(@RequestBody Task task, @RequestHeader("Authorization") String header){
		Task response = taskService.deleteTask(task, header);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
