package br.com.cepedi.e_drive.audit.repositorys;

import br.com.cepedi.e_drive.audit.entitys.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
