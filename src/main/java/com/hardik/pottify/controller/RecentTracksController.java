package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.constant.Template;
import com.hardik.pottify.service.RecentPlayesTrackService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class RecentTracksController {

	private final RecentPlayesTrackService tracks;

	@GetMapping(value = ApiPath.RECENT_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String recentTracksHandler(final HttpSession session, final Model model) {
		model.addAttribute("tracks", tracks.getHistory((String) session.getAttribute("accessToken")));
		return Template.RECENT_TRACKS;
	}

}
