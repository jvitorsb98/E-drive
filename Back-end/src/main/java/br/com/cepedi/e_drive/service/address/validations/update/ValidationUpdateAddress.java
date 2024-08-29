package br.com.cepedi.e_drive.service.address.validations.update;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;

/**
 * Interface que define o contrato para validações no processo de atualização de um endereço.
 *
 * <p>Implementações desta interface são responsáveis por validar os dados antes de atualizar um endereço existente no sistema.</p>
 */
public interface ValidationUpdateAddress {

    /**
     * Realiza a validação dos dados fornecidos para a atualização de um endereço.
     *
     * <p>Este método deve ser implementado para verificar se o endereço identificado pelo ID fornecido atende aos critérios necessários para ser atualizado.
     * Se os dados não forem válidos, o método pode lançar exceções ou retornar erros apropriados.</p>
     *
     * @param id O ID do endereço a ser validado para atualização.
     */
    void validate(Long id);

}
