package br.com.cepedi.e_drive.service.vehicle;

import br.com.cepedi.e_drive.model.entitys.*;
import br.com.cepedi.e_drive.model.records.vehicle.details.DataVehicleDetails;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.*;
import br.com.cepedi.e_drive.service.vehicle.validations.disabled.ValidationDisabledVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.register.ValidationRegisterVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.update.ValidationUpdateVehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private AutonomyRepository autonomyRepository;

    @Autowired
    private List<ValidationRegisterVehicle> validationRegisterVehicleList;

    @Autowired
    private List<ValidationUpdateVehicle> validationUpdateVehicleList;

    @Autowired
    private List<ValidationDisabledVehicle> validationDisabledVehicleList;

    public DataVehicleDetails register(DataRegisterVehicle data) {
        validationRegisterVehicleList.forEach(v -> v.validate(data));
        Model model = modelRepository.getReferenceById(data.modelId());
        Category category = categoryRepository.getReferenceById(data.categoryId());
        Propulsion propulsion = propulsionRepository.getReferenceById(data.propulsionId());
        VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.typeId());
        Autonomy autonomy = new Autonomy(data.dataRegisterAutonomy());
        autonomy = autonomyRepository.save(autonomy);
        Vehicle vehicle = new Vehicle(data.motor(), data.version(), model, category, vehicleType, propulsion, autonomy, data.year());
        vehicle = vehicleRepository.save(vehicle);
        return new DataVehicleDetails(vehicle);
    }

    public Page<DataVehicleDetails> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByCategory(Long categoryId, Pageable pageable) {
        return vehicleRepository.findByCategoryId(categoryId, pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByModel(Long modelId, Pageable pageable) {
        return vehicleRepository.findByModelId(modelId, pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByType(Long typeId, Pageable pageable) {
        return vehicleRepository.findByTypeId(typeId, pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByBrand(Long brandId, Pageable pageable) {
        return vehicleRepository.findByBrandId(brandId, pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByPropulsion(Long propulsionId, Pageable pageable) {
        return vehicleRepository.findByPropulsionId(propulsionId, pageable).map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> getVehiclesByAutonomy(Long autonomyId, Pageable pageable) {
        return vehicleRepository.findByAutonomyId(autonomyId, pageable).map(DataVehicleDetails::new);
    }

    public DataVehicleDetails updateVehicle(DataUpdateVehicle data, Long id) {
        validationUpdateVehicleList.forEach(v -> v.validate(data));
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        Category category = data.categoryId() != null ? categoryRepository.getReferenceById(data.categoryId()) : null;
        Propulsion propulsion = data.propulsionId() != null ? propulsionRepository.getReferenceById(data.propulsionId()) : null;
        VehicleType vehicleType = data.typeId() != null ? vehicleTypeRepository.getReferenceById(data.typeId()) : null;
        Model model = data.modelId() != null ? modelRepository.getReferenceById(data.modelId()) : null;
        vehicle.updateDataVehicle(data, model, category, vehicleType, propulsion);
        vehicleRepository.save(vehicle);
        return new DataVehicleDetails(vehicle);
    }

    public void disableVehicle(Long id) {
        validationDisabledVehicleList.forEach(v -> v.validate(id));
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        vehicle.disable();
        vehicleRepository.save(vehicle);
    }

    public void enableVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        vehicle.enable();
        vehicleRepository.save(vehicle);
    }


}
