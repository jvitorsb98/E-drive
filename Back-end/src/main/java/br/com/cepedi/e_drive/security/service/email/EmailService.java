package br.com.cepedi.e_drive.security.service.email;



import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.mail.MailService;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.springframework.core.io.ClassPathResource;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;


    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MailService mailService;

    @Async
    public void sendActivationEmailAsync(String name, String email, String tokenForActivate) throws MessagingException {
        sendActivationEmail(name, email, tokenForActivate);
    }

    @Async
    public void sendResetPasswordEmailAsync(String name, String email, String token) throws MessagingException {
        sendResetPasswordEmail(name,email,token);
    }

    public void sendResetPasswordEmail(String name, String email, String token) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Redefinição de Senha");

        // Configura o contexto do template
        Context context = new Context();
        context.setVariable("nome", name);
        context.setVariable("token", token);
        context.setVariable("titulo", "Redefinição de Senha");
        context.setVariable("texto", "Recebemos uma solicitação para redefinir sua senha. Para redefinir sua senha, clique no botão abaixo.");
        context.setVariable("linkRedefinicao", "http://localhost:8080/auth/reset-password?token=" + token); // Corrija esta variável

        // Processa o template Thymeleaf
        String htmlBody = templateEngine.process("reset_password_email_template", context);
        helper.setText(htmlBody, true);
        helper.setFrom("nao-responder@park.com.br");

        // Adiciona a imagem inline
        helper.addInline("logo", new ClassPathResource("/static/image/spring-security.png"));

        // Envia o e-mail
        emailSender.send(message);

        // Registra o e-mail enviado
        DataRegisterMail dataRegisterMail = new DataRegisterMail("shoppingstoreclient@gmail.com", email, htmlBody, "Password Reset");
        mailService.register(dataRegisterMail);
    }


    public String sendActivationEmail(String name, String email, String tokenForActivate) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Confirmação de Cadastro");

        // Contexto para o template
        Context context = new Context();
        context.setVariable("nome", name); // Adicionando a variável 'nome' para personalização
        context.setVariable("titulo", "Bem-vindo ao e-Drive, " + name + "!");
        context.setVariable("texto", "Estamos felizes em tê-lo(a) conosco. Para começar a usar o e-Drive, confirme seu cadastro clicando no link abaixo.");
        context.setVariable("linkConfirmacao", "http://localhost:8080/auth/activate?token=" + tokenForActivate);

        // Processa o template Thymeleaf
        String htmlBody = templateEngine.process("activate_user_by_email_template", context);
        helper.setText(htmlBody, true);
        helper.setFrom("nao-responder@park.com.br");

        // Adiciona a imagem inline
        helper.addInline("logo", new ClassPathResource("/static/image/spring-security.png"));

        // Envia o e-mail
        emailSender.send(message);

        // Registra o e-mail enviado
        DataRegisterMail dataRegisterMail = new DataRegisterMail("shoppingstoreclient@gmail.com", email, htmlBody, "Activation Email");
        mailService.register(dataRegisterMail);

        return tokenForActivate;
    }



}