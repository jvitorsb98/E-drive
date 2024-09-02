package br.com.cepedi.e_drive.model.records.address.details;

import br.com.cepedi.e_drive.model.entitys.Address;

/**
 * Record que encapsula os detalhes de um endereço.
 * Utilizado para transferir dados entre camadas do sistema.
 *
 * @param id                Identificador único do endereço.
 * @param country           País do endereço.
 * @param zipCode           Código postal do endereço.
 * @param state             Estado do endereço.
 * @param city              Cidade do endereço.
 * @param neighborhood      Bairro do endereço.
 * @param number            Número do endereço.
 * @param street            Rua do endereço.
 * @param userId            Identificador do usuário associado ao endereço.
 * @param hasChargingStation Indica se o endereço possui estação de carregamento.
 * @param complement        Complemento do endereço.
 * @param activated         Indica se o endereço está ativado.
 */
public record DataAddressDetails(
        Long id,
        String country,
        String zipCode,
        String state,
        String city,
        String neighborhood,
        Integer number,
        String street,
        Long userId,
        Boolean hasChargingStation,
        String complement,
        Boolean activated
) {
    /**
     * Construtor que cria uma instância de {@code DataAddressDetails} com base em um objeto {@link Address}.
     *
     * @param address Instância de {@link Address} a partir da qual os detalhes do endereço serão extraídos.
     */
    public DataAddressDetails(Address address) {
        this(
                address.getId(),
                address.getCountry(),
                address.getZipCode(),
                address.getState(),
                address.getCity(),
                address.getNeighborhood(),
                address.getNumber(),
                address.getStreet(),
                address.getUser().getId(),
                address.getPlugin(),
                address.getComplement(),
                address.getActivated()
        );
    }
}
