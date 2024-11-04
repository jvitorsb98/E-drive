package br.com.cepedi.e_drive.audit.interceptor;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.service.AuditService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoggingAspectTest {

    @Mock
    private AuditService auditService;

    @Mock
    private TokenService tokenService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private JoinPoint joinPoint;

    @InjectMocks
    private LoggingAspect loggingAspect;

    @BeforeEach
    void setUp() {
        
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    @Test
    @DisplayName("Should log event when token is valid")
    void logServiceAccess_WithValidToken_ShouldLogEvent() {
        when(request.getHeader("Authorization")).thenReturn("Bearer validToken");
        when(tokenService.getIdUSerByToken("validToken")).thenReturn(1L);
        
        MethodSignature methodSignature = mock(MethodSignature.class);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        
        // Remover a simulação do método se não for necessária
        // when(methodSignature.getMethod()).thenReturn(Object.class.getDeclaredMethods()[0]);
        when(joinPoint.getTarget()).thenReturn(this);

        loggingAspect.logServiceAccess(joinPoint);
        ArgumentCaptor<DataRegisterAudit> auditCaptor = ArgumentCaptor.forClass(DataRegisterAudit.class);
        verify(auditService, times(1)).logEvent(auditCaptor.capture());

        DataRegisterAudit capturedAudit = auditCaptor.getValue();
    }



    @Test
    @DisplayName("Should not log event when token is invalid")
    void logServiceAccess_WithInvalidToken_ShouldNotLogEvent() {
        when(request.getHeader("Authorization")).thenReturn(null);
        MethodSignature methodSignature = mock(MethodSignature.class);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        
        when(methodSignature.getName()).thenReturn("testMethod");

        loggingAspect.logServiceAccess(joinPoint);

        verify(auditService, times(0)).logEvent(any(DataRegisterAudit.class));
    }

}
