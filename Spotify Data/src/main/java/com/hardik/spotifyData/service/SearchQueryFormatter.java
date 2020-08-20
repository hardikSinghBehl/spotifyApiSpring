package com.hardik.spotifyData.service;

public class SearchQueryFormatter {
	
	public String format(String searchQuery) {
		return (searchQuery.trim()).replace(" ", "+");
	}
}
