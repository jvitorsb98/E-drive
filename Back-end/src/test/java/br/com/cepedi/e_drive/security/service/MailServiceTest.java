package br.com.cepedi.e_drive.security.service;

import br.com.cepedi.e_drive.security.model.entitys.Mail;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsMail;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.MailRepository;
import br.com.cepedi.e_drive.security.service.mail.MailService;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MailServiceTest {

    @InjectMocks
    private MailService mailService;

    @Mock
    private MailRepository mailRepository;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Deve registrar um novo e-mail e retornar os detalhes")
    void testRegister() {
        // Preparação dos dados para o registro do e-mail
        DataRegisterMail dataRegisterMail = new DataRegisterMail(
            "remetente@exemplo.com",
            "destinatario@exemplo.com",
            "Conteúdo do e-mail",
            "Assunto do e-mail"
        );

        // Criação de um objeto Mail simulado
        Mail mail = new Mail(dataRegisterMail);
        when(mailRepository.save(any(Mail.class))).thenReturn(mail); // Configuração do mock

        // Chamada ao método de registro
        DataDetailsMail result = mailService.register(dataRegisterMail);

        // Verificações
        assertNotNull(result); // Verifica se o resultado não é nulo
        assertEquals(dataRegisterMail.from(), result.from());
        assertEquals(dataRegisterMail.to(), result.to());
        assertEquals(dataRegisterMail.content(), result.content());
        assertEquals(dataRegisterMail.subject(), result.subject());
    }


    @Test
    @DisplayName("Deve listar todos os e-mails com paginação")
    void testListAll() {
        List<Mail> mails = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            mails.add(new Mail(
                    null,
                    faker.internet().emailAddress(),
                    faker.internet().emailAddress(),
                    faker.lorem().sentence(),
                    faker.lorem().word()
            ));
        }
        Pageable pageable = PageRequest.of(0, 10);
        Page<Mail> mailPage = new PageImpl<>(mails, pageable, mails.size());
        when(mailRepository.findAll(pageable)).thenReturn(mailPage);

        Page<DataDetailsMail> result = mailService.listAll(pageable);

        assertNotNull(result);
        assertEquals(10, result.getSize());
    }

    @Test
    @DisplayName("Deve encontrar um e-mail pelo ID")
    void testFindById() {
        Mail mail = new Mail(
                1L, // ID fictício
                faker.internet().emailAddress(),
                faker.internet().emailAddress(),
                faker.lorem().sentence(),
                faker.lorem().word()
        );
        when(mailRepository.findById(1L)).thenReturn(Optional.of(mail));

        DataDetailsMail result = mailService.findById(1L);

        assertNotNull(result);
        assertEquals(mail.getId(), result.id());
        assertEquals(mail.getFrom(), result.from());
        assertEquals(mail.getTo(), result.to());
        assertEquals(mail.getContent(), result.content());
        assertEquals(mail.getSubject(), result.subject());
    }

    @Test
    @DisplayName("Deve lançar exceção se o e-mail não for encontrado pelo ID")
    void testFindById_MailNotFound() {
        when(mailRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            mailService.findById(-1L);
        });
    }

    @Test
    @DisplayName("Deve encontrar e-mails pelo endereço do remetente")
    void testFindByFrom() {
        String sender = faker.internet().emailAddress();
        List<Mail> mails = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            mails.add(new Mail(
                    null,
                    sender,
                    faker.internet().emailAddress(),
                    faker.lorem().sentence(),
                    faker.lorem().word()
            ));
        }
        when(mailRepository.findByFrom(sender)).thenReturn(mails);

        List<DataDetailsMail> result = mailService.findByFrom(sender);

        assertNotNull(result);
        assertEquals(5, result.size());
        assertTrue(result.stream().allMatch(mail -> mail.from().equals(sender)));
    }
}
