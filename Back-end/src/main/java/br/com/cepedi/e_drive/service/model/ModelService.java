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

    public DataModelDetails register(DataRegisterModel data) {
        validationRegisterModelList.forEach(v -> v.validation(data));
        Brand brand = brandRepository.getReferenceById(data.idBrand());
        Model model = new Model(data, brand);
        model = modelRepository.save(model);
        return new DataModelDetails(model);
    }

    public DataModelDetails update(DataUpdateModel data, Long id) {
        modelValidationUpdateList.forEach(v -> v.validation(data, id));
        Model model = modelRepository.getReferenceById(id);
        model.update(data);
        return new DataModelDetails(model);
    }

    public DataModelDetails getModelById(Long id) {
        Model model = modelRepository.findById(id).orElseThrow(() -> new RuntimeException("Model not found"));
        return new DataModelDetails(model);
    }

    public Page<DataModelDetails> listAllModels(Pageable pageable) {
        return modelRepository.findAll(pageable).map(DataModelDetails::new);
    }

    public Page<DataModelDetails> listAllModelsByBrand(Long brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId).orElseThrow(() -> new RuntimeException("Brand not found"));
        return modelRepository.findByBrand(brand, pageable).map(DataModelDetails::new);
    }

    public void activated(Long id) {
        modelValidatorActivatedList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);
        model.activated();
    }

    public Page<DataModelDetails> listAllModelsActivatedTrue(Pageable pageable) {
        return modelRepository.findAllByActivatedTrue(pageable).map(DataModelDetails::new);
    }

    public void disable(Long id) {
        modelValidatorDisabledList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);
        model.deactivated();
    }
}
