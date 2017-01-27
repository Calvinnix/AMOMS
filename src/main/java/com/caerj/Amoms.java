package com.caerj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Amoms {

	//todo:ctn Add javascript validation for adding user
	//todo:ctn update current tab correctly
	//todo:ctn refactor how roles are loaded in app.js

	public static void main(String[] args) {
		SpringApplication.run(Amoms.class, args);
	}
}