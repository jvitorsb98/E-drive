package br.com.cepedi.e_drive.security.model.records.details;

/**
 * Representa um record que contém um token JWT.
 * <p>
 * Este record é utilizado para encapsular um token JWT em uma única propriedade.
 * </p>
 *
 * @param token O token JWT.
 */
public record DadosTokenJWT (

        String token

) {
}
