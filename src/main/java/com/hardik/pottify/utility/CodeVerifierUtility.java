package com.hardik.pottify.utility;

import java.security.SecureRandom;
import java.util.Base64;

public class CodeVerifierUtility {

	public static String generate() {
		SecureRandom secureRandom = new SecureRandom();
		byte[] codeVerifier = new byte[32];
		secureRandom.nextBytes(codeVerifier);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(codeVerifier);
	}
}
