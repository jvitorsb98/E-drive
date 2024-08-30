package br.com.cepedi.e_drive.service.vehicleType;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import br.com.cepedi.e_drive.service.vehicleType.validations.activated.ValidationVehicleTypeActivated;
import br.com.cepedi.e_drive.service.vehicleType.validations.disabled.VehicleTypeValidatorDisabled;
import br.com.cepedi.e_drive.service.vehicleType.validations.update.ValidationUpdateVehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciar operações relacionadas a tipos de veículos.
 * Inclui registro, atualização, ativação, desativação e listagem de tipos de veículos.
 */
@Service
public class VehicleTypeService {

	@Autowired
	private VehicleTypeRepository vehicleTypeRepository;

	@Autowired
	private List<ValidationUpdateVehicleType> vehicleTypeValidationUpdateList;

	@Autowired
	private List<ValidationVehicleTypeActivated> vehicleTypeValidatorActivatedList;

	@Autowired
	private List<VehicleTypeValidatorDisabled> vehicleTypeValidatorDisabledList;

	/**
	 * Registra um novo tipo de veículo.
	 *
	 * @param data Dados do tipo de veículo a ser registrado.
	 * @return Detalhes do tipo de veículo registrado.
	 */
	public DataVehicleTypeDetails register(DataRegisterVehicleType data) {
		VehicleType vehicleType = new VehicleType(data);
		vehicleType = vehicleTypeRepository.save(vehicleType);
		return new DataVehicleTypeDetails(vehicleType);
	}

	/**
	 * Atualiza um tipo de veículo existente.
	 *
	 * @param data Dados de atualização do tipo de veículo.
	 * @param id ID do tipo de veículo a ser atualizado.
	 * @return Detalhes do tipo de veículo atualizado.
	 * @throws RuntimeException Se o tipo de veículo não for encontrado.
	 */
	public DataVehicleTypeDetails update(DataUpdateVehicleType data, Long id) {
		vehicleTypeValidationUpdateList.forEach(v -> v.validation(id));
		VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
		vehicleType.updateDataVehicleType(data);
		return new DataVehicleTypeDetails(vehicleType);
	}

	/**
	 * Obtém os detalhes de um tipo de veículo pelo ID.
	 *
	 * @param id ID do tipo de veículo a ser obtido.
	 * @return Detalhes do tipo de veículo.
	 * @throws RuntimeException Se o tipo de veículo não for encontrado.
	 */
	public DataVehicleTypeDetails getById(Long id) {
		VehicleType vehicleType = vehicleTypeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("VehicleType not found"));
		return new DataVehicleTypeDetails(vehicleType);
	}

	/**
	 * Lista todos os tipos de veículos com paginação.
	 *
	 * @param pageable Informações de paginação.
	 * @return Página com detalhes dos tipos de veículos.
	 */
	public Page<DataVehicleTypeDetails> listAll(Pageable pageable) {
		return vehicleTypeRepository.findAll(pageable).map(DataVehicleTypeDetails::new);
	}

	/**
	 * Ativa um tipo de veículo.
	 *
	 * @param id ID do tipo de veículo a ser ativado.
	 */
	public void activated(Long id) {
		vehicleTypeValidatorActivatedList.forEach(v -> v.validation(id));
		VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
		vehicleType.activated();
	}

	/**
	 * Lista todos os tipos de veículos ativados com paginação.
	 *
	 * @param pageable Informações de paginação.
	 * @return Página com detalhes dos tipos de veículos ativados.
	 */
	public Page<DataVehicleTypeDetails> listAllActivated(Pageable pageable) {
		return vehicleTypeRepository.findAllByActivatedTrue(pageable).map(DataVehicleTypeDetails::new);
	}

	/**
	 * Desativa um tipo de veículo.
	 *
	 * @param id ID do tipo de veículo a ser desativado.
	 */
	public void disabled(Long id) {
		vehicleTypeValidatorDisabledList.forEach(v -> v.validation(id));
		VehicleType vehicleType = vehicleTypeRepository.getReferenceById(id);
		vehicleType.disabled();
	}
}