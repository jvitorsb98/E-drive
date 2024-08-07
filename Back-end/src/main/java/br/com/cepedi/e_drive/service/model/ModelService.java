package br.com.cepedi.e_drive.service.model;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModelService {

    @Autowired
    private ModelRepository modelRepository;

    public DataModelDetails register(DataRegisterModel data) {
        Model model = new Model(data);
        model = modelRepository.save(model);
        return new DataModelDetails(model);
    }
}
