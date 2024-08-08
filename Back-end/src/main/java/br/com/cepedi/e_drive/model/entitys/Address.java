package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "neighborhood", nullable = false)
    private String neighborhood;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "street", nullable = false)
    private String street;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "plugin", nullable = false)
    private Boolean plugin;

    @Column(name = "activated", nullable = false)
    private Boolean activated;

    public Address(DataRegisterAddress dataRegisterAddress, User user) {
        this.country = dataRegisterAddress.country();
        this.zipCode = dataRegisterAddress.zipCode();
        this.state = dataRegisterAddress.state();
        this.city = dataRegisterAddress.city();
        this.neighborhood = dataRegisterAddress.neighborhood();
        this.number = dataRegisterAddress.number();
        this.street = dataRegisterAddress.street();
        this.user = user;
        this.plugin = dataRegisterAddress.plugin() != null ? dataRegisterAddress.plugin() : false;
        this.activated = dataRegisterAddress.activated() != null ? dataRegisterAddress.activated() : false;
    }

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
    }

    public void enable() {
        this.activated = true;
    }

    public void disable() {
        this.activated = false;
    }
}
