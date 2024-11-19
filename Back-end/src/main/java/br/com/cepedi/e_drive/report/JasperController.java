package br.com.cepedi.e_drive.report;

import br.com.cepedi.e_drive.report.JasperService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Report", description = "Report management operations")
public class JasperController {

    @Autowired
    private JasperService jasperService;

    @GetMapping("/most-registered-cars")
    public ResponseEntity<Void> getMostRegisteredCarsReport(HttpServletResponse response) throws IOException {
        byte[] bytes = jasperService.gerarPdf("most_registered_cars.jasper");
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader("Content-Disposition", "inline; filename=" + System.currentTimeMillis() + ".pdf");
        response.getOutputStream().write(bytes);

        return ResponseEntity.ok().build();
    }
}
