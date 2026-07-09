package com.meubelpendawa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.time.ZoneId;
import java.util.TimeZone;

@SpringBootApplication
public class MeubelpendawaApplication {

	public static void main(String[] args) {
		System.out.println("JVM Zone = " + ZoneId.systemDefault());
        System.out.println("TimeZone = " + TimeZone.getDefault().getID());

        SpringApplication.run(MeubelpendawaApplication.class, args);
	}
	
}
