package com.hardik.pottify.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.constant.Template;

@Controller
public class MyErrorController implements ErrorController {

	@RequestMapping(value = ApiPath.ERROR, produces = MediaType.TEXT_HTML_VALUE)
	public String handleError() {
		return Template.ERROR;
	}

}