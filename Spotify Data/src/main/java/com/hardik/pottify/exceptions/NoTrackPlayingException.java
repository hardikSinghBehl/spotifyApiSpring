package com.hardik.pottify.exceptions;

public class NoTrackPlayingException extends RuntimeException{

	public NoTrackPlayingException() {
		super();
	}
	
	public NoTrackPlayingException(String message) {
		super(message);
	}
}
