package com.hardik.spotifyData.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.spotifyData.service.URL;

@Controller
public class IndexController {
	
	@Autowired
	private URL url;
	
	@GetMapping("/")
	public String showIndex(Model model) {
		model.addAttribute("url", url.getAuthorizationURL());
		return "index";
	}
	
}
