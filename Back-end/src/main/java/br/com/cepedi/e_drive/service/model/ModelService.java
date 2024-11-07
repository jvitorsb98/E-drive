package br.com.cepedi.e_drive.service.model;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.service.model.validations.activated.ValidationModelActivated;
import br.com.cepedi.e_drive.service.model.validations.disabled.ModelValidatorDisabled;
import br.com.cepedi.e_drive.service.model.validations.register.ValidationRegisterModel;
import br.com.cepedi.e_drive.service.model.validations.update.ValidationModelUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciar as operações relacionadas aos modelos de veículos.
 */
@Service
public class ModelService {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private List<ValidationModelUpdate> modelValidationUpdateList;

    @Autowired
    private List<ValidationModelActivated> modelValidatorActivatedList;

    @Autowired
    private List<ModelValidatorDisabled> modelValidatorDisabledList;

    @Autowired
    private List<ValidationRegisterModel> validationRegisterModelList;

    /**
     * Registra um novo modelo de veículo.
     *
     * @param data Dados do modelo a ser registrado.
     * @return Detalhes do modelo registrado.
     */
    public DataModelDetails register(DataRegisterModel data) {
        validationRegisterModelList.forEach(v -> v.validation(data));
        Brand brand = brandRepository.getReferenceById(data.idBrand());
        Model model = new Model(data, brand);
        model = modelRepository.save(model);
        return new DataModelDetails(model);
    }

    /**
     * Atualiza um modelo existente.
     *
     * @param data Dados atualizados do modelo.
     * @param id ID do modelo a ser atualizado.
     * @return Detalhes do modelo atualizado.
     */
    public DataModelDetails update(DataUpdateModel data, Long id) {
        modelValidationUpdateList.forEach(v -> v.validation(data, id));
        Model model = modelRepository.getReferenceById(id);
        model.update(data);
        return new DataModelDetails(model);
    }

    /**
     * Obtém os detalhes de um modelo pelo ID.
     *
     * @param id ID do modelo.
     * @return Detalhes do modelo.
     * @throws RuntimeException Se o modelo não for encontrado.
     */
    public DataModelDetails getModelById(Long id) {
        Model model = modelRepository.findById(id).orElseThrow(() -> new RuntimeException("Model not found"));
        return new DataModelDetails(model);
    }

    /**
     * Lista todos os modelos com paginação.
     *
     * @param pageable Informações de paginação.
     * @return Página contendo os detalhes dos modelos.
     */
    public Page<DataModelDetails> listAllModels(Pageable pageable) {
        return modelRepository.findAll(pageable).map(DataModelDetails::new);
    }

    /**
     * Lista todos os modelos associados a uma marca específica com paginação.
     *
     * @param brandId ID da marca.
     * @param pageable Informações de paginação.
     * @return Página contendo os detalhes dos modelos associados à marca.
     * @throws RuntimeException Se a marca não for encontrada.
     */
    public Page<DataModelDetails> listAllModelsByBrand(Long brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId).orElseThrow(() -> new RuntimeException("Brand not found"));
        return modelRepository.findByBrand(brand, pageable).map(DataModelDetails::new);
    }

    /**
     * Ativa um modelo.
     *
     * @param id ID do modelo a ser ativado.
     */
    public void activated(Long id) {
        modelValidatorActivatedList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);
        model.activated();
    }

    /**
     * Lista todos os modelos que estão ativados com paginação.
     *
     * @param pageable Informações de paginação.
     * @return Página contendo os detalhes dos modelos ativados.
     */
    public Page<DataModelDetails> listAllModelsActivatedTrue(Pageable pageable) {
        return modelRepository.findAllByActivatedTrue(pageable).map(DataModelDetails::new);
    }

    /**
     * Desativa um modelo.
     *
     * @param id ID do modelo a ser desativado.
     */
    public void disable(Long id) {
        modelValidatorDisabledList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);
        model.deactivated();
    }


    public void enable(Long id) {
        // Executa validações no modelo antes de continuar
        modelValidatorActivatedList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);

        model.activated();
    }

    /**
     * Encontra modelos com base no status de ativação.
     *
     * @param activated Status de ativação dos modelos a serem buscados.
     * @param pageable  Informações de paginação e ordenação.
     * @return Uma página de detalhes dos modelos filtrados pelo status de ativação.
     */
    public Page<DataModelDetails> findByActivated(Boolean activated, Pageable pageable) {
        if (activated) {
            return modelRepository.findAllByActivatedTrue(pageable).map(DataModelDetails::new);
        } else {
            return modelRepository.findAllByActivatedFalse(pageable).map(DataModelDetails::new);
        }
    }
}
