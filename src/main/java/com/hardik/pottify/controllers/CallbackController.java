package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.exception.NoTrackPlayingException;
import com.hardik.pottify.service.AccessTokenService;
import com.hardik.pottify.service.CurrentPlayingService;
import com.hardik.pottify.service.ProfileDetailService;
import com.hardik.pottify.service.SpotifyUrlService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class CallbackController {

	private final SpotifyUrlService spotifyUrlService;
	private final AccessTokenService accessToken;
	private final ProfileDetailService userDetails;
	private final CurrentPlayingService currentPlaying;

	@GetMapping(value = ApiPath.CALLBACK, produces = MediaType.TEXT_HTML_VALUE)
	public String handleCallback(@RequestParam(value = "code", required = false) final String code,
			@RequestParam(value = "error", required = false) final String error, final Model model,
			final HttpSession session) {

		if (error != null) {
			model.addAttribute("url", spotifyUrlService.getAuthorizationURL());
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
