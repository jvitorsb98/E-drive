package br.com.cepedi.e_drive.infra.exception;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.validation.ValidationException;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

public class ErrorsHandlerTest {

	private final ErrorsHandler errorHandler = new ErrorsHandler();

	@Test
	@DisplayName("Test EntityNotFoundException")
	public void testEntityNotFoundException() {
		ResponseEntity<Object> responseEntity = errorHandler.Error404();
		assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
	}


	@Test
	@DisplayName("Test BadCredentialsException")
	public void testBadCredentialsException() {
		ResponseEntity<Object> responseEntity = errorHandler.handleBadCredentialsError();
		assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
	}

	@Test
	@DisplayName("Test AuthenticationException")
	public void testAuthenticationException() {
		ResponseEntity<Object> responseEntity = errorHandler.handleAuthenticationError();
		assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
	}

	@Test
	@DisplayName("Test AccessDeniedException")
	public void testAccessDeniedException() {
		ResponseEntity<Object> responseEntity = errorHandler.handleAccessDeniedError();
		assertEquals(HttpStatus.FORBIDDEN, responseEntity.getStatusCode());
	}

	@Test
	@DisplayName("Test Exception")
	public void testException() {
		Exception exception = new Exception("Test exception");
		ResponseEntity<Object> responseEntity = errorHandler.handle500Error(exception);
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
	}
	
	 @Test
	    @DisplayName("Test MethodArgumentNotValidException")
	    public void testMethodArgumentNotValidException() throws NoSuchFieldException, IllegalAccessException {
	        // Simula um erro de validação com um campo específico
	        FieldError fieldError = new FieldError("objectName", "fieldName", "error message");
	        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
	        when(exception.getFieldErrors()).thenReturn(List.of(fieldError));

	        ResponseEntity<Object> responseEntity = errorHandler.Error400(exception);
	        
	        // Verifica se o status HTTP é 400 Bad Request
	        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());

	        // Verifica se o corpo da resposta é uma lista com os erros esperados
	        List<?> errors = (List<?>) responseEntity.getBody();
	        assertNotNull(errors);
	        assertEquals(1, errors.size());

	        // Usa reflexão para acessar os campos do DataExceptionValidate
	        Object errorDetails = errors.get(0);
	        Field valueField = errorDetails.getClass().getDeclaredField("value");
	        Field messageField = errorDetails.getClass().getDeclaredField("message");

	        // Permite o acesso a campos privados
	        valueField.setAccessible(true);
	        messageField.setAccessible(true);

	        // Verifica se os valores são os esperados
	        assertEquals("fieldName", valueField.get(errorDetails));
	        assertEquals("error message", messageField.get(errorDetails));
	    }

    @Test
    @DisplayName("Test ValidationException")
    public void testValidationException() {
        // Creating the ValidationException
        ValidationException validationException = new ValidationException("Validation error occurred");

        // Executing the handler method
        ResponseEntity<Object> responseEntity = errorHandler.handleValidationException(validationException);

        // Validating the response
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Validation error occurred", responseEntity.getBody());
    }
}
