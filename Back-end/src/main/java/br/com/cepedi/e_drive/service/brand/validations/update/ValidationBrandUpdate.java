package br.com.cepedi.e_drive.service.brand.validations.update;

/**
 * Interface para validação de marcas antes de realizar operações de atualização.
 * Define um método para validar se a marca com o ID fornecido atende aos critérios necessários.
 */
public interface ValidationBrandUpdate {

    /**
     * Valida a marca com o ID fornecido.
     * Implementações devem verificar se a marca atende aos critérios para atualização.
     *
     * @param id O ID da marca a ser validada.
     * @throws ValidationException se a marca não atender aos critérios de validação.
     */
    void validation(Long id);
}
