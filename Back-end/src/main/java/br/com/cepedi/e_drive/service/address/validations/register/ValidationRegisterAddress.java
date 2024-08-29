package br.com.cepedi.e_drive.service.address.validations.register;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;

/**
 * Interface que define o contrato para validações no processo de registro de um endereço.
 *
 * <p>Implementações desta interface são responsáveis por validar os dados de um novo endereço antes de seu registro no sistema.</p>
 */
public interface ValidationRegisterAddress {

    /**
     * Realiza a validação dos dados fornecidos para o registro de um novo endereço.
     *
     * <p>Este método deve ser implementado para verificar se os dados do endereço atendem aos critérios necessários para serem aceitos pelo sistema.
     * Se os dados não forem válidos, o método pode lançar exceções ou retornar erros apropriados.</p>
     *
     * @param data Os dados do endereço a serem validados.
     */
    void validate(DataRegisterAddress data);

}
