package com.hardik.spotifyData.exceptions;

public class InvalidSearchException extends RuntimeException{

	public InvalidSearchException() {
		super();
	}

	public InvalidSearchException(String message) {
		super(message);
	}
}
