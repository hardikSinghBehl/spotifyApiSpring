package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.exception.NoAccountDataException;
import com.hardik.pottify.service.TermPeriod;
import com.hardik.pottify.service.TopTrackService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class TopTracksController {

	private final TopTrackService topTracks;
	private final TermPeriod termPeriod;

	@GetMapping("/topTracks")
	public String topTracksaHandler(@RequestParam("term") int term, HttpSession session, Model model) {
		try {
			model.addAttribute("tracks", topTracks.getTopTracks((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", termPeriod.getTerm(term));
		} catch (NoAccountDataException exception) {
			return "no-data";
		}
		return "top-tracks";
	}
}
