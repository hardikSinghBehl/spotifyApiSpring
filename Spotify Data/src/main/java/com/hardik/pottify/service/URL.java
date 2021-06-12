package com.hardik.pottify.service;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;

@Service
public class URL {
	
	private CodeChallenge codeChallengeObj = new CodeChallenge();
	
	private final String clientId = "...";//Enter Your Client ID Here 
	
	private final String redirectUrl = "http://localhost:8080/callback";/*"http://spotifydata-env.eba-yfeju4iw.us-east-2.elasticbeanstalk.com./callback";*/
	
	private String codeChallenge = codeChallengeObj.generate();
	
	private String codeVerifier = codeChallengeObj.getCodeVerifier();
	
	
	public URL() throws Exception{
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
		return "https://accounts.spotify.com/en/authorize?client_id="+clientId+"&response_type=code&redirect_uri="+redirectUrl+"&code_challenge_method=S256&code_challenge="+getCodeChallenge()+"&scope=ugc-image-upload,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,streaming,app-remote-control,user-read-email,user-read-private" + 
				",playlist-read-collaborative,playlist-modify-public,playlist-read-private,playlist-modify-private,user-library-modify,user-library-read,user-top-read,user-read-playback-position,user-read-recently-played,user-follow-read,user-follow-modify";
	}
}
