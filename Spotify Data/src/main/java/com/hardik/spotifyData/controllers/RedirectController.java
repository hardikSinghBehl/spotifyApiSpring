package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.spotifyData.exceptions.NoTrackPlayingException;
import com.hardik.spotifyData.service.CurrentPlaying;
import com.hardik.spotifyData.service.UserDetails;

@Controller
public class RedirectController {
	
	@Autowired
	private UserDetails userDetails;
	
	@Autowired
	private CurrentPlaying currentPlaying;
	
	@GetMapping("/redirect")
	public String redirectToCallbackSuccess(HttpSession session, Model model) {
		
		String token = (String)session.getAttribute("accessToken");
		model.addAttribute("accessToken",token);
		model.addAttribute("userName", userDetails.getUsername(token));
		
		try {
			model.addAttribute("currentPlaying", currentPlaying.getCurrentPlaying(token));
			model.addAttribute("display", 1);
		}catch(NoTrackPlayingException exception) {
			model.addAttribute("display", 0);
		}
		return "callback-success";
	}

}
