package com.hardik.pottify.service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class CodeChallenge {
	
	private CodeVerifier codeVerifier = new CodeVerifier();
	
	private String code = codeVerifier.generate();
	
	public String generate() throws UnsupportedEncodingException, NoSuchAlgorithmException {
		byte[] bytes = code.getBytes("US-ASCII");
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(bytes, 0, bytes.length);
        byte[] digest = messageDigest.digest();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
	}
	
	public String getCodeVerifier() {
		return code;
	}	
}
