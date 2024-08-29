package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Category}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui métodos adicionais para buscar categorias com base em seu status de ativação e nome.</p>
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Encontra todas as categorias que não estão ativadas e paginadas.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de categorias desativadas.
     */
    @Query("SELECT c FROM Category c WHERE NOT c.activated ")
    Page<Category> findAllByActivatedFalse(Pageable pageable);

    /**
     * Encontra todas as categorias cujo nome contém a string fornecida e paginadas.
     *
     * @param name A substring a ser pesquisada no nome das categorias.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de categorias cujos nomes contêm a substring fornecida.
     */
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:name%")
    Page<Category> findByNameContaining(String name, Pageable pageable);
}
