package br.com.cepedi.e_drive.audit.service;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import br.com.cepedi.e_drive.audit.record.input.DataRegisterAudit;
import br.com.cepedi.e_drive.audit.repositorys.AuditLogRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
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

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Registra um evento de auditoria com base nos dados fornecidos.
     * <p>
     * Cria uma nova instância de {@link AuditLog} com as informações de auditoria e o usuário associado,
     * e a persiste no repositório {@link AuditLogRepository}.
     * </p>
     *
     * @param data Dados do evento de auditoria a ser registrado. Não pode ser nulo.
     * @param user Usuário associado ao evento de auditoria. Pode ser nulo.
     */
    public void logEvent(DataRegisterAudit data) {
        User user = userRepository.getReferenceById(data.userId());
        AuditLog log = new AuditLog(data,user);
        auditLogRepository.save(log);
    }
}