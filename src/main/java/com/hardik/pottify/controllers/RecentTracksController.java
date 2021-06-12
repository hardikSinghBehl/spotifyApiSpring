package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.RecentPlayesTrackService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class RecentTracksController {

	private final RecentPlayesTrackService tracks;

	@GetMapping("/recentTracks")
	public String recentTracksHandler(final HttpSession session, final Model model) {
		model.addAttribute("tracks", tracks.getHistory((String) session.getAttribute("accessToken")));
		return "recent-tracks";
	}

}
