package br.com.cepedi.e_drive.audit.service;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;

import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.repositorys.AuditLogRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável pela gestão de logs de auditoria.
 * <p>
 * A classe {@link AuditService} fornece métodos para registrar eventos de auditoria na aplicação.
 * Utiliza o repositório {@link AuditLogRepository} para persistir as informações de auditoria no banco de dados.
 * </p>
 */
@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Registra um evento de auditoria com base nos dados fornecidos.
     * <p>
     * Cria uma nova instância de {@link AuditLog} com as informações de auditoria e o usuário associado,
     * e a persiste no repositório {@link AuditLogRepository}.
     * </p>
     *
     * @param auditLogDetails Dados do evento de auditoria a ser registrado. Não pode ser nulo.
     * @param userId Usuário associado ao evento de auditoria. Pode ser nulo.
     */
  
     public void logEvent(DataRegisterAudit data, User user) {
        logger.info("Registrando evento de auditoria: {}", data);
    
        // Verifique se o usuário não é nulo
        if (user == null) {
            logger.warn("Usuário não autenticado. Não será registrado o evento de auditoria.");
            return; // Se não houver usuário, não salva o log
        }
    
        // Cria o log de auditoria usando o DataRegisterAudit
        AuditLog log = new AuditLog(data, user);
        auditLogRepository.save(log); // Salva o log no repositório
        logger.info("Evento de auditoria registrado com sucesso.");
    }
    
    
    
    

}
