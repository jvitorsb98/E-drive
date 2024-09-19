//package br.com.cepedi.e_drive.controller.propulsion;
//
//import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
//import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
//import br.com.cepedi.e_drive.service.propulsion.PropulsionService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.util.UriComponentsBuilder;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//class PropulsionControllerTest {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private PropulsionService propulsionService;
//
//    @InjectMocks
//    private PropulsionController propulsionController;
//
//    private ObjectMapper objectMapper;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        mockMvc = MockMvcBuilders.standaloneSetup(propulsionController).build();
//        objectMapper = new ObjectMapper();
//    }
//
//    @Test
//    @DisplayName("Should register a new propulsion successfully")
//    void shouldRegisterPropulsionSuccessfully() throws Exception {
//        // Arrange
//        DataRegisterPropulsion request = new DataRegisterPropulsion("Electric", "Battery", "EV123");
//        DataPropulsionDetails response = new DataPropulsionDetails(1L, "Electric", "Battery", "EV123");
//
//        when(propulsionService.register(any(DataRegisterPropulsion.class))).thenReturn(response);
//
//        // Act and Assert
//        mockMvc.perform(post("/api/v1/propulsions")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isCreated())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(content().json(objectMapper.writeValueAsString(response)));
//    }
//
//    @Test
//    @DisplayName("Should return 400 Bad Request when input data is invalid")
//    void shouldReturnBadRequestForInvalidInput() throws Exception {
//        // Arrange
//        DataRegisterPropulsion invalidRequest = new DataRegisterPropulsion("a", "", "");
//
//        // Act and Assert
//        mockMvc.perform(post("/api/v1/propulsions")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(invalidRequest)))
//                .andExpect(status().isBadRequest());
//    }
//}
