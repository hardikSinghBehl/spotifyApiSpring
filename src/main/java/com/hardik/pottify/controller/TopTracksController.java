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
import com.hardik.pottify.service.TopTrackService;
import com.hardik.pottify.utility.TermPeriodUtility;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class TopTracksController {

	private final TopTrackService topTracks;

	@GetMapping(value = ApiPath.TOP_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String topTracksaHandler(@RequestParam("term") final Integer term, final HttpSession session,
			final Model model) {
		try {
			model.addAttribute("tracks", topTracks.getTopTracks((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", TermPeriodUtility.getTerm(term));
		} catch (NoAccountDataException exception) {
			return Template.NO_DATA;
		}
		return Template.TOP_TRACKS;
	}
}
