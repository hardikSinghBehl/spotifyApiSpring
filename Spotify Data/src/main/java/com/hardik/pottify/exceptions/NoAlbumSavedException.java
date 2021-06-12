package com.hardik.pottify.exceptions;

public class NoAlbumSavedException extends RuntimeException {

	public NoAlbumSavedException() {
		super();
	}

	public NoAlbumSavedException(String message) {
		super(message);
	}

}
