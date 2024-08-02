package br.com.cepedi.e_drive.service.brand;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.service.brand.validations.activated.ValidationBrandActivated;
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
    private List<ValidationBrandActivated> brandValidatorActivatedList;

    public DataBrandDetails register(DataRegisterBrand data) {
        Brand brand = new Brand(data);
        brand = brandRepository.save(brand);
        return new DataBrandDetails(brand);
    }

    public DataBrandDetails update(DataUpdateBrand data) {
        brandValidationUpdateList.forEach(v -> v.validation(data));
        Brand brand= brandRepository.getReferenceById(data.id());
        brand.updateDataBrand(data);
        return new DataBrandDetails(brand);
    }

    public DataBrandDetails getBrandById(Long id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));
        return new DataBrandDetails(brand);
    }

    public Page<DataBrandDetails> listAllBrands(Pageable pageable) {
        return brandRepository.findAll(pageable).map(DataBrandDetails::new);
    }

    public void activated(Long id) {
        brandValidatorActivatedList.forEach(v -> v.validation(id));
        Brand brand = brandRepository.getReferenceById(id);
        brand.activated();
    }



    public Page<DataBrandDetails> lisAllBrandsActivatedTrue(Pageable pageable) {
        return brandRepository.findAllByActivatedTrue(pageable).map(DataBrandDetails::new);
    }


}
