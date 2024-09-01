package br.com.cepedi.e_drive.security.service.mail;

import br.com.cepedi.e_drive.security.model.entitys.Mail;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsMail;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.MailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciar e operar com e-mails no sistema.
 * <p>
 * Esta classe fornece métodos para registrar novos e-mails, listar e-mails com paginação,
 * encontrar e-mails por ID e por remetente.
 * </p>
 */
@Service
public class MailService {

    @Autowired
    private MailRepository mailRepository;

    /**
     * Registra um novo e-mail no sistema.
     *
     * @param dataRegisterMail Dados do e-mail a ser registrado.
     * @return Os detalhes do e-mail registrado.
     */
    public DataDetailsMail register(DataRegisterMail dataRegisterMail) {
        Mail mail = new Mail(dataRegisterMail);
        Mail savedMail = mailRepository.save(mail);
        return new DataDetailsMail(savedMail);
    }

    /**
     * Lista todos os e-mails com paginação.
     *
     * @param pageable Informações de paginação.
     * @return Uma página de e-mails.
     */
    public Page<DataDetailsMail> listAll(Pageable pageable) {
        return mailRepository.findAll(pageable)
                .map(DataDetailsMail::new);
    }

    /**
     * Encontra um e-mail pelo ID.
     *
     * @param id ID do e-mail.
     * @return Os detalhes do e-mail encontrado.
     * @throws IllegalArgumentException Se o e-mail não for encontrado com o ID fornecido.
     */
    public DataDetailsMail findById(Long id) {
        Mail mail = mailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mail not found with ID: " + id));
        return new DataDetailsMail(mail);
    }

    /**
     * Encontra todos os e-mails enviados por um remetente específico.
     *
     * @param from Endereço de e-mail do remetente.
     * @return Lista de detalhes dos e-mails enviados pelo remetente.
     */
    public List<DataDetailsMail> findByFrom(String from) {
        List<Mail> mails = mailRepository.findByFrom(from);
        return mails.stream().map(DataDetailsMail::new).collect(Collectors.toList());
    }
}
