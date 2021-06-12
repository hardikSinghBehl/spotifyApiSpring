package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.exception.NoTrackSavedException;
import com.hardik.pottify.service.SavedTrackService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class SavedTracksController {

	private final SavedTrackService savedTracks;

	@GetMapping(value = ApiPath.SAVED_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String savedTracksHandler(final HttpSession session, final Model model) {
		try {
			model.addAttribute("tracks", savedTracks.getTracks((String) session.getAttribute("accessToken")));
		} catch (NoTrackSavedException exception) {
			return "no-track-saved";
		}
		return "saved-tracks";
	}

}
