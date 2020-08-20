package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.spotifyData.service.AccessToken;
import com.hardik.spotifyData.service.CurrentPlaying;
import com.hardik.spotifyData.service.URL;
import com.hardik.spotifyData.service.UserDetails;

@Controller
public class CallbackController {
	
	@Autowired
	private URL url;
	
	@Autowired
	private AccessToken accessToken;
	
	@Autowired
	private UserDetails userDetails;
	
	@Autowired
	private CurrentPlaying currentPlaying;
	
	
	@GetMapping("/callback")
	public String handleCallback(@RequestParam(value = "code", required = false)String code,
								 @RequestParam(value = "error", required = false)String error,
								 Model model,HttpSession session) {
		
		if (error!=null) {
			model.addAttribute("url", url.getAuthorizationURL());
			return "callback-failure";
		}
		session.setAttribute("code", code);
		String token = accessToken.getToken(code);
		
		session.setAttribute("accessToken", token);
		model.addAttribute("accessToken",token);
		System.out.println(token);
		
		model.addAttribute("userName", userDetails.getUsername(token));
		
		try {
			model.addAttribute("currentPlaying", currentPlaying.getCurrentPlaying(token));
			model.addAttribute("display", 1);
		}catch(Exception exception) {
			model.addAttribute("display", 0);
		}
		
		return "callback-success";
	}
}
