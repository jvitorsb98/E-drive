package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;

public interface ValidationModelUpdate {
    void validation(DataUpdateModel data, Long id);
}
