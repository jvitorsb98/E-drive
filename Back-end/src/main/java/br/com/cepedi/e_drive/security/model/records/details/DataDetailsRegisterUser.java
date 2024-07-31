package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.User;

import java.time.LocalDate;

public record DataDetailsRegisterUser(
        String name,
        String email,
        LocalDate birth,
        String cellphone,
        Boolean activated
) {

    public DataDetailsRegisterUser(User user) {
        this(user.getName(), user.getEmail(), user.getBirth(), user.getCellphone(), user.getActivated());
    }
}
