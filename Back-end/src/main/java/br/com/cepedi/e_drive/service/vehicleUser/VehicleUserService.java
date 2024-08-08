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

    public DataVehicleUserDetails register(DataRegisterVehicleUser data) {
        validationRegisterVehicleUserList.forEach(v -> v.validate(data));
        User user = userRepository.getReferenceById(data.userId());
        Vehicle vehicle = vehicleRepository.getReferenceById(data.vehicleId());
        VehicleUser vehicleUser = new VehicleUser(user, vehicle, data.dataRegisterAutonomy());
        vehicleUser = vehicleUserRepository.save(vehicleUser);
        return new DataVehicleUserDetails(vehicleUser);
    }

    public Page<DataVehicleUserDetails> getAllVehicleUsersActivated(Pageable pageable) {
        return vehicleUserRepository.findAllActivated(pageable).map(DataVehicleUserDetails::new);
    }

    public Page<DataVehicleUserDetails> getVehicleUsersByUser(Long userId, Pageable pageable) {
        return vehicleUserRepository.findByUserId(userId, pageable).map(DataVehicleUserDetails::new);
    }

    public Page<DataVehicleUserDetails> getVehicleUsersByVehicle(Long vehicleId, Pageable pageable) {
        return vehicleUserRepository.findByVehicleId(vehicleId, pageable).map(DataVehicleUserDetails::new);
    }

    public DataVehicleUserDetails updateVehicleUser(DataUpdateVehicleUser data, Long id) {
        validationUpdateVehicleUserList.forEach(v -> v.validate(id));
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.updateData(data.dataUpdateAutonomy());
        vehicleUserRepository.save(vehicleUser);
        return new DataVehicleUserDetails(vehicleUser);
    }

    public void disableVehicleUser(Long id) {
        validationDisabledVehicleUsers.forEach(v -> v.validate(id));
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.disable();
        vehicleUserRepository.save(vehicleUser);
    }

    public void enableVehicleUser(Long id) {
        VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
        vehicleUser.enable();
        vehicleUserRepository.save(vehicleUser);
    }
}
