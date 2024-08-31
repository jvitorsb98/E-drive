package br.com.cepedi.e_drive.security.model.records.update;

import java.time.LocalDate;

public record DataUpdateUser(
        String name,
        String cellPhone,
        LocalDate birth
) {
}