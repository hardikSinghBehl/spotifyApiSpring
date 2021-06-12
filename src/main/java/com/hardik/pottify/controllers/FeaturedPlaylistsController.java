package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.FeaturedPlaylistService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class FeaturedPlaylistsController {

	private final FeaturedPlaylistService featuredPlaylists;

	@GetMapping("/featuredPlaylists")
	public String featuredPlaylistsHandler(final HttpSession session, final Model model) {
		model.addAttribute("playlists", featuredPlaylists.getPlaylists((String) session.getAttribute("accessToken")));
		return "featured-playlists";
	}

}
