package com.hardik.spotifyData.exceptions;

public class NoAlbumSavedException extends RuntimeException {

	public NoAlbumSavedException() {
		super();
	}

	public NoAlbumSavedException(String message) {
		super(message);
	}

}
