package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.constant.Template;
import com.hardik.pottify.exception.NoAlbumSavedException;
import com.hardik.pottify.service.SavedAlbumService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class SavedAlbumsController {

	private final SavedAlbumService savedAlbumService;

	@GetMapping(value = ApiPath.SAVED_ALBUMS, produces = MediaType.TEXT_HTML_VALUE)
	public String savedAlbumsHandler(final HttpSession session, final Model model) {
		try {
			model.addAttribute("albums", savedAlbumService.getAlbums((String) session.getAttribute("accessToken")));
		} catch (NoAlbumSavedException exception) {
			return Template.NO_ALBUM_SAVED;
		}
		return Template.SAVED_ALBUMS;
	}

}
