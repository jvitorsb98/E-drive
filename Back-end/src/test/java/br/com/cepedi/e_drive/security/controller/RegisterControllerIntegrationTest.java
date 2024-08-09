package br.com.cepedi.e_drive.security.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRegisterUser;
import br.com.cepedi.e_drive.security.service.AuthService;
import br.com.cepedi.e_drive.security.service.EmailService;
import br.com.cepedi.e_drive.security.service.TokenService;

import java.time.LocalDate;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@SpringBootTest
@AutoConfigureMockMvc
public class RegisterControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private EmailService emailService;

    @MockBean
    private TokenService tokenService;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    void testRegisterUser() throws Exception {
        DataRegisterUser dataRegisterUser = new DataRegisterUser(
        		"validuser@example.com",
                "UserName",
                "Password143@",
                LocalDate.of(1990, 1, 1),
                "+1234567890"
        );
        
        DataDetailsRegisterUser dataDetails = new DataDetailsRegisterUser(
                "UserName",
                "validuser@example.com",
                LocalDate.of(1990, 1, 1),
                "+1234567890",
                true,
                "sample-token"
        );

        when(authService.register(any(DataRegisterUser.class))).thenReturn(dataDetails);

        MvcResult result = mockMvc.perform(post("/auth/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dataRegisterUser)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully. Activation email sent."))
                .andReturn();

        System.out.println("Response: " + result.getResponse().getContentAsString());

        verify(emailService, times(1)).sendActivationEmail(
                eq("UserName"), 
                eq("validuser@example.com"), 
                eq("sample-token")
        );
    }
}

