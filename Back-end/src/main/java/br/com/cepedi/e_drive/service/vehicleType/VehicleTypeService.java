package br.com.cepedi.e_drive.service.vehicleType;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import br.com.cepedi.e_drive.service.vehicleType.validations.activated.ValidationVehicleTypeActivated;
import br.com.cepedi.e_drive.service.vehicleType.validations.disabled.VehicleTypeValidatorDisabled;
import br.com.cepedi.e_drive.service.vehicleType.validations.update.ValidationVehicleTypeUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleTypeService {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private List<ValidationVehicleTypeUpdate> vehicleTypeValidationUpdateList;

    @Autowired
    private List<ValidationVehicleTypeActivated> vehicleTypeValidatorActivatedList;

    @Autowired
    private List<VehicleTypeValidatorDisabled> vehicleTypeValidatorDisabledList;

    public DataVehicleTypeDetails register(DataRegisterVehicleType data) {
        VehicleType vehicleType = new VehicleType(data);
        vehicleType = vehicleTypeRepository.save(vehicleType);
        return new DataVehicleTypeDetails(vehicleType);
    }

    public DataVehicleTypeDetails update(DataUpdateVehicleType data) {
        vehicleTypeValidationUpdateList.forEach(v -> v.validation(data));
        VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.id());
        vehicleType.updateDataVehicleType(data);
        return new DataVehicleTypeDetails(vehicleType);
    }

    public DataVehicleTypeDetails getVehicleTypeById(Long id) {
        VehicleType vehicleType = vehicleTypeRepository.findById(id).orElseThrow(() -> new RuntimeException("VehicleType not found"));
        return new DataVehicleTypeDetails(vehicleType);
    }

    public Page<DataVehicleTypeDetails> listAllVehicleTypes(Pageable pageable) {
        return vehicleTypeRepository.findAll(pageable).map(DataVehicleTypeDetails::new);
    }

    public void activated(Long id) {
        vehicleTypeValidatorActivatedList.forEach(v -> v.validation(id));
        VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
        vehicleType.activated();
    }

    public Page<DataVehicleTypeDetails> listAllVehicleTypesActivatedTrue(Pageable pageable) {
        return vehicleTypeRepository.findAllByActivatedTrue(pageable).map(DataVehicleTypeDetails::new);
    }

    public void disabled(Long id) {
        vehicleTypeValidatorDisabledList.forEach(v -> v.validation(id));
        VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
        vehicleType.disabled();
    }

}
