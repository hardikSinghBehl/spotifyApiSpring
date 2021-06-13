package com.hardik.pottify.service;

import java.util.LinkedHashMap;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.hardik.pottify.properties.SpotifyAppConfigurationProperties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(value = SpotifyAppConfigurationProperties.class)
public class AccessTokenService {

	private final SpotifyUrlService spotifyUrlService;
	private final RestTemplate restTemplate;
	private final SpotifyAppConfigurationProperties spotifyAppConfigurationProperties;
	private static final String URL = "https://accounts.spotify.com/api/token";

	public String getToken(String code) {
		final var properties = spotifyAppConfigurationProperties.getApp();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("client_id", properties.getClientId());
		map.add("grant_type", "authorization_code");
		map.add("code", code);
		map.add("redirect_uri", properties.getRedirectUrl());
		map.add("code_verifier", spotifyUrlService.getCodeVerifier());

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

		ResponseEntity<Object> response = restTemplate.postForEntity(URL, request, Object.class);

		LinkedHashMap result = (LinkedHashMap) response.getBody();

		return (String) result.get("access_token");
	}

}
