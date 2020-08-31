package com.hardik.spotifyData.exceptions;

public class NoTrackSavedException extends RuntimeException {

	public NoTrackSavedException() {
		super();
	}

	public NoTrackSavedException(String message) {
		super(message);
	}
}
