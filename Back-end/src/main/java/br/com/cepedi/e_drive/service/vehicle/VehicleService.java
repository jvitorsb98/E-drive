package br.com.cepedi.e_drive.service.vehicle;

import br.com.cepedi.e_drive.model.entitys.*;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.vehicle.details.DataVehicleDetails;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.*;
import br.com.cepedi.e_drive.service.vehicle.validations.disabled.ValidationDisabledVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.register.ValidationRegisterVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.update.ValidationUpdateVehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciar operações relacionadas a veículos.
 * Inclui registro, atualização, desativação, ativação e recuperação de veículos.
 */
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

    /**
     * Registra um novo veículo.
     * Valida os dados de registro, cria e salva um novo veículo.
     *
     * @param data Dados do veículo a serem registrados.
     * @return Detalhes do veículo registrado.
     */
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

    /**
     * Recupera todos os veículos com paginação.
     *
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera um veículo pelo ID.
     * Resultados são armazenados em cache.
     *
     * @param id ID do veículo.
     * @return Detalhes do veículo.
     * @throws RuntimeException Se o veículo não for encontrado.
     */
    @Cacheable(value = "vehicleById", key = "#id")
    public DataVehicleDetails getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado com ID: " + id));
        return new DataVehicleDetails(vehicle);
    }

    /**
     * Recupera veículos por ID da categoria com paginação.
     *
     * @param categoryId ID da categoria.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByCategory(Long categoryId, Pageable pageable) {
        return vehicleRepository.findByCategoryId(categoryId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera veículos por ID do modelo com paginação.
     *
     * @param modelId ID do modelo.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByModel(Long modelId, Pageable pageable) {
        return vehicleRepository.findByModelId(modelId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera veículos por ID do tipo com paginação.
     *
     * @param typeId ID do tipo.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByType(Long typeId, Pageable pageable) {
        return vehicleRepository.findByTypeId(typeId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera veículos por ID da marca com paginação.
     *
     * @param brandId ID da marca.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByBrand(Long brandId, Pageable pageable) {
        return vehicleRepository.findByBrandId(brandId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera veículos por ID da propulsão com paginação.
     *
     * @param propulsionId ID da propulsão.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByPropulsion(Long propulsionId, Pageable pageable) {
        return vehicleRepository.findByPropulsionId(propulsionId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Recupera veículos por ID da autonomia com paginação.
     *
     * @param autonomyId ID da autonomia.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos veículos.
     */
    public Page<DataVehicleDetails> getVehiclesByAutonomy(Long autonomyId, Pageable pageable) {
        return vehicleRepository.findByAutonomyId(autonomyId, pageable).map(DataVehicleDetails::new);
    }

    /**
     * Atualiza os dados de um veículo existente.
     * Valida os dados de atualização, atualiza e salva o veículo.
     *
     * @param data Dados de atualização do veículo.
     * @param id ID do veículo a ser atualizado.
     * @return Detalhes do veículo atualizado.
     */
    public DataVehicleDetails updateVehicle(DataUpdateVehicle data, Long id) {
        validationUpdateVehicleList.forEach(v -> v.validate(data,id));
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        Autonomy autonomy = autonomyRepository.getReferenceById(vehicle.getAutonomy().getId());
        Category category = data.categoryId() != null ? categoryRepository.getReferenceById(data.categoryId()) : null;
        Propulsion propulsion = data.propulsionId() != null ? propulsionRepository.getReferenceById(data.propulsionId()) : null;
        VehicleType vehicleType = data.typeId() != null ? vehicleTypeRepository.getReferenceById(data.typeId()) : null;
        Model model = data.modelId() != null ? modelRepository.getReferenceById(data.modelId()) : null;
        vehicle.updateDataVehicle(data, model, category, vehicleType, propulsion);
        autonomy.updateAutonomy(data.dataRegisterAutonomy());
        autonomyRepository.save(autonomy);
        vehicleRepository.save(vehicle);
        return new DataVehicleDetails(vehicle);
    }

    /**
     * Desativa um veículo existente.
     * Valida o veículo antes de desativá-lo.
     *
     * @param id ID do veículo a ser desativado.
     */
    public void disableVehicle(Long id) {
        validationDisabledVehicleList.forEach(v -> v.validate(id));
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        vehicle.disable();
        vehicleRepository.save(vehicle);
    }

    /**
     * Ativa um veículo existente.
     *
     * @param id ID do veículo a ser ativado.
     */
    public void enableVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.getReferenceById(id);
        vehicle.enable();
        vehicleRepository.save(vehicle);
    }

    /**
     * Obtém a lista de validações de atualização de veículo.
     *
     * @return Lista de validações de atualização de veículo.
     */
    public List<ValidationUpdateVehicle> getValidationUpdateVehicleList() {
        return validationUpdateVehicleList;
    }

    /**
     * Define a lista de validações de atualização de veículo.
     *
     * @param validationUpdateVehicleList Lista de validações de atualização de veículo.
     */
    public void setValidationUpdateVehicleList(List<ValidationUpdateVehicle> validationUpdateVehicleList) {
        this.validationUpdateVehicleList = validationUpdateVehicleList;
    }

    /**
     * Busca uma página de veículos filtrados pela versão e armazena em cache o resultado.
     * O cache é identificado pela chave gerada a partir da versão do veículo e o número da página.
     *
     * @param version A versão do veículo a ser filtrada.
     * @param pageable Objeto de paginação que define o tamanho da página, número da página e ordenação.
     * @return Um objeto {@code Page<DataVehicleDetails>} contendo os detalhes dos veículos correspondentes à versão fornecida.
     */
    @Cacheable(value = "vehicleByVersion", key = "#version + '-' + #pageable.pageNumber")
    public Page<DataVehicleDetails> getVehiclesByVersion(String version, Pageable pageable) {
        return vehicleRepository.findByVersion(version, pageable)
                .map(DataVehicleDetails::new);
    }

    public Page<DataVehicleDetails> findByActivated(Boolean activated, Pageable pageable) {
        if (activated) {
            return vehicleRepository.findByActivatedTrue(pageable).map(DataVehicleDetails::new);
        } else {
            return vehicleRepository.findByActivatedFalse(pageable).map(DataVehicleDetails::new);
        }
    }

}
