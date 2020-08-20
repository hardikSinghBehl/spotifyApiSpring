package com.hardik.spotifyData.service;

import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserDetails {
	
	@Autowired
	private RestTemplate restTemplate;
	
	public LinkedHashMap getUser(String token) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer "+token);
		
		HttpEntity<String> entity = new HttpEntity<>("paramters",headers);
		
		
		ResponseEntity<Object> response = restTemplate.exchange("https://api.spotify.com/v1/me", HttpMethod.GET, entity, Object.class);
		LinkedHashMap result = (LinkedHashMap)response.getBody();
		
		return result;
	}
	
	public String getUsername(String token) {
		LinkedHashMap user = getUser(token);
		return (String)user.get("display_name");
	}

}
