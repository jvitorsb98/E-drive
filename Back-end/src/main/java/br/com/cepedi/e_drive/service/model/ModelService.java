package br.com.cepedi.e_drive.service.model;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.service.model.validations.activated.ValidationModelActivated;
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
    private List<ValidationModelUpdate> modelValidationUpdateList;

    @Autowired
    private List<ValidationModelActivated> modelValidatorActivatedList;

    public DataModelDetails register(DataRegisterModel data) {
        Model model = new Model(data);
        model = modelRepository.save(model);
        return new DataModelDetails(model);
    }

    public DataModelDetails update(DataUpdateModel data) {
        modelValidationUpdateList.forEach(v -> v.validation(data));
        Model model = modelRepository.getReferenceById(data.id());
        model.updateDataModel(data);
        return new DataModelDetails(model);
    }

    public DataModelDetails getModelById(Long id) {
        Model model = modelRepository.findById(id).orElseThrow(() -> new RuntimeException("Model not found"));
        return new DataModelDetails(model);
    }

    public Page<DataModelDetails> listAllModels(Pageable pageable) {
        return modelRepository.findAll(pageable).map(DataModelDetails::new);
    }

    public void activated(Long id) {
        modelValidatorActivatedList.forEach(v -> v.validation(id));
        Model model = modelRepository.getReferenceById(id);
        model.activated();
    }

    public Page<DataModelDetails> listAllModelsActivatedTrue(Pageable pageable) {
        return modelRepository.findAllByActivatedTrue(pageable).map(DataModelDetails::new);
    }
}
