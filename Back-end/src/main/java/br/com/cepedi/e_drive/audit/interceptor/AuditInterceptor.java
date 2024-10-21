package br.com.cepedi.e_drive.audit.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.service.AuditService;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuditInterceptor implements HandlerInterceptor {

    @Autowired
    private AuditService auditService;

   @Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    // Captura o endereço IP de origem
    String origin = request.getHeader("X-FORWARDED-FOR");
    if (origin == null) {
        origin = request.getRemoteAddr();
    }
    
    // Recupera informações do usuário autenticado
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user = null;
    
    if (authentication != null && authentication.getPrincipal() instanceof User) {
        user = (User) authentication.getPrincipal(); // Obtenha o objeto User diretamente
    }
    
    // Adiciona um timestamp para garantir a unicidade do event_name
    String eventName = "Request to " + request.getRequestURI() + " at " + System.currentTimeMillis();
    String description = "Method: " + request.getMethod();
    
    // Cria um objeto DataRegisterAudit com as informações a serem registradas
    DataRegisterAudit data = new DataRegisterAudit(eventName, description, origin, description);
    
    // Loga o evento
    auditService.logEvent(data, user); // Passa o objeto User
    return true;
}

    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {}

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {}
}
