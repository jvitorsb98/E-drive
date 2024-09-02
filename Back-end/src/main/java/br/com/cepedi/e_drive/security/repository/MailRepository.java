package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.Mail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações de persistência e recuperação de entidades {@link Mail}.
 * <p>
 * Esta interface fornece métodos para interagir com a tabela "mail" no banco de dados,
 * incluindo a recuperação de e-mails com base no remetente.
 * </p>
 */
@Repository
public interface MailRepository extends JpaRepository<Mail, Long> {

	/**
	 * Recupera uma lista de e-mails com base no endereço do remetente.
	 *
	 * @param from O endereço de e-mail do remetente.
	 * @return Uma lista de {@link Mail} onde o endereço do remetente corresponde ao parâmetro fornecido.
	 */
	List<Mail> findByFrom(String from);
}
