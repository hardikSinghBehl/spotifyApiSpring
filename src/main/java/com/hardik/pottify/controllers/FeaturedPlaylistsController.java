package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.FeaturedPlaylists;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class FeaturedPlaylistsController {

	private final FeaturedPlaylists featuredPlaylists;

	@GetMapping("/featuredPlaylists")
	public String featuredPlaylistsHandler(HttpSession session, Model model) {
		model.addAttribute("playlists", featuredPlaylists.getPlaylists((String) session.getAttribute("accessToken")));
		return "featured-playlists";
	}

}
