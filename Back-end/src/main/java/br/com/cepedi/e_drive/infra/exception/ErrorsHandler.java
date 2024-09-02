package br.com.cepedi.e_drive.infra.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * A handler for exceptions thrown in the application. This class uses Spring's {@link RestControllerAdvice}
 * to provide centralized exception handling across the application.
 * <p>
 * The class contains methods for handling various exceptions, including validation errors, authentication errors,
 * access denial, and internal server errors. It logs the exceptions and returns appropriate HTTP responses.
 * </p>
 */
@RestControllerAdvice
public class ErrorsHandler {

    private static final Logger logger = LoggerFactory.getLogger(ErrorsHandler.class);

    /**
     * Handles {@link EntityNotFoundException} by returning a 404 Not Found status.
     * <p>
     * Logs an error message indicating that an EntityNotFoundException occurred.
     * </p>
     *
     * @return A {@link ResponseEntity} with a 404 Not Found status.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> Error404() {
        logger.error("EntityNotFoundException occurred.");
        return ResponseEntity.notFound().build();
    }

    /**
     * Handles {@link MethodArgumentNotValidException} by returning a 400 Bad Request status with validation errors.
     * <p>
     * Logs an error message and the exception details. The validation errors are extracted from the exception
     * and included in the response body.
     * </p>
     *
     * @param exception The {@link MethodArgumentNotValidException} to handle.
     * @return A {@link ResponseEntity} with a 400 Bad Request status and a list of validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> Error400(MethodArgumentNotValidException exception) {
        logger.error("MethodArgumentNotValidException occurred.", exception);
        List<FieldError> errors = exception.getFieldErrors();
        return ResponseEntity.badRequest().body(errors.stream().map(DataExceptionValidate::new).toList());
    }

    /**
     * Handles {@link BadCredentialsException} by returning a 401 Unauthorized status with a message indicating invalid credentials.
     * <p>
     * Logs an error message indicating that a BadCredentialsException occurred.
     * </p>
     *
     * @return A {@link ResponseEntity} with a 401 Unauthorized status and a message indicating invalid credentials.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsError() {
        logger.error("BadCredentialsException occurred.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    /**
     * Handles {@link AuthenticationException} by returning a 401 Unauthorized status with a message indicating authentication failure.
     * <p>
     * Logs an error message indicating that an AuthenticationException occurred.
     * </p>
     *
     * @return A {@link ResponseEntity} with a 401 Unauthorized status and a message indicating authentication failure.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationError() {
        logger.error("AuthenticationException occurred.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }

    /**
     * Handles {@link AccessDeniedException} by returning a 403 Forbidden status with a message indicating access denial.
     * <p>
     * Logs an error message indicating that an AccessDeniedException occurred.
     * </p>
     *
     * @return A {@link ResponseEntity} with a 403 Forbidden status and a message indicating access denial.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedError() {
        logger.error("AccessDeniedException occurred.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
    }

    /**
     * Handles general {@link Exception} by returning a 500 Internal Server Error status with a message indicating an internal server error.
     * <p>
     * Logs an error message and the exception details.
     * </p>
     *
     * @param ex The {@link Exception} to handle.
     * @return A {@link ResponseEntity} with a 500 Internal Server Error status and a message indicating an internal server error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handle500Error(Exception ex) {
        logger.error("Internal server error occurred.", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getLocalizedMessage());
    }

    /**
     * Handles {@link ValidationException} by returning a 400 Bad Request status with the validation exception message.
     * <p>
     * Logs an error message and the exception details.
     * </p>
     *
     * @param ex The {@link ValidationException} to handle.
     * @return A {@link ResponseEntity} with a 400 Bad Request status and the validation exception message.
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleValidationException(ValidationException ex) {
        logger.error("ValidationException occurred.", ex);
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    /**
     * A record to hold validation exception details, specifically the field name and error message.
     */
    private record DataExceptionValidate(String value, String message) {
        public DataExceptionValidate(FieldError error) {
            this(error.getField(), error.getDefaultMessage());
        }
    }
}
