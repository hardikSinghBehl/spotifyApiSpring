package com.hardik.pottify.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.SpotifyUrlService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class IndexController {

	private final SpotifyUrlService spotifyUrlService;

	@GetMapping("/")
	public String showIndex(Model model) {
		model.addAttribute("url", spotifyUrlService.getAuthorizationURL());
		return "index";
	}

}
