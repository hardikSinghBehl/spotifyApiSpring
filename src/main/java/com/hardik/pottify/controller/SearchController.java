package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.exception.InvalidSearchException;
import com.hardik.pottify.service.SearchResultService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class SearchController {

	private final SearchResultService searchResults;

	@PostMapping(value = ApiPath.SEARCH, produces = MediaType.TEXT_HTML_VALUE)
	public String showSearchResults(@RequestParam("searchQuery") final String searchQuery, final HttpSession session,
			final Model model) {
		String token = (String) session.getAttribute("accessToken");
		try {
			model.addAttribute("results", searchResults.search(token, searchQuery));
		} catch (InvalidSearchException exception) {
			return "search-error";
		}
		return "search-results";
	}

}
