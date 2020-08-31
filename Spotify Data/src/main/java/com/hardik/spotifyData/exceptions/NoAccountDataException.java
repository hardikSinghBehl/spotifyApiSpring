package com.hardik.spotifyData.exceptions;

public class NoAccountDataException extends RuntimeException {

	public NoAccountDataException() {
		super();
	}

	public NoAccountDataException(String message) {
		super(message);
	}
}
