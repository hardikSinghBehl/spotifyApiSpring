package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hardik.spotifyData.service.CurrentPlaying;
import com.hardik.spotifyData.service.SearchResults;
import com.hardik.spotifyData.service.UserDetails;

@Controller
public class SearchController {
	
	@Autowired
	private SearchResults searchResults;
	
	@PostMapping("/search")
	public String showSearchResults(@RequestParam("searchQuery")String searchQuery, HttpSession session, Model model) {
		String token = (String)session.getAttribute("accessToken");
		try {
			model.addAttribute("results", searchResults.search(token, searchQuery));
		}catch(RuntimeException exception) {
			return "search-error";
		}
		return "search-results";
	}
	
}
