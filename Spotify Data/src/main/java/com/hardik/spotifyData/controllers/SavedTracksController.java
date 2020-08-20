package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.spotifyData.service.library.SavedTracks;

@Controller
public class SavedTracksController {
	
	@Autowired
	private SavedTracks savedTracks;
	
	@GetMapping("/savedTracks")
	public String savedTracksHandler(HttpSession session, Model model) {
		try {
			model.addAttribute("tracks", savedTracks.getTracks((String)session.getAttribute("accessToken")));
		}catch(RuntimeException exception) {
			return "no-track-saved";
		}
		return "saved-tracks";
	}

}
