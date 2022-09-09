package io.ssafy.NFTeam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReadmeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReadmeApplication.class, args);
	}

//	@Bean
//	public HttpMessageConverter<String> responseBodyConverter() {
//		return new StringHttpMessageConverter(StandardCharsets.UTF_8);
//	}
//
//	@Bean
//	public CharacterEncodingFilter characterEncodingFilter() {
//		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
//		characterEncodingFilter.setEncoding("UTF-8");
//		characterEncodingFilter.setForceEncoding(true);
//		return characterEncodingFilter;
//	}

}
