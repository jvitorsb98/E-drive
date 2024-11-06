package br.com.cepedi.e_drive.service.brand;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.service.brand.validations.disabled.BrandValidatorDisabled;
import br.com.cepedi.e_drive.service.brand.validations.register.ValidationBrandRegister;
import br.com.cepedi.e_drive.service.brand.validations.update.ValidationBrandUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciamento das operações relacionadas a marcas.
 * Fornece métodos para registrar, atualizar, recuperar e listar marcas,
 * além de operações específicas como desativar marcas.
 */
@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private List<ValidationBrandRegister> brandValidationRegisterList;

    @Autowired
    private List<ValidationBrandUpdate> brandValidationUpdateList;

    @Autowired
    private List<BrandValidatorDisabled> brandValidatorDisabledList;

    /**
     * Registra uma nova marca com base nos dados fornecidos.
     *
     * @param data Dados da nova marca a ser registrada.
     * @return Detalhes da marca registrada.
     */
    public DataBrandDetails register(DataRegisterBrand data) {
        brandValidationRegisterList.forEach(validator -> validator.validation(data));
        Brand brand = new Brand(data);
        brandRepository.save(brand);
        return new DataBrandDetails(brand);
    }

    /**
     * Atualiza os dados de uma marca existente com base no ID fornecido.
     *
     * @param data Dados atualizados da marca.
     * @param id ID da marca a ser atualizada.
     * @return Detalhes da marca atualizada.
     */
    public DataBrandDetails update(DataUpdateBrand data, Long id) {
        brandValidationUpdateList.forEach(v -> v.validation(id,data));
        Brand brand = brandRepository.getReferenceById(id);
        brand.updateDataBrand(data);
        return new DataBrandDetails(brand);
    }

    /**
     * Recupera os detalhes de uma marca com base no ID fornecido.
     *
     * @param id ID da marca a ser recuperada.
     * @return Detalhes da marca encontrada.
     * @throws RuntimeException se a marca não for encontrada.
     */
    public DataBrandDetails getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return new DataBrandDetails(brand);
    }

    /**
     * Lista todas as marcas com paginação.
     *
     * @param pageable Parâmetros de paginação.
     * @return Página contendo os detalhes das marcas.
     */
    public Page<DataBrandDetails> listAll(Pageable pageable) {
        return brandRepository.findAll(pageable).map(DataBrandDetails::new);
    }

    /**
     * Lista todas as marcas ativadas com paginação.
     *
     * @param pageable Parâmetros de paginação.
     * @return Página contendo os detalhes das marcas ativadas.
     */
    public Page<DataBrandDetails> listAllActivated(Pageable pageable) {
        return brandRepository.findAllByActivatedTrue(pageable).map(DataBrandDetails::new);
    }

    /**
     * Desativa uma marca com base no ID fornecido.
     *
     * @param id ID da marca a ser desativada.
     */
    public void disabled(Long id) {
        brandValidatorDisabledList.forEach(v -> v.validation(id));
        Brand brand = brandRepository.getReferenceById(id);
        brand.deactivated();
    }

    /**
     * Ativa uma marca com base no ID fornecido.
     *
     * @param id ID da marca a ser ativada.
     */
    public void activated(Long id) {
        Brand brand = brandRepository.getReferenceById(id);
        brand.activated();
        brandRepository.save(brand);
    }

    public Page<DataBrandDetails> findByActivated(Boolean activated, Pageable pageable) {
        if (activated) {
            return brandRepository.findByActivatedTrue(pageable).map(DataBrandDetails::new);
        } else {
            return brandRepository.findByActivatedFalse(pageable).map(DataBrandDetails::new);
        }
    }


}
