package br.com.cepedi.e_drive.service.vehicleUser;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.model.records.vehicleUser.details.DataVehicleUserDetails;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.model.records.vehicleUser.update.DataUpdateVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.vehicleUser.validations.disabled.ValidationDisabledVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.validations.register.ValidationRegisterVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.validations.update.ValidationUpdateVehicleUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciar operações relacionadas a {@link VehicleUser}.
 * <p>
 * Esta classe fornece métodos para registrar, atualizar, habilitar e desabilitar usuários de veículos, bem como
 * recuperar informações sobre eles com base em diferentes critérios.
 * </p>
 */
@Service
public class VehicleUserService {

    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private List<ValidationRegisterVehicleUser> validationRegisterVehicleUserList;

    @Autowired
    private List<ValidationUpdateVehicleUser> validationUpdateVehicleUserList;

    @Autowired
    private List<ValidationDisabledVehicleUser> validationDisabledVehicleUsers;

    /**
     * Registra um novo usuário de veículo.
     * <p>
     * Valida os dados do registro, busca o usuário e o veículo associados, e salva o novo usuário de veículo no repositório.
     * </p>
     *
     * @param data  Dados de registro do usuário de veículo.
     * @param email Email do usuário associado.
     * @return Detalhes do usuário de veículo registrado.
     */
    public DataVehicleUserDetails register(DataRegisterVehicleUser data, String email) {
        validationRegisterVehicleUserList.forEach(v -> v.validate(data));
        User user = userRepository.findByEmail(email);
        Vehicle vehicle = vehicleRepository.getReferenceById(data.vehicleId());
        VehicleUser vehicleUser = new VehicleUser(user, vehicle, data.dataRegisterAutonomy());
        vehicleUser = vehicleUserRepository.save(vehicleUser);
        return new DataVehicleUserDetails(vehicleUser);
    }

    /**
     * Recupera todos os usuários de veículos ativados com paginação.
     *
     * @param pageable Informações de paginação.
     * @return Página de detalhes de usuários de veículos ativados.
     */
    public Page<DataVehicleUserDetails> getAllVehicleUsersActivated(Pageable pageable) {
        return vehicleUserRepository.findAllActivated(pageable).map(DataVehicleUserDetails::new);
    }

    /**
     * Recupera usuários de veículos associados a um usuário específico com base no email, com paginação.
     *
     * @param email   Email do usuário associado.
     * @param pageable Informações de paginação.
     * @return Página de detalhes de usuários de veículos associados ao usuário.
     */
    public Page<DataVehicleUserDetails> getVehicleUsersByUser(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email);
        return vehicleUserRepository.findByUserId(user.getId(), pageable).map(DataVehicleUserDetails::new);
    }

    /**
     * Recupera usuários de veículos associados a um veículo específico com base no ID do veículo, com paginação.
     *
     * @param vehicleId ID do veículo associado.
     * @param pageable  Informações de paginação.
     * @return Página de detalhes de usuários de veículos associados ao veículo.
     */
    public Page<DataVehicleUserDetails> getVehicleUsersByVehicle(Long vehicleId, Pageable pageable) {
        return vehicleUserRepository.findByVehicleId(vehicleId, pageable).map(DataVehicleUserDetails::new);
    }

    /**
     * Atualiza os dados de um usuário de veículo existente.
     * <p>
     * Valida o ID do usuário de veículo, atualiza os dados e salva as alterações no repositório.
     * </p>
     *
     * @param data Dados de atualização do usuário de veículo.
     * @param id   ID do usuário de veículo a ser atualizado.
     * @return Detalhes do usuário de veículo atualizado.
     */
    public DataVehicleUserDetails updateVehicleUser(DataUpdateVehicleUser data, Long id) {
        validationUpdateVehicleUserList.forEach(v -> v.validate(id));
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.updateData(data.dataUpdateAutonomy());
        vehicleUserRepository.save(vehicleUser);
        return new DataVehicleUserDetails(vehicleUser);
    }

    /**
     * Desabilita um usuário de veículo.
     * <p>
     * Valida o ID do usuário de veículo e desabilita o usuário no repositório.
     * </p>
     *
     * @param id ID do usuário de veículo a ser desabilitado.
     */
    public void disableVehicleUser(Long id) {
        validationDisabledVehicleUsers.forEach(v -> v.validate(id));
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.disable();
        vehicleUserRepository.save(vehicleUser);
    }

    /**
     * Habilita um usuário de veículo.
     * <p>
     * Habilita o usuário de veículo no repositório.
     * </p>
     *
     * @param id ID do usuário de veículo a ser habilitado.
     */
    public void enableVehicleUser(Long id) {
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.enable();
        vehicleUserRepository.save(vehicleUser);
    }
}
