package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.exceptions.NoAccountDataException;
import com.hardik.pottify.service.TermPeriod;
import com.hardik.pottify.service.personalization.TopArtists;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class TopArtistsController {

	private final TopArtists topArtists;
	private final TermPeriod termPeriod;

	@GetMapping("/topArtists")
	public String topArtistsHandler(@RequestParam("term") int term, HttpSession session, Model model) {

		try {
			model.addAttribute("artists", topArtists.getTopArtists((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", termPeriod.getTerm(term));
		} catch (NoAccountDataException exception) {
			return "no-data";
		}
		return "top-artists";
	}
}
