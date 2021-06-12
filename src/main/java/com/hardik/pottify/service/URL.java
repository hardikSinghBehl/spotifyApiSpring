package com.hardik.pottify.service;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import com.hardik.pottify.properties.SpotifyAppConfigurationProperties;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@EnableConfigurationProperties(SpotifyAppConfigurationProperties.class)
public class URL {

	private final SpotifyAppConfigurationProperties spotifyAppConfigurationProperties;
	private CodeChallenge codeChallengeObj = new CodeChallenge();
	private String codeChallenge = codeChallengeObj.generate();
	private String codeVerifier = codeChallengeObj.getCodeVerifier();

	public URL() throws Exception {
		super();
	}

	public String getClientId() {
		return clientId;
	}

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public String getCodeChallenge() {
		return codeChallenge;
	}

	public String getCodeVerifier() {
		return codeVerifier;
	}

	public String getAuthorizationURL() {
		final var properties = spotifyAppConfigurationProperties.getApp();
		return "https://accounts.spotify.com/en/authorize?client_id=" + properties.getClientId()
				+ "&response_type=code&redirect_uri=" + properties.getRedirectUrl()
				+ "&code_challenge_method=S256&code_challenge=" + getCodeChallenge()
				+ "&scope=ugc-image-upload,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,streaming,app-remote-control,user-read-email,user-read-private"
				+ ",playlist-read-collaborative,playlist-modify-public,playlist-read-private,playlist-modify-private,user-library-modify,user-library-read,user-top-read,user-read-playback-position,user-read-recently-played,user-follow-read,user-follow-modify";
	}
}
