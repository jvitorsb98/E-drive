package br.com.cepedi.e_drive.security.service.user;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.token.TokenService;
import br.com.cepedi.e_drive.security.service.user.validations.update.UserValidationUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável pela gestão de usuários.
 * <p>
 * Este serviço fornece métodos para buscar, atualizar e gerenciar usuários no sistema.
 * Inclui operações para buscar um usuário por e-mail, atualizar senhas e validar atualizações de usuário.
 * </p>
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private List<UserValidationUpdate> userValidationUpdateList;

    /**
     * Busca um usuário ativado pelo e-mail.
     *
     * @param email O e-mail do usuário a ser buscado.
     * @return O usuário correspondente ao e-mail fornecido.
     */
    public User getUserActivatedByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    /**
     * Busca um usuário desatativado pelo e-mail.
     *
     * @param email O e-mail do usuário a ser buscado.
     * @return O usuário correspondente ao e-mail fornecido.
     */
    public User getUserDesctivatedByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Atualiza a senha de um usuário.
     * <p>
     * O método codifica a nova senha antes de salvá-la no banco de dados.
     * </p>
     *
     * @param email O e-mail do usuário cuja senha será atualizada.
     * @param newPassword A nova senha para o usuário.
     * @throws RuntimeException Se o usuário com o e-mail fornecido não for encontrado.
     */
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.saveAndFlush(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    /**
     * Verifica se um usuário existe pelo e-mail.
     *
     * @param email O e-mail do usuário a ser verificado.
     * @return {@code true} se um usuário com o e-mail fornecido existir, {@code false} caso contrário.
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Obtém os detalhes do usuário pelo e-mail.
     *
     * @param email O e-mail do usuário cujos detalhes serão obtidos.
     * @return Os detalhes do usuário correspondentes ao e-mail fornecido.
     */
    public DataDetailsUser getDetailsUserByEmail(String email){
        return new DataDetailsUser(userRepository.findByEmail(email));
    }

    /**
     * Atualiza as informações do usuário.
     * <p>
     * Realiza a validação dos dados de atualização antes de aplicar as mudanças ao usuário.
     * </p>
     *
     * @param data Os dados de atualização do usuário.
     * @param userDetails Os detalhes do usuário autenticado.
     * @return Os detalhes atualizados do usuário.
     * @throws RuntimeException Se o usuário não for encontrado.
     */
    public DataDetailsUser updateUser(DataUpdateUser data, UserDetails userDetails) {
        String email = userDetails.getUsername();
        userValidationUpdateList.forEach(v -> v.validate(data, email));
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.update(data);
        return new DataDetailsUser(user);
    }

    public User getUserByToken(String token) {
        String tokenWithoutBearer = token.replace("Bearer ", "");
        String email = tokenService.getEmailByToken(tokenWithoutBearer);

        return userRepository.findByEmail(email);
    }
}
