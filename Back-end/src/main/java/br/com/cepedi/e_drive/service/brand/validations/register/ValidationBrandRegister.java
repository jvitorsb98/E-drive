package br.com.cepedi.e_drive.service.brand.validations.register;

import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;

/**
 * Interface para validações de registro de marcas.
 * <p>
 * Implementações dessa interface definem regras de validação que devem ser aplicadas durante o processo de registro de uma marca.
 */
public interface ValidationBrandRegister {

    /**
     * Método de validação que aplica regras específicas ao registro de uma marca.
     * <p>
     * Este método é responsável por verificar condições específicas, como a duplicidade de dados ou a integridade das informações da marca,
     * e lançar exceções apropriadas em caso de violação das regras de negócio.
     *
     * @param dataRegisterBrand Os dados da marca que está sendo registrada.
     * @throws RuntimeException Se alguma regra de validação for violada.
     */
    void validation(DataRegisterBrand dataRegisterBrand);
}
