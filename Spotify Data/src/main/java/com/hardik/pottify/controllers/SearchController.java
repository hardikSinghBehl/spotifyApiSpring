package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.exceptions.InvalidSearchException;
import com.hardik.pottify.service.SearchResults;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class SearchController {

	private final SearchResults searchResults;

	@PostMapping("/search")
	public String showSearchResults(@RequestParam("searchQuery") String searchQuery, HttpSession session, Model model) {
		String token = (String) session.getAttribute("accessToken");
		try {
			model.addAttribute("results", searchResults.search(token, searchQuery));
		} catch (InvalidSearchException exception) {
			return "search-error";
		}
		return "search-results";
	}

}
