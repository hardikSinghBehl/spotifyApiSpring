package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.constant.Template;
import com.hardik.pottify.exception.NoAccountDataException;
import com.hardik.pottify.service.TopArtistService;
import com.hardik.pottify.utility.TermPeriodUtility;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class TopArtistsController {

	private final TopArtistService topArtists;

	@GetMapping(value = ApiPath.TOP_ARTISTS, produces = MediaType.TEXT_HTML_VALUE)
	public String topArtistsHandler(@RequestParam("term") final Integer term, final HttpSession session,
			final Model model) {
		try {
			model.addAttribute("artists", topArtists.getTopArtists((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", TermPeriodUtility.getTerm(term));
		} catch (NoAccountDataException exception) {
			return Template.NO_DATA;
		}
		return Template.TOP_ARTISTS;
	}
}
