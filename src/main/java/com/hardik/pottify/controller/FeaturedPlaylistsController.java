package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.service.FeaturedPlaylistService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class FeaturedPlaylistsController {

	private final FeaturedPlaylistService featuredPlaylists;

	@GetMapping(value = ApiPath.FEATURED_PLAYLIST, produces = MediaType.TEXT_HTML_VALUE)
	public String featuredPlaylistsHandler(final HttpSession session, final Model model) {
		model.addAttribute("playlists", featuredPlaylists.getPlaylists((String) session.getAttribute("accessToken")));
		return "featured-playlists";
	}

}
