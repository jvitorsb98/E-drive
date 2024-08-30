package br.com.cepedi.e_drive.service.category;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import br.com.cepedi.e_drive.service.category.validations.disabled.CategoryValidatorDisabled;
import br.com.cepedi.e_drive.service.category.validations.update.CategoryValidatorUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Serviço responsável por gerenciar operações relacionadas à entidade {@link Category}.
 * Este serviço lida com o registro, listagem, atualização e desativação de categorias,
 * além de aplicar as validações necessárias antes de cada operação.
 */
@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private List<CategoryValidatorDisabled> categoryValidatorDisabledList;

    @Autowired
    private List<CategoryValidatorUpdate> categoryValidatorUpdateList;

    /**
     * Registra uma nova categoria no sistema.
     *
     * @param data Os dados da categoria a ser registrada.
     * @return Os detalhes da categoria registrada.
     */
    @Transactional
    public DataCategoryDetails register(DataRegisterCategory data) {
        Category category = new Category(data);
        category = categoryRepository.save(category);
        return new DataCategoryDetails(category);
    }

    /**
     * Lista todas as categorias com paginação.
     * O resultado é armazenado em cache para melhorar o desempenho.
     *
     * @param pageable Informações de paginação.
     * @return Uma página de detalhes de categorias.
     */
    @Cacheable(value = "allCategories", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listAll(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(DataCategoryDetails::new);
    }

    /**
     * Lista todas as categorias desativadas com paginação.
     * O resultado é armazenado em cache para melhorar o desempenho.
     *
     * @param pageable Informações de paginação.
     * @return Uma página de detalhes de categorias desativadas.
     */
    @Cacheable(value = "deactivatedCategories", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listAllDeactivated(Pageable pageable) {
        return categoryRepository.findAllByActivatedFalse(pageable)
                .map(DataCategoryDetails::new);
    }

    /**
     * Lista as categorias por nome com paginação.
     * O resultado é armazenado em cache para melhorar o desempenho.
     *
     * @param name O nome da categoria a ser pesquisada.
     * @param pageable Informações de paginação.
     * @return Uma página de detalhes de categorias que correspondem ao nome fornecido.
     */
    @Cacheable(value = "categoriesByName", key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listByName(String name, Pageable pageable) {
        return categoryRepository.findByNameContaining(name, pageable)
                .map(DataCategoryDetails::new);
    }

    /**
     * Obtém os detalhes de uma categoria específica pelo seu ID.
     * O resultado é armazenado em cache para melhorar o desempenho.
     *
     * @param id O ID da categoria.
     * @return Os detalhes da categoria encontrada.
     * @throws RuntimeException se a categoria não for encontrada.
     */
    @Cacheable(value = "categoryById", key = "#id")
    public DataCategoryDetails getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new DataCategoryDetails(category);
    }

    /**
     * Atualiza uma categoria existente.
     *
     * @param data Os novos dados da categoria.
     * @param id O ID da categoria a ser atualizada.
     * @return Os detalhes da categoria atualizada.
     */
    @Transactional
    public DataCategoryDetails update(DataUpdateCategory data, Long id) {
        categoryValidatorUpdateList.forEach(v -> v.validate(id));
        Category category = categoryRepository.getReferenceById(id);
        category.update(data);
        categoryRepository.save(category);
        return new DataCategoryDetails(category);
    }

    /**
     * Desativa uma categoria existente.
     *
     * @param id O ID da categoria a ser desativada.
     */
    @Transactional
    public void disabled(Long id) {
        categoryValidatorDisabledList.forEach(v -> v.validate(id));
        Category category = categoryRepository.getReferenceById(id);
        category.setActivated(false);
        categoryRepository.save(category);
    }
}
