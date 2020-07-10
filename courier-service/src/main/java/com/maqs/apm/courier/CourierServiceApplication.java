package com.maqs.apm.courier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.maqs")
public class CourierServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourierServiceApplication.class, args);
	}

}
