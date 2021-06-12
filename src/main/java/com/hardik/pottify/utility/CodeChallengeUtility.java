package com.hardik.pottify.utility;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CodeChallengeUtility {

	public static String generate(final String codeVerifier) {
		byte[] digest = null;
		try {
			byte[] bytes = codeVerifier.getBytes("US-ASCII");
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			messageDigest.update(bytes, 0, bytes.length);
			digest = messageDigest.digest();
		} catch (UnsupportedEncodingException | NoSuchAlgorithmException exception) {
			log.error("Unable to generate code challenge {}", exception);
		}
		return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
	}

}
