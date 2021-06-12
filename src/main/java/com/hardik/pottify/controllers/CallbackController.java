package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.exception.NoTrackPlayingException;
import com.hardik.pottify.service.AccessToken;
import com.hardik.pottify.service.CurrentPlaying;
import com.hardik.pottify.service.SpotifyUrlService;
import com.hardik.pottify.service.UserDetails;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class CallbackController {

	private final SpotifyUrlService url;
	private final AccessToken accessToken;
	private final UserDetails userDetails;
	private final CurrentPlaying currentPlaying;

	@GetMapping("/callback")
	public String handleCallback(@RequestParam(value = "code", required = false) String code,
			@RequestParam(value = "error", required = false) String error, Model model, HttpSession session) {

		if (error != null) {
			model.addAttribute("url", url.getAuthorizationURL());
			return "callback-failure";
		}
		session.setAttribute("code", code);
		String token = accessToken.getToken(code);

		session.setAttribute("accessToken", token);
		model.addAttribute("accessToken", token);
		System.out.println(token);

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
