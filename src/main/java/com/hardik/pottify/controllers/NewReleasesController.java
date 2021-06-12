package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.bean.ApiPath;
import com.hardik.pottify.service.NewReleasedService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class NewReleasesController {

	private final NewReleasedService newReleases;

	@GetMapping(value = ApiPath.NEW_RELEASE, produces = MediaType.TEXT_HTML_VALUE)
	public String newReleasesHandler(final HttpSession session, final Model model) {
		model.addAttribute("releases", newReleases.getReleases((String) session.getAttribute("accessToken")));
		return "new-releases.html";
	}

}
