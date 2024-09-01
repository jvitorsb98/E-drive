package br.com.cepedi.e_drive.security.repository;

import br.com.cepedi.e_drive.security.model.entitys.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de persistência e recuperação de entidades {@link Token}.
 * <p>
 * Esta interface fornece métodos para interagir com a tabela "tokens" no banco de dados,
 * incluindo a recuperação de tokens com base no valor do token.
 * </p>
 */
@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    /**
     * Recupera um {@link Token} com base no valor do token fornecido.
     *
     * @param token O valor do token.
     * @return Um {@link Optional} contendo o {@link Token} se encontrado, ou vazio se não encontrado.
     */
    Optional<Token> findByToken(String token);
}
