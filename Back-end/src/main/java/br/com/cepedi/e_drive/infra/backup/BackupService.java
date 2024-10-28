package br.com.cepedi.e_drive.infra.backup;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class BackupService {

    private final String databaseName = "e_drive";

    @Value("${POSTGRES_DATASOURCE_USER}")
    private String user;

    @Value("${POSTGRES_DATASOURCE_PASSWORD}")
    private String password;

    private final String backupDirectory = "/home/joao/Documentos/backup";

    @Scheduled(cron = "0 0 2 * * ?")
    public void performBackup() {
        try {
            // Obtém a data atual no formato "yyyy-MM-dd"
            String currentDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

            String command = String.format(
                    "pg_dump -U %s -F c --no-owner -b -v -f %s/%s_%s.backup %s",
                    user, backupDirectory, databaseName, currentDate, databaseName
            );

            ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", "export PGPASSWORD='" + password + "'; " + command);
            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            // Captura os erros
            try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = errorReader.readLine()) != null) {
                    System.err.println(line);
                }
            }

            process.waitFor();

            if (process.exitValue() == 0) {
                System.out.println("Backup realizado com sucesso.");
            } else {
                System.out.println("Erro ao realizar o backup. Código de saída: " + process.exitValue());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
