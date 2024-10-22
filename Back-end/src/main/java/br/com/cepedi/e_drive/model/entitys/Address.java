package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa um endereço no sistema. Esta entidade é mapeada para a tabela "address" no banco de dados.
 * Contém informações sobre o país, código postal, estado, cidade, bairro, número, rua, complemento,
 * usuário associado, plugin, e se o endereço está ativado ou não.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "address")
public class Address {

    /**
     * Identificador único do endereço. Gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome do país do endereço. Este campo é obrigatório.
     */
    @Column(name = "country", nullable = false)
    private String country;

    /**
     * Código postal do endereço. Este campo é obrigatório.
     */
    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    /**
     * Nome do estado do endereço. Este campo é obrigatório.
     */
    @Column(name = "state", nullable = false)
    private String state;

    /**
     * Nome da cidade do endereço. Este campo é obrigatório.
     */
    @Column(name = "city", nullable = false)
    private String city;

    /**
     * Nome do bairro do endereço. Este campo é obrigatório.
     */
    @Column(name = "neighborhood", nullable = false)
    private String neighborhood;

    /**
     * Número do endereço. Este campo é obrigatório.
     */
    @Column(name = "number", nullable = false)
    private Integer number;

    /**
     * Nome da rua do endereço. Este campo é obrigatório.
     */
    @Column(name = "street", nullable = false)
    private String street;

    /**
     * Usuário associado ao endereço. Este campo é obrigatório.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Indica se o endereço é um plugin. Este campo é obrigatório.
     */
    @Column(name = "plugin", nullable = false)
    private Boolean plugin;

    /**
     * Complemento do endereço. Este campo é opcional.
     */
    @Column(name = "complement")
    private String complement;

    /**
     * Indica se o endereço está ativado. Este campo é obrigatório.
     */
    @Column(name = "activated", nullable = false)
    private Boolean activated;

    /**
     * Construtor que cria uma nova instância de Address com base nos dados fornecidos em {@link DataRegisterAddress}
     * e associa o endereço a um usuário específico.
     *
     * @param dataRegisterAddress Objeto contendo os dados para registrar um novo endereço.
     * @param user                Usuário ao qual o endereço está associado.
     */
    public Address(DataRegisterAddress dataRegisterAddress, User user) {
        System.out.println("USER" + user.getId());
        this.country = dataRegisterAddress.country();
        this.zipCode = dataRegisterAddress.zipCode();
        this.state = dataRegisterAddress.state();
        this.city = dataRegisterAddress.city();
        this.neighborhood = dataRegisterAddress.neighborhood();
        this.number = dataRegisterAddress.number();
        this.street = dataRegisterAddress.street();
        this.complement = dataRegisterAddress.complement();
        this.user = user;
        this.plugin = dataRegisterAddress.plugin() != null ? dataRegisterAddress.plugin() : false;
        this.activated = true;
    }

    /**
     * Atualiza os dados do endereço com base nas informações fornecidas em {@link DataUpdateAddress}.
     *
     * @param data Objeto contendo os dados atualizados do endereço.
     */
    public void updateData(DataUpdateAddress data) {
        if (data.country() != null) {
            this.country = data.country();
        }
        if (data.zipCode() != null) {
            this.zipCode = data.zipCode();
        }
        if (data.state() != null) {
            this.state = data.state();
        }
        if (data.city() != null) {
            this.city = data.city();
        }
        if (data.neighborhood() != null) {
            this.neighborhood = data.neighborhood();
        }
        if (data.number() != null) {
            this.number = data.number();
        }
        if (data.street() != null) {
            this.street = data.street();
        }
        if (data.plugin() != null) {
            this.plugin = data.plugin();
        }
        if (data.complement() != null) {
            this.complement = data.complement();
        }
    }

    /**
     * Ativa o endereço, definindo o campo {@code activated} como {@code true}.
     */
    public void enable() {
        this.activated = true;
    }

    /**
     * Desativa o endereço, definindo o campo {@code activated} como {@code false}.
     */
    public void disable() {
        this.activated = false;
    }
}
