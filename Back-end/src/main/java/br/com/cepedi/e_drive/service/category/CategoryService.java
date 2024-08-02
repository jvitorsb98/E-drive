package br.com.cepedi.e_drive.service.category;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.input.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.repository.CategoryRepository;
import br.com.cepedi.e_drive.service.category.validations.disabled.CategoryValidatorDisabled;
import br.com.cepedi.e_drive.service.category.validations.register.CategoryValidatorRegister;
import br.com.cepedi.e_drive.service.category.validations.update.CategoryValidatorUpdate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryValidatorRegister categoryValidatorRegister;
    
    @Autowired
    private List<CategoryValidatorDisabled> categoryValidatorDisabledList;

    @Autowired
    private List<CategoryValidatorUpdate> categoryValidatorUpdateList;

    @Transactional
    public DataCategoryDetails registerCategory(DataRegisterCategory data) {
        categoryValidatorRegister.validate(data);
        Category category = new Category();
        category.setName(data.name());
        category.setActivated(data.activated());
        category = categoryRepository.save(category);
        return new DataCategoryDetails(category);
    }
    
    @Cacheable(value = "allCategories", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(DataCategoryDetails::new);
    }
    
    @Cacheable(value = "deactivatedCategories", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listAllDeactivatedCategories(Pageable pageable) {
        return categoryRepository.findAllByActivatedFalse(pageable)
                .map(DataCategoryDetails::new);
    }
    
    @Cacheable(value = "categoriesByName", key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<DataCategoryDetails> listCategoriesByName(String name, Pageable pageable) {
        return categoryRepository.findByNameContaining(name, pageable)
                .map(DataCategoryDetails::new);
    }
    
    @Cacheable(value = "categoryById", key = "#id")
    public DataCategoryDetails getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new DataCategoryDetails(category);
    }

    @Transactional
    public DataCategoryDetails updateCategory(DataUpdateCategory data) {
        categoryValidatorUpdateList.forEach(v -> v.validate(data));
        Category category = categoryRepository.getReferenceById(data.id());
        category.setName(data.name());
        category.setActivated(data.activated());
        category = categoryRepository.save(category);
        return new DataCategoryDetails(category);
    }

    @Transactional
    public void disableCategory(Long id) {
        categoryValidatorDisabledList.forEach(v -> v.validate(id));
        Category category = categoryRepository.getReferenceById(id);
        category.setActivated(false);
        categoryRepository.save(category);
    }
}
