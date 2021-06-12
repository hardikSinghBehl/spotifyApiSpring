package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.browse.NewReleases;

@Controller
public class NewReleasesController {
	
	@Autowired
	private NewReleases newReleases;
	
	@GetMapping("/newReleases")
	public String newReleasesHandler(HttpSession session, Model model) {
		model.addAttribute("releases", newReleases.getReleases((String)session.getAttribute("accessToken")));
		return "new-releases.html";
	}

}
