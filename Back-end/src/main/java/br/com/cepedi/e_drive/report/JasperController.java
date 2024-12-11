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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
     * Gera um relatório PDF com base no nome do arquivo Jasper fornecido.
     * <p>
     * O relatório gerado é retornado no corpo da resposta como um arquivo PDF.
     * </p>
     *
     * @param reportName Nome do arquivo Jasper sem a extensão (ex.: "most_registered_cars").
     * @param response Objeto {@link HttpServletResponse} para configurar a resposta HTTP.
     * @return Resposta HTTP com o relatório PDF no corpo.
     * @throws IOException Se ocorrer algum erro ao escrever os bytes no fluxo de saída.
     */
    @GetMapping("/generate-report")
    @Operation(summary = "Generate a report", method = "GET",
            description = "Generates a PDF report based on the provided Jasper file name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report generated successfully",
                    content = @Content(mediaType = "application/pdf")),
            @ApiResponse(responseCode = "400", description = "Invalid report name",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> generateReport(
            @RequestParam("reportName") String reportName,
            @Parameter(description = "HTTP response object to configure the response")
            HttpServletResponse response) throws IOException {

        if (reportName == null || reportName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] bytes = jasperService.gerarPdf(reportName + ".jasper");
            response.setContentType(MediaType.APPLICATION_PDF_VALUE);
            response.setHeader("Content-Disposition", "inline; filename=" + reportName + "_" + System.currentTimeMillis() + ".pdf");
            response.getOutputStream().write(bytes);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

