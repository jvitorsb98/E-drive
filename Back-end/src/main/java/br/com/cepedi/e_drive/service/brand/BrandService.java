package br.com.cepedi.e_drive.service.brand;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.service.brand.validations.disabled.BrandValidatorDisabled;
import br.com.cepedi.e_drive.service.brand.validations.update.ValidationBrandUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private List<ValidationBrandUpdate> brandValidationUpdateList;



    @Autowired
    private List<BrandValidatorDisabled> brandValidatorDisabledList;

    public DataBrandDetails register(DataRegisterBrand data) {
        Brand brand = new Brand(data);
        brand = brandRepository.save(brand);
        return new DataBrandDetails(brand);
    }

    public DataBrandDetails update(DataUpdateBrand data, Long id) {
        brandValidationUpdateList.forEach(v -> v.validation(id));
        Brand brand= brandRepository.getReferenceById(id);
        brand.updateDataBrand(data);
        return new DataBrandDetails(brand);
    }

    public DataBrandDetails getById(Long id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));
        return new DataBrandDetails(brand);
    }

    public Page<DataBrandDetails> listAll(Pageable pageable) {
        return brandRepository.findAll(pageable).map(DataBrandDetails::new);
    }



    public Page<DataBrandDetails> listAllActivated(Pageable pageable) {
        return brandRepository.findAllByActivatedTrue(pageable).map(DataBrandDetails::new);
    }

    public void disabled(Long id) {
        brandValidatorDisabledList.forEach(v -> v.validation(id));
        Brand brand = brandRepository.getReferenceById(id);
        brand.deactivated();
    }


}
