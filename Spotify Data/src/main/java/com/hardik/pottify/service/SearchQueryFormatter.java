package com.hardik.pottify.service;

public class SearchQueryFormatter {
	
	public String format(String searchQuery) {
		return (searchQuery.trim()).replace(" ", "+");
	}
}
