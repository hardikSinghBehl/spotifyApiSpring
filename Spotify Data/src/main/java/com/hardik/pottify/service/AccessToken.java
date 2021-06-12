package com.hardik.pottify.service;

import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class AccessToken {
	
	@Autowired
	private URL url;
	
	@Autowired
	private RestTemplate restTemplate;
	
	public String getToken(String code) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		
		MultiValueMap< String,String> map = new LinkedMultiValueMap<>();
		map.add("client_id", url.getClientId());
		map.add("grant_type", "authorization_code");
		map.add("code", code);
		map.add("redirect_uri", url.getRedirectUrl());
		map.add("code_verifier", url.getCodeVerifier());
		
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
		
		ResponseEntity<Object> response = restTemplate.postForEntity(
								"https://accounts.spotify.com/api/token", request, Object.class);		
		
		LinkedHashMap result = (LinkedHashMap)response.getBody();
		
		return (String)result.get("access_token");
	}

}
