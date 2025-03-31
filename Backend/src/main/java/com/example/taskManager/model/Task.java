package com.example.taskManager.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "tasks")
@Getter
@Setter
@NoArgsConstructor
public class Task {
	@Id
	private String id;
	
	private String title;
	
	private String description;
	
	private String priority;
	
	private List<SubTask> subTasks;
	
	private String deadLine;
	
	private String userId;
	
	// Inner class for the subtasks
	@Getter
	@Setter
	@NoArgsConstructor
	private static class SubTask{
		private String title;
		
		private String status;
	}
}
