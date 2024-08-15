package br.com.cepedi.e_drive.security.service;



import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterMail;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import com.auth0.jwt.JWT;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.springframework.core.io.ClassPathResource;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Map;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private FreeMarkerConfigurer freeMarkerConfigurer;

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

    public void sendResetPasswordEmail(String name, String email, String token) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject("Password Reset");

        // Processando o modelo HTML
        Map<String, Object> model = Map.of("token", token, "name", name);
        String htmlBody = processHtmlTemplate("reset_password_email_template.html", model);

        helper.setText(htmlBody, true);

        emailSender.send(message);
        DataRegisterMail dataRegisterMail = new DataRegisterMail("shoppingstoreclient@gmail.com",email,htmlBody,"Password Reset");
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
        context.setVariable("verificador", "8050jk"); // Ou outro código de verificação dinâmico, se houver
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


    //ver se posso deixar isso publico, se não resolver o problema
    protected String processHtmlTemplate(String templateName, Map<String, Object> model) throws MessagingException {

        try {
            Configuration configuration = freeMarkerConfigurer.getConfiguration();
            Template template = configuration.getTemplate(templateName);
            return FreeMarkerTemplateUtils.processTemplateIntoString(template, model);
        } catch (Exception e) {
            throw new MessagingException("Failed to process email template", e);
        }
    }
}