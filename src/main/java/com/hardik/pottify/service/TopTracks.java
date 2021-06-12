package com.hardik.pottify.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hardik.pottify.exception.NoAccountDataException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopTracks {

	private final RestTemplate restTemplate;

	private String url = "https://api.spotify.com/v1/me/top/tracks?time_range=";

	public Object getTopTracks(String token, int term) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + token);

		String terms[] = { "short_term", "medium_term", "long_term" };

		HttpEntity<String> entity = new HttpEntity<>("paramters", headers);

		ResponseEntity<Object> response = restTemplate.exchange(url + terms[term], HttpMethod.GET, entity,
				Object.class);
		LinkedHashMap result = (LinkedHashMap) response.getBody();

		ArrayList items = (ArrayList) result.get("items");

		if (items.size() == 0) {
			throw new NoAccountDataException();
		}

		return result;
	}

}
