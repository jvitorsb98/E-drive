//package br.com.cepedi.e_drive.controller.brand;
//
//import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
//import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
//import br.com.cepedi.e_drive.service.brand.BrandService;
//import jakarta.transaction.Transactional;
//import jakarta.validation.Valid;
//import org.hibernate.annotations.Parameter;
//import org.slf4j.LoggerFactory;
//import org.slf4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.util.UriComponentsBuilder;
//
//import java.net.URI;
//
//
////import io.swagger.v3.oas.annotations.security.SecurityRequirement;
////import io.swagger.v3.oas.annotations.tags.Tag;
//
//@RestController
//@RequestMapping("/api/v2/brands")
////@SecurityRequirement(name = "bearer-key")
////@Tag(name = "Brand", description = "Brand messages")
//public class BrandController {
//
//    private static final Logger LOGGER = LoggerFactory.getLogger(BrandController.class);
//
//    @Autowired
//    private BrandService brandService;
//
//    @PostMapping
//    @Transactional
//
//    public ResponseEntity<DataBrandDetails> register(
//            @Parameter(description = "Data required to register a brand", required = true)
//            @Valid @RequestBody
//            DataRegisterBrand data,
//            UriComponentsBuilder uriBuilder
//    ) {
//        LOGGER.info("Registering a brand");
//        DataBrandDetails brandDetails = brandService.register(data);
//        URI uri = uriBuilder.path("/brands/{id}").buildAndExpand(brandDetails.id()).toUri();
//        LOGGER.info("Brand registered successfully");
//        return ResponseEntity.created(uri).body(brandDetails);
//    }
//
//}
