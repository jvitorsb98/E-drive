package br.com.cepedi.e_drive.audit.interceptor;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.service.AuditService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


/**
 * Aspecto responsável por registrar eventos de acesso aos serviços para auditoria.
 */
@Aspect
@Component
public class LoggingAspect {

    @Autowired
    private AuditService auditService;

    @Autowired
    private TokenService tokenService;

    private static ThreadLocal<HttpServletRequest> httpServletRequestThreadLocal = new ThreadLocal<>();


    public static void sethttpServletRequestThreadLocal(HttpServletRequest httpServletRequest) {
        httpServletRequestThreadLocal.set(httpServletRequest);
    }

    public static void clearhttpServletRequestThreadLocal() {
        httpServletRequestThreadLocal.remove();
    }

    /**
     * Intercepta a execução de métodos em serviços da aplicação.
     */
    @Before("execution(* br.com.cepedi.e_drive.service..*(..))")
    public void logServiceAccess(JoinPoint joinPoint) {
        // Obtendo a requisição diretamente do RequestContextHolder
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        System.out.println("Request aaaa" + request);
        String authorizationHeader = request.getHeader("Authorization");
        Long userId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            userId = tokenService.getIdUSerByToken(token); // Extrai o ID do usuário do token
        }
        System.out.println(userId);

        // Coleta informações para auditoria
        String methodName = joinPoint.getSignature().getName();
        String description = "Method execution";
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }


        // Se o userId for null, não registra o evento
        if (userId == null) {
            return;
        }

        // Criação do registro de auditoria
        DataRegisterAudit dataRegisterAudit = new DataRegisterAudit(methodName, description, userId, null, joinPoint.getTarget().getClass().getSimpleName(), ipAddress);

        // Log do evento
        auditService.logEvent(dataRegisterAudit);
    }
}