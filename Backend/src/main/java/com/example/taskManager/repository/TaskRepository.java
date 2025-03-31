package com.example.taskManager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.taskManager.model.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, String>{
	List<Task> findByUserId(String userId);
}
