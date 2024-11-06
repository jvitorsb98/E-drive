package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Brand}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui um método adicional para buscar todas as marcas ativadas, com cache.</p>
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    /**
     * Encontra todas as marcas que estão ativadas e paginadas.
     *
     * <p>Este método utiliza cache para otimizar consultas repetidas. A chave do cache é composta pelo número da página e o tamanho da página.</p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de marcas ativadas.
     */
    @Cacheable(value = "brands", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    Page<Brand> findAllByActivatedTrue(Pageable pageable);

    /**
     * Verifica se uma marca com o nome especificado já existe no repositório,
     * ignorando a diferença entre maiúsculas e minúsculas.
     *
     * @param name O nome da marca a ser verificado.
     * @return {@code true} se uma marca com o nome especificado já existir (independentemente do case),
     *         {@code false} caso contrário.
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Verifica se já existe uma marca com o nome especificado (ignorando diferenças de maiúsculas e minúsculas),
     * excluindo a marca com o ID fornecido.
     *
     * @param trimmedName O nome da marca a ser verificado.
     * @param id O ID da marca que será excluída da verificação.
     * @return {@code true} se uma marca com o mesmo nome já existir (ignorando o case e o ID),
     *         {@code false} caso contrário.
     */
    boolean existsByNameIgnoreCaseAndIdNot(String trimmedName, Long id);


    @Query("SELECT b.name FROM Brand b WHERE b.id = :brandId")
    String findBrandNameById(@Param("brandId") Long brandId);

    Page<Brand> findByActivatedTrue(Pageable pageable);
    Page<Brand> findByActivatedFalse(Pageable pageable);

}


