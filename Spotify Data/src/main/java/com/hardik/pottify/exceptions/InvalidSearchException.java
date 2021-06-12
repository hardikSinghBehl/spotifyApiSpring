package com.hardik.pottify.exceptions;

public class InvalidSearchException extends RuntimeException{

	public InvalidSearchException() {
		super();
	}

	public InvalidSearchException(String message) {
		super(message);
	}
}
