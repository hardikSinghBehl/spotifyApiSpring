package com.hardik.pottify.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.service.URL;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class IndexController {

	private final URL url;

	@GetMapping("/")
	public String showIndex(Model model) {
		model.addAttribute("url", url.getAuthorizationURL());
		return "index";
	}

}
