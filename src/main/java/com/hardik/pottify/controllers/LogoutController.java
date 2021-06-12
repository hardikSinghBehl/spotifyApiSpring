package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.constant.ApiPath;

@Controller
public class LogoutController {

	@GetMapping(value = ApiPath.LOGOUT, produces = MediaType.TEXT_HTML_VALUE)
	public String logoutHandler(final HttpSession session) {
		session.invalidate();
		return "redirect:/?logout";
	}
}
