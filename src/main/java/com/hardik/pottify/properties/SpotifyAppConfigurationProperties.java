package com.hardik.pottify.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "com.hardik.pottify")
public class SpotifyAppConfigurationProperties {

	private App app = new App();

	@Data
	public class App {
		private String clientId;
		private String redirectUrl;
	}
}
