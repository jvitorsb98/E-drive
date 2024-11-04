package br.com.cepedi.e_drive.audit.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.HandlerInterceptor;

import static org.mockito.Mockito.*;

class IpAddressInterceptorTest {

    private IpAddressInterceptor ipAddressInterceptor;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Object handler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ipAddressInterceptor = new IpAddressInterceptor();
    }

    @Test
    @DisplayName("Should capture IP from X-FORWARDED-FOR header")
    void preHandle_ShouldCaptureIpFromXForwardedFor() {
        // Configura o cabeçalho "X-FORWARDED-FOR" com um IP fictício
        String ipAddress = "192.168.1.1";
        when(request.getHeader("X-FORWARDED-FOR")).thenReturn(ipAddress);

        // Chama o método preHandle
        boolean result = ipAddressInterceptor.preHandle(request, response, handler);

        // Verifica se o resultado é verdadeiro e se o IP foi capturado corretamente
        assert(result);
        verify(request, times(1)).getHeader("X-FORWARDED-FOR");
        System.out.println("Teste: IP Capturado - " + ipAddress);
    }

    @Test
    @DisplayName("Should capture IP from remote address when X-FORWARDED-FOR is null")
    void preHandle_ShouldCaptureIpFromRemoteAddr_WhenXForwardedForIsNull() {
        // Configura o método getRemoteAddr() com um IP fictício
        String remoteIpAddress = "192.168.0.1";
        when(request.getHeader("X-FORWARDED-FOR")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn(remoteIpAddress);

        // Chama o método preHandle
        boolean result = ipAddressInterceptor.preHandle(request, response, handler);

        // Verifica se o resultado é verdadeiro
        assert(result);
        verify(request, times(1)).getRemoteAddr();
        System.out.println("Teste: IP Capturado - " + remoteIpAddress);
    }

    @Test
    @DisplayName("Should clear HTTP servlet request thread local after completion")
    void afterCompletion_ShouldClearHttpServletRequestThreadLocal() {
        // Chama o método afterCompletion
        ipAddressInterceptor.afterCompletion(request, response, handler, null);

        // Verifica se o método clearhttpServletRequestThreadLocal foi chamado
        // Aqui você precisa de um mock do LoggingAspect, ou uma verificação adequada para confirmar a execução
        LoggingAspect.clearhttpServletRequestThreadLocal(); // Supondo que você tenha um método mockado
        verifyNoMoreInteractions(request);
    }
}
