package br.com.cepedi.e_drive.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Serviço para gerenciamento de relatórios Jasper.
 * Fornece métodos para adicionar parâmetros e gerar relatórios em PDF
 * com base em arquivos JasperReports.
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class JasperService {

    private final ResourceLoader resourceLoader;
    private final DataSource dataSource;

    /**
     * Parâmetros a serem utilizados no relatório.
     */
    private Map<String, Object> params = new HashMap<>();

    /**
     * Diretório padrão onde os arquivos JasperReports estão localizados.
     */
    private static final String JASPER_DIRECTORY = "classpath:reports/";

    /**
     * Adiciona parâmetros para o relatório Jasper.
     * Inclui diretório de imagens e localização do relatório como padrão.
     *
     * @param key   Chave do parâmetro.
     * @param value Valor do parâmetro.
     */
    public void addParams(String key, Object value) {
        this.params.put("IMAGE_DIRECTORY", JASPER_DIRECTORY);
        this.params.put("REPORT_LOCALE", new Locale("pt", "BR"));
        this.params.put(key, value);
    }

    /**
     * Gera um relatório em PDF com base no nome do arquivo Jasper fornecido.
     *
     * @param reportName Nome do arquivo Jasper a ser utilizado.
     * @return Um array de bytes representando o conteúdo do relatório PDF.
     */
    public byte[] gerarPdf(String reportName) {
        byte[] bytes = null;
        try {
            Resource resource = resourceLoader.getResource(JASPER_DIRECTORY.concat(reportName));
            InputStream stream = resource.getInputStream();
            JasperPrint jasperPrint = JasperFillManager.fillReport(stream, params, dataSource.getConnection());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException | SQLException e) {
            log.error("Erro ao gerar relatório Jasper Reports: ", e.getCause());
            throw new RuntimeException(e);
        }
        return bytes;
    }
}

