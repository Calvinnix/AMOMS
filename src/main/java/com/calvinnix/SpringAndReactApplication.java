package com.calvinnix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringAndReactApplication {

	//TODO:ctn add unit tests
	//TODO:ctn better way to load resources?
	//TODO:ctn security (sql injection)
	//TODO:ctn re-enable csrf
	//TODO:ctn add front-end login/signup form validation

	public static void main(String[] args) {
		SpringApplication.run(SpringAndReactApplication.class, args);
	}
}
