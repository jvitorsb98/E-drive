package br.com.cepedi.e_drive.audit.interceptor;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.service.AuditService;
import br.com.cepedi.e_drive.security.model.entitys.User;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Aspecto responsável por registrar eventos de acesso aos serviços para auditoria.
 * <p>
 * O {@link LoggingAspect} utiliza Aspect-Oriented Programming (AOP) para interceptar chamadas de métodos
 * em serviços de auditoria, registrar informações relevantes como o nome do método, descrição, origem
 * da requisição e informações do usuário autenticado.
 * </p>
 */
@Aspect
@Component
public class LoggingAspect {

    @Autowired
    private AuditService auditService;

    private static ThreadLocal<String> clientIpAddress = new ThreadLocal<>();

    /**
     * Define o endereço IP do cliente no contexto da thread atual.
     * <p>
     * Este método é utilizado para definir o endereço IP do cliente que está fazendo a requisição,
     * que será registrado durante a execução dos métodos interceptados.
     * </p>
     *
     * @param ipAddress O endereço IP do cliente.
     */
    public static void setClientIpAddress(String ipAddress) {
        clientIpAddress.set(ipAddress);
    }

    /**
     * Remove o endereço IP do cliente do contexto da thread atual.
     * <p>
     * Este método é utilizado para limpar o endereço IP do cliente após a execução dos métodos
     * interceptados.
     * </p>
     */
    public static void clearClientIpAddress() {
        clientIpAddress.remove();
    }

    /**
     * Intercepta a execução de métodos em serviços de auditoria, exceto o próprio serviço de auditoria.
     * <p>
     * Este método é executado antes da chamada do método alvo. Ele coleta informações sobre o método
     * executado, a descrição do evento, o nome da classe do alvo, a origem da requisição (endereço IP do cliente)
     * e o usuário autenticado, se disponível. Essas informações são então usadas para registrar o evento
     * no serviço de auditoria.
     * </p>
     *
     * @param joinPoint O ponto de junção que fornece informações sobre o método interceptado.
     */
    @Before("execution(* br.com.cepedi.e_drive.audit.service.*.*(..)) && !target(br.com.cepedi.e_drive.audit.service.AuditService)")
    public void logServiceAccess(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String description = "Method execution";
        User user = null;
        String origin = clientIpAddress.get();

        // Recupera informações do usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        }

        DataRegisterAudit dataRegisterAudit = new DataRegisterAudit(methodName, description, joinPoint.getTarget().getClass().getSimpleName(), origin);

        auditService.logEvent(dataRegisterAudit, user);
    }
}
