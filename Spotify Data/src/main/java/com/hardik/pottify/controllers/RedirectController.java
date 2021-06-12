package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.exceptions.NoTrackPlayingException;
import com.hardik.pottify.service.CurrentPlaying;
import com.hardik.pottify.service.UserDetails;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class RedirectController {

	private final UserDetails userDetails;
	private final CurrentPlaying currentPlaying;

	@GetMapping("/redirect")
	public String redirectToCallbackSuccess(HttpSession session, Model model) {

		String token = (String) session.getAttribute("accessToken");
		model.addAttribute("accessToken", token);
		model.addAttribute("userName", userDetails.getUsername(token));

		try {
			model.addAttribute("currentPlaying", currentPlaying.getCurrentPlaying(token));
			model.addAttribute("display", 1);
		} catch (NoTrackPlayingException exception) {
			model.addAttribute("display", 0);
		}
		return "callback-success";
	}

}
