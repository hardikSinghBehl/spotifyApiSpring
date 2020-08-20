package com.hardik.spotifyData.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LogoutController {
	
	@GetMapping("/logout")
	public String logoutHandler(HttpSession session) {
		session.invalidate();
		return "redirect:/?logout";
	}
}
