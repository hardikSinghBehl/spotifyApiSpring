package com.hardik.pottify.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hardik.pottify.constant.ApiPath;
import com.hardik.pottify.constant.Template;
import com.hardik.pottify.exception.NoAccountDataException;
import com.hardik.pottify.exception.NoAlbumSavedException;
import com.hardik.pottify.exception.NoTrackSavedException;
import com.hardik.pottify.service.FeaturedPlaylistService;
import com.hardik.pottify.service.NewReleasedService;
import com.hardik.pottify.service.RecentPlayesTrackService;
import com.hardik.pottify.service.SavedAlbumService;
import com.hardik.pottify.service.SavedTrackService;
import com.hardik.pottify.service.TopArtistService;
import com.hardik.pottify.service.TopTrackService;
import com.hardik.pottify.utility.TermPeriodUtility;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class MusicController {

	private final TopTrackService topTrackService;
	private final TopArtistService topArtistService;
	private final SavedTrackService savedTrackService;
	private final SavedAlbumService savedAlbumService;
	private final NewReleasedService newReleasedService;
	private final RecentPlayesTrackService recentPlayedTrackService;
	private final FeaturedPlaylistService featuredPlaylistService;

	@GetMapping(value = ApiPath.TOP_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String topTracksaHandler(@RequestParam("term") final Integer term, final HttpSession session,
			final Model model) {
		try {
			model.addAttribute("tracks",
					topTrackService.getTopTracks((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", TermPeriodUtility.getTerm(term));
		} catch (NoAccountDataException exception) {
			return Template.NO_DATA;
		}
		return Template.TOP_TRACKS;
	}

	@GetMapping(value = ApiPath.TOP_ARTISTS, produces = MediaType.TEXT_HTML_VALUE)
	public String topArtistsHandler(@RequestParam("term") final Integer term, final HttpSession session,
			final Model model) {
		try {
			model.addAttribute("artists",
					topArtistService.getTopArtists((String) session.getAttribute("accessToken"), term));
			model.addAttribute("term", TermPeriodUtility.getTerm(term));
		} catch (NoAccountDataException exception) {
			return Template.NO_DATA;
		}
		return Template.TOP_ARTISTS;
	}

	@GetMapping(value = ApiPath.SAVED_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String savedTracksHandler(final HttpSession session, final Model model) {
		try {
			model.addAttribute("tracks", savedTrackService.getTracks((String) session.getAttribute("accessToken")));
		} catch (NoTrackSavedException exception) {
			return Template.NO_TRACK_SAVED;
		}
		return Template.SAVED_TRACKS;
	}

	@GetMapping(value = ApiPath.SAVED_ALBUMS, produces = MediaType.TEXT_HTML_VALUE)
	public String savedAlbumsHandler(final HttpSession session, final Model model) {
		try {
			model.addAttribute("albums", savedAlbumService.getAlbums((String) session.getAttribute("accessToken")));
		} catch (NoAlbumSavedException exception) {
			return Template.NO_ALBUM_SAVED;
		}
		return Template.SAVED_ALBUMS;
	}

	@GetMapping(value = ApiPath.NEW_RELEASE, produces = MediaType.TEXT_HTML_VALUE)
	public String newReleasesHandler(final HttpSession session, final Model model) {
		model.addAttribute("releases", newReleasedService.getReleases((String) session.getAttribute("accessToken")));
		return Template.NEW_RELEASES;
	}

	@GetMapping(value = ApiPath.RECENT_TRACKS, produces = MediaType.TEXT_HTML_VALUE)
	public String recentTracksHandler(final HttpSession session, final Model model) {
		model.addAttribute("tracks", recentPlayedTrackService.getHistory((String) session.getAttribute("accessToken")));
		return Template.RECENT_TRACKS;
	}

	@GetMapping(value = ApiPath.FEATURED_PLAYLIST, produces = MediaType.TEXT_HTML_VALUE)
	public String featuredPlaylistsHandler(final HttpSession session, final Model model) {
		model.addAttribute("playlists",
				featuredPlaylistService.getPlaylists((String) session.getAttribute("accessToken")));
		return Template.FEATURED_PLAYLISTS;
	}

}
