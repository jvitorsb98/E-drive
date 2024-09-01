package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de persistência e recuperação de entidades {@link User}.
 * <p>
 * Esta interface fornece métodos para interagir com a tabela "users" no banco de dados,
 * incluindo a recuperação de usuários com base no email e a verificação da existência de um email.
 * </p>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Recupera um {@link User} com base no email fornecido.
     *
     * @param email O email do usuário.
     * @return O {@link User} correspondente ao email fornecido.
     *         Se nenhum usuário for encontrado com o email especificado, retorna {@code null}.
     */
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(@Param("email") String email);

    /**
     * Verifica se um usuário com o email fornecido existe.
     *
     * @param email O email do usuário.
     * @return {@code true} se um usuário com o email fornecido existir, {@code false} caso contrário.
     */
    boolean existsByEmail(String email);
}
