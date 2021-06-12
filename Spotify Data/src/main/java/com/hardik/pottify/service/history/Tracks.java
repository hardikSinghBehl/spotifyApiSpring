package com.hardik.pottify.service.history;

import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class Tracks {
	
	@Autowired
	private RestTemplate restTemplate;
	
	private String url = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
	
	public Object getHistory(String token) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer "+token);

		HttpEntity<String> entity = new HttpEntity<>("paramters",headers);

		ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
		LinkedHashMap result = (LinkedHashMap)response.getBody();
		
		return result;
	}
}
