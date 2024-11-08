package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.entitys.Model;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Model}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui métodos adicionais para buscar modelos com base em seu status de ativação e marca.</p>
 */
@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {

    /**
     * Encontra todos os modelos que estão ativados e paginados.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de modelos ativados.
     */
    Page<Model> findAllByActivatedTrue(Pageable pageable);

    /**
     * Encontra todos os modelos que estão desativados e paginados.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de modelos desativados.
     */
    Page<Model> findAllByActivatedFalse(Pageable pageable);

    /**
     * Encontra todos os modelos associados a uma marca específica e paginados.
     *
     * @param brand A marca cuja associação de modelos está sendo pesquisada.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de modelos associados à marca fornecida.
     */
    Page<Model> findByBrand(Brand brand, Pageable pageable);

    /**
     * Verifica se existe um modelo com o nome fornecido associado a uma determinada marca.
     *
     * @param name    O nome do modelo a ser verificado. Este parâmetro é sensível a maiúsculas e minúsculas.
     * @param brandId O ID da marca a qual o modelo está associado.
     * @return {@code true} se já existir um modelo com o nome e a marca fornecidos; {@code false} caso contrário.
     */
    boolean existsByNameAndBrandId(String name, Long brandId);

    /**
     * Verifica se existe um modelo com o mesmo nome (ignorando maiúsculas) associado à marca especificada.
     *
     * @param name    O nome do modelo.
     * @param brandId O ID da marca associada ao modelo.
     * @return true se existir um modelo com o mesmo nome para a marca; caso contrário, false.
     */
    boolean existsByNameIgnoreCaseAndBrandId(String name, Long brandId);

}
