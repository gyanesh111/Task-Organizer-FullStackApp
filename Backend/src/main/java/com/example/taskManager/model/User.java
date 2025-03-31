package com.example.taskManager.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
	@Id
	private String id;
	
	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private String password;
	
	private List<Task> tasks;
}
