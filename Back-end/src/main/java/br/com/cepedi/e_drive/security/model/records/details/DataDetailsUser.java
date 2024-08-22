package br.com.cepedi.e_drive.security.model.records.details;

import br.com.cepedi.e_drive.security.model.entitys.Role;
import br.com.cepedi.e_drive.security.model.entitys.User;

import java.time.LocalDate;
import java.util.Set;

public record DataDetailsUser(
        Long id,
        String email,
        String name,
        LocalDate birth, // Incluindo o campo de data de nascimento
        String cellPhone, // Incluindo o campo de telefone celular
        Boolean activated, // Incluindo o campo de ativação
        Set<Role> roles // Incluindo as roles do usuário
) {
    public DataDetailsUser(User user) {
        this(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getBirth(), // Mapeando o campo de data de nascimento
                user.getCellphone(), // Mapeando o campo de telefone celular
                user.getActivated(), // Mapeando o campo de ativação
                user.getRoles() // Mapeando as roles do usuário
        );
    }
}
