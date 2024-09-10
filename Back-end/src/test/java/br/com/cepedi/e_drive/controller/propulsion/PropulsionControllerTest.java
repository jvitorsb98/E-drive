//package br.com.cepedi.e_drive.controller.propulsion;
//
//import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
//import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
//import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
//import br.com.cepedi.e_drive.service.propulsion.PropulsionService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
//
//import java.util.Collections;
//
//import static org.mockito.BDDMockito.given;
//
//@WebMvcTest(PropulsionController.class)
//public class PropulsionControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private PropulsionService propulsionService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    @DisplayName("Should register a new propulsion")
//    void testRegister() throws Exception {
//        DataRegisterPropulsion request = new DataRegisterPropulsion("Test Propulsion");
//        DataPropulsionDetails response = new DataPropulsionDetails(1L, "Test Propulsion", true);
//        given(propulsionService.register(request)).willReturn(response);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/propulsions")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(MockMvcResultMatchers.status().isCreated())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Propulsion"));
//    }
//
//    @Test
//    @DisplayName("Should list all propulsions")
//    void testListAll() throws Exception {
//        DataPropulsionDetails propulsion = new DataPropulsionDetails(1L, "Test Propulsion", true);
//        Page<DataPropulsionDetails> page = new PageImpl<>(Collections.singletonList(propulsion), PageRequest.of(0, 10), 1);
//        given(propulsionService.listAll(PageRequest.of(0, 10))).willReturn(page);
//
//        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/propulsions")
//                        .param("page", "0")
//                        .param("size", "10"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id").value(1L))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").value("Test Propulsion"));
//    }
//
//    @Test
//    @DisplayName("Should get propulsion by ID")
//    void testGetById() throws Exception {
//        DataPropulsionDetails response = new DataPropulsionDetails(1L, "Test Propulsion", true);
//        given(propulsionService.getById(1L)).willReturn(response);
//
//        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/propulsions/1"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Propulsion"));
//    }
//
//    @Test
//    @DisplayName("Should update a propulsion")
//    void testUpdate() throws Exception {
//        DataUpdatePropulsion request = new DataUpdatePropulsion("Updated Propulsion");
//        DataPropulsionDetails response = new DataPropulsionDetails(1L, "Updated Propulsion", false);
//        given(propulsionService.update(request, 1L)).willReturn(response);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/propulsions/1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Propulsion"));
//    }
//
//    @Test
//    @DisplayName("Should disable a propulsion")
//    void testDisable() throws Exception {
//        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/propulsions/1"))
//                .andExpect(MockMvcResultMatchers.status().isNoContent());
//    }
//}
