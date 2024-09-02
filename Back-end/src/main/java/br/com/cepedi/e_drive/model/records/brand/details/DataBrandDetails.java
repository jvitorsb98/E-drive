package br.com.cepedi.e_drive.model.records.brand.details;

import br.com.cepedi.e_drive.model.entitys.Brand;

/**
 * Record que encapsula os detalhes de uma marca.
 * Utilizado para transferir dados detalhados sobre uma marca específica.
 *
 * @param id        Identificador único da marca. Pode ser nulo.
 * @param name      Nome da marca. Pode ser nulo.
 * @param activated Indicador se a marca está ativada ou não. Pode ser nulo.
 */
public record DataBrandDetails(

        Long id,

        String name,

        Boolean activated

) {
    /**
     * Construtor que cria uma instância de {@code DataBrandDetails} com base em um objeto {@link Brand}.
     *
     * @param brand Instância de {@link Brand} a partir da qual os detalhes da marca serão extraídos.
     */
    public DataBrandDetails(Brand brand) {
        this(
                brand.getId(),
                brand.getName(),
                brand.getActivated()
        );
    }
}
