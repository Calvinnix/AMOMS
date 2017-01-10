package com.calvinnix.web;

/**
 * Created by Calvin on 1/10/17.
 */
public class FlashMessage {

    private String message;
    private Status status;
    public FlashMessage(String message, Status status) {
        this.message = message;
        this.status = status;
    }
    public static enum Status {
        SUCCESS,
        INFO,
        FAILURE
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }

}
