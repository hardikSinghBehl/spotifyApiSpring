package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.spotifyData.service.library.SavedAlbums;

@Controller
public class SavedAlbumsController {
	
	@Autowired
	private SavedAlbums savedAlbums;
	
	@GetMapping("/savedAlbums")
	public String savedAlbumsHandler(HttpSession session, Model model) {
		try {
			model.addAttribute("albums", savedAlbums.getAlbums((String)session.getAttribute("accessToken")));
		}catch(RuntimeException exception) {
			return "no-album-saved";
		}
			return "saved-albums";
	}

}
