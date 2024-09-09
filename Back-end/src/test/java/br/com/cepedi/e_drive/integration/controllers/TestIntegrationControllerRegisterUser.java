//package br.com.cepedi.e_drive.integration.controllers;
//
//import br.com.cepedi.e_drive.config.TestConfig;
//import br.com.cepedi.e_drive.integration.containers.AbstractIntegrationTest;
//import br.com.cepedi.e_drive.security.model.records.register.DataAuth;
//import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
//import com.fasterxml.jackson.databind.DeserializationFeature;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.github.javafaker.Faker;
//import io.restassured.builder.RequestSpecBuilder;
//import io.restassured.filter.log.LogDetail;
//import io.restassured.filter.log.RequestLoggingFilter;
//import io.restassured.filter.log.ResponseLoggingFilter;
//import io.restassured.response.Response;
//import io.restassured.specification.RequestSpecification;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Order;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestMethodOrder;
//import org.junit.jupiter.api.MethodOrderer;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.time.LocalDate;
//
//import static io.restassured.RestAssured.given;
//import static org.junit.jupiter.api.Assertions.*;
//
//@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
//@ActiveProfiles("test-integration")
//public class TestIntegrationControllerRegisterUser extends AbstractIntegrationTest {
//
//    private static RequestSpecification specificationRegister;
//
//    private static RequestSpecification specificationGetAllBrands;
//
//
//    private static RequestSpecification specificationLogin;
//
//    private static ObjectMapper objectMapper;
//
//    private static final Faker faker = new Faker();
//
//    private static String token;
//
//    private static String registeredEmail;
//
//
//    @BeforeAll
//    static void setup() {
//        objectMapper = new ObjectMapper();
//        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//
//        specificationRegister = new RequestSpecBuilder()
//                .setBasePath("/auth/register")
//                .setPort(TestConfig.SERVE_PORT)
//                .addFilter(new RequestLoggingFilter(LogDetail.ALL))
//                .addFilter(new ResponseLoggingFilter(LogDetail.ALL))
//                .build();
//
//        specificationLogin = new RequestSpecBuilder()
//                .setBasePath("/auth/login")
//                .setPort(TestConfig.SERVE_PORT)
//                .addFilter(new RequestLoggingFilter(LogDetail.ALL))
//                .addFilter(new ResponseLoggingFilter(LogDetail.ALL))
//                .build();
//
//        specificationGetAllBrands = new RequestSpecBuilder()
//                .setBasePath("/api/brands")
//                .setPort(TestConfig.SERVE_PORT)
//                .addFilter(new RequestLoggingFilter(LogDetail.ALL))
//                .addFilter(new ResponseLoggingFilter(LogDetail.ALL))
//                .build();
//
//        registeredEmail = faker.internet().emailAddress();
//
//    }
//
//
//    @Test
//    @DisplayName("Test create user")
//    @Order(1)
//    void registerUser() {
//        DataRegisterUser data = new DataRegisterUser(
//                registeredEmail,
//                faker.name().fullName(),
//                "SecurePassword123*",
//                LocalDate.parse("1990-01-01"),
//                faker.phoneNumber().cellPhone()
//        );
//
//        String response = given().spec(specificationRegister)
//                .contentType(TestConfig.CONTENT_TYPE_JSON)
//                .body(data)
//                .when()
//                .post()
//                .then()
//                .statusCode(200)
//                .extract()
//                .body()
//                .asString();
//
//        assertNotNull(response);
//        assertEquals("User registered successfully. Activation email sent.", response);
//    }
//
//    @Test
//    @DisplayName("Test login user with unactivated account")
//    @Order(2)
//    void loginUserWithUnactivatedAccount() {
//        // Crie um objeto DataAuth com email e senha
//        DataAuth dataAuth = new DataAuth(
//                registeredEmail,
//                "SecurePassword123*"
//        );
//
//        // Tente fazer o login
//        Response response = given()
//                .spec(specificationLogin)
//                .contentType(TestConfig.CONTENT_TYPE_JSON)
//                .body(dataAuth)
//                .when()
//                .post()
//                .then()
//                .statusCode(400)
//                .extract()
//                .response();
//
//        // Verifique se a resposta contém a mensagem esperada
//        assertEquals("User is not activated", response.asString());
//    }
//
//
//
//}
