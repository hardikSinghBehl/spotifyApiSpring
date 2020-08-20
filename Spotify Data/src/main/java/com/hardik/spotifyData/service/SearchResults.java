package com.hardik.spotifyData.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SearchResults {
	
	@Autowired
	private RestTemplate restTemplate;
	
	private SearchQueryFormatter formatter = new SearchQueryFormatter();
	
	private String url  = "https://api.spotify.com/v1/search?q=SEARCH_QUERY&type=album,artist,playlist,track&limit=3";
	
	public Object search(String token, String searchQuery) {
		
		if (!isValid(token, searchQuery)) {
			throw new RuntimeException();
		}
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer "+token);
		
		HttpEntity<String> entity = new HttpEntity<>("paramters",headers);
		
		ResponseEntity<Object> response = restTemplate.exchange(url.replace("SEARCH_QUERY", formatter.format(searchQuery)), HttpMethod.GET, entity, Object.class);
		LinkedHashMap result = (LinkedHashMap)response.getBody();
		
		return result;
	}
	
	public boolean isValid(String token, String searchQuery) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer "+token);
		
		HttpEntity<String> entity = new HttpEntity<>("paramters",headers);
		
		ResponseEntity<Object> response = restTemplate.exchange(url.replace("SEARCH_QUERY", formatter.format(searchQuery)), HttpMethod.GET, entity, Object.class);
		LinkedHashMap result = (LinkedHashMap)response.getBody();
		
		LinkedHashMap albums = (LinkedHashMap)result.get("albums");
		ArrayList itemsAlbums = (ArrayList)albums.get("items");
		
		LinkedHashMap artists = (LinkedHashMap)result.get("artists");
		ArrayList itemsArtists = (ArrayList)albums.get("items");
		
		LinkedHashMap tracks = (LinkedHashMap)result.get("tracks");
		ArrayList itemsTracks = (ArrayList)albums.get("items");
		
		LinkedHashMap playlists = (LinkedHashMap)result.get("playlists");
		ArrayList itemsPlaylists = (ArrayList)albums.get("items");
		
		if ((itemsAlbums.size()+itemsArtists.size()+itemsPlaylists.size()+itemsTracks.size()) == 0) {
			return false;
		}
		
		return true;
		
	}
}
