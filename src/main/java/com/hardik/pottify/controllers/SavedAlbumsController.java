package com.hardik.pottify.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.exception.NoAlbumSavedException;
import com.hardik.pottify.service.SavedAlbumService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class SavedAlbumsController {

	private final SavedAlbumService savedAlbumService;

	@GetMapping("/savedAlbums")
	public String savedAlbumsHandler(final HttpSession session, final Model model) {
		try {
			model.addAttribute("albums", savedAlbumService.getAlbums((String) session.getAttribute("accessToken")));
		} catch (NoAlbumSavedException exception) {
			return "no-album-saved";
		}
		return "saved-albums";
	}

}
