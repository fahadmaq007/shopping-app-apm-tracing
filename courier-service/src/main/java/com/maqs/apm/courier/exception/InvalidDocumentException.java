package com.maqs.apm.courier.exception;

public class InvalidDocumentException extends RuntimeException {
    public InvalidDocumentException() {

    }

    public InvalidDocumentException(String message) {
        super(message);
    }
}
