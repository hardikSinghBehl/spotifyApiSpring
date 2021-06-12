package com.hardik.pottify.exceptions;

public class NoAccountDataException extends RuntimeException {

	public NoAccountDataException() {
		super();
	}

	public NoAccountDataException(String message) {
		super(message);
	}
}
