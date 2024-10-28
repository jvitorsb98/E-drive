package br.com.cepedi.e_drive.audit.interceptor;

import br.com.cepedi.e_drive.security.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor responsável por capturar e registrar o endereço IP do cliente
 * nas requisições HTTP.
 * <p>
 * O {@link IpAddressInterceptor} é um componente que implementa o {@link HandlerInterceptor}
 * e é utilizado para interceptar as requisições HTTP, obter o endereço IP do cliente e
 * armazená-lo para fins de auditoria e rastreamento.
 * </p>
 */
@Component
public class IpAddressInterceptor implements HandlerInterceptor {


    /**
     * Intercepta a requisição antes de ser processada pelo manipulador.
     * <p>
     * Este método obtém o endereço IP do cliente a partir do cabeçalho "X-FORWARDED-FOR"
     * se estiver presente; caso contrário, obtém o endereço IP remoto da requisição.
     * O endereço IP é então registrado utilizando o {@link LoggingAspect}.
     * </p>
     *
     * @param request A requisição HTTP.
     * @param response A resposta HTTP.
     * @param handler O manipulador de requisição.
     * @return {@code true} para permitir a continuação da execução, {@code false} para interromper.
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        System.out.println("IP Capturado: " + ipAddress);
        return true;
    }

    /**
     * Executado após a conclusão do processamento da requisição.
     * <p>
     * Este método é chamado após a execução do manipulador e é utilizado para limpar
     * o endereço IP do cliente registrado utilizando o {@link LoggingAspect}.
     * </p>
     *
     * @param request A requisição HTTP.
     * @param response A resposta HTTP.
     * @param handler O manipulador de requisição.
     * @param ex Exceção lançada, se houver.
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        LoggingAspect.clearhttpServletRequestThreadLocal();
    }
}