package br.com.cepedi.e_drive.infra.backup;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class BackupService {

    private final String databaseName = "e_drive";
    private final String user = "${POSTGRES_DATASOURCE_USER}";
    private final String password = "${POSTGRES_DATASOURCE_PASSWORD}";
    private final String backupDirectory = "/home/joao/Documentos/backup";

    @Scheduled(cron = "0 40 9 * * ?") // Executa diariamente às 9:40 da manhã
    public void performBackup() {
        try {
            String command = String.format(
                    "pg_dump -U %s -F c -b -v -f %s/%s.backup %s",
                    user, backupDirectory, databaseName, databaseName
            );

            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();

            if (process.exitValue() == 0) {
                System.out.println("Backup realizado com sucesso.");
            } else {
                System.out.println("Erro ao realizar o backup.");
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
