package br.com.cepedi.e_drive.audit.repositorys;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório para acesso e manipulação dos logs de auditoria.
 * <p>
 * A interface {@link AuditLogRepository} estende {@link JpaRepository} e fornece operações CRUD para a entidade
 * {@link AuditLog}. Ela permite a realização de operações básicas de banco de dados, como salvar, atualizar,
 * deletar e consultar logs de auditoria.
 * </p>
 *
 * @see AuditLog
 */
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
