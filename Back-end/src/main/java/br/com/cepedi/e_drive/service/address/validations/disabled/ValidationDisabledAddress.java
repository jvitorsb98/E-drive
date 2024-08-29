package br.com.cepedi.e_drive.service.address.validations.disabled;

/**
 * Interface que define o contrato para a validação de desativação de um endereço.
 *
 * <p>Implementações desta interface devem fornecer a lógica necessária para validar a desativação de um endereço,
 * garantindo que as regras de negócio específicas sejam respeitadas antes que a operação de desativação seja realizada.</p>
 */
public interface ValidationDisabledAddress {

    /**
     * Valida a desativação de um endereço com base no seu identificador único.
     *
     * @param id O identificador único do endereço a ser desativado.
     * @throws IllegalArgumentException se a validação falhar ou se o endereço não puder ser desativado.
     */
    void validate(Long id);

}
