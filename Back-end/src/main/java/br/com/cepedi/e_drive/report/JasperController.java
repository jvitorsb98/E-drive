package br.com.cepedi.e_drive.report;


import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import br.com.cepedi.e_drive.report.JasperService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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

/**
 * Controlador para gerenciamento de relatórios Jasper.
 * <p>
 * Esta classe fornece endpoints para a geração de relatórios em PDF.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Report", description = "Report management operations")
public class JasperController {

    @Autowired
    private JasperService jasperService;

    /**
     * Gera um relatório PDF dos carros mais registrados.
     * <p>
     * O relatório gerado é retornado no corpo da resposta como um arquivo PDF.
     * </p>
     *
     * @param response Objeto {@link HttpServletResponse} para configurar a resposta HTTP.
     * @return Resposta HTTP com o relatório PDF no corpo.
     * @throws IOException Se ocorrer algum erro ao escrever os bytes no fluxo de saída.
     */
    @GetMapping("/most-registered-cars")
    @Operation(summary = "Generate report of most registered cars", method = "GET",
            description = "Generates a PDF report of the most registered cars.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report generated successfully",
                    content = @Content(mediaType = "application/pdf")),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> getMostRegisteredCarsReport(
            @Parameter(description = "HTTP response object to configure the response")
            HttpServletResponse response) throws IOException {
        byte[] bytes = jasperService.gerarPdf("most_registered_cars.jasper");
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader("Content-Disposition", "inline; filename=" + System.currentTimeMillis() + ".pdf");
        response.getOutputStream().write(bytes);

        return ResponseEntity.ok().build();
    }
}

