package com.example.taskManager.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.taskManager.exception.TaskNotFoundException;
import com.example.taskManager.jwt.JwtAuthenticationHelper;
import com.example.taskManager.model.Task;
import com.example.taskManager.repository.TaskRepository;

@Service
public class TaskService {
	
	TaskRepository taskRepository;
	
	JwtAuthenticationHelper jwtHelper;
	
	@Autowired
	public TaskService(TaskRepository taskRepository, JwtAuthenticationHelper jwtHelper) {
		this.taskRepository = taskRepository;
		this.jwtHelper = jwtHelper;
	}
	
	// Get the user id from the token from the authorization header 
	public String getUserIdFromToken(String header) {
		String token = header.substring(7);
		return jwtHelper.getUserIdFromToken(token);
	}
	
	// Get all the task
	public List<Task> getAllTasks(String header) {
		String userId = getUserIdFromToken(header);
		return taskRepository.findByUserId(userId);
	}
	
	// add the task using the task and return remaining tasks using header
	public Task addTask(Task task, String header){
		String userId = getUserIdFromToken(header);
		task.setUserId(userId);
		return taskRepository.save(task);
	}

	// update the task using the task and return remaining tasks using header
	public Task updateTask(Task task, String header) {
		String userId = getUserIdFromToken(header);
		task.setUserId(userId);
		// Find the task first by taskId
		Optional<Task> oldOptionalTask = taskRepository.findById(task.getId());
		// Check is task exist or not
		if(!oldOptionalTask.isPresent()) {
			throw new TaskNotFoundException("Task Not Found");
		}
		// update the each field of the task 
		Task oldTask = oldOptionalTask.get();
		oldTask.setTitle(task.getTitle());
		oldTask.setDescription(task.getDescription());
	    oldTask.setPriority(task.getPriority());
	    oldTask.setSubTasks(task.getSubTasks());
	    oldTask.setDeadLine(task.getDeadLine());
	    
	    // save the task again 
	    taskRepository.save(oldTask);
	    return oldTask;
	}
	
	// Delete the task using the task and return remaining tasks using header 
	public Task deleteTask(Task task, String header) {
		Optional<Task> dbTask = taskRepository.findById(task.getId());
		if(!dbTask.isPresent()) {
			throw new TaskNotFoundException("Task not found");
		}
		taskRepository.deleteById(task.getId());
		return task;
	}
	
}
