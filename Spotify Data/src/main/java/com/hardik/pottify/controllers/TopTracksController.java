package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hardik.pottify.exceptions.NoAccountDataException;
import com.hardik.pottify.service.TermPeriod;
import com.hardik.pottify.service.personalization.TopTracks;

@Controller
public class TopTracksController {
	
	@Autowired
	private TopTracks topTracks;
	
	@Autowired
	private TermPeriod termPeriod;
	
	@GetMapping("/topTracks")
	public String topTracksaHandler(@RequestParam("term")int term, HttpSession session,Model model) {
		try {
			model.addAttribute("tracks", topTracks.getTopTracks((String)session.getAttribute("accessToken"), term));
			model.addAttribute("term", termPeriod.getTerm(term));
		}
		catch(NoAccountDataException exception) {
			return "no-data";
		}
		return "top-tracks";
	}
}
