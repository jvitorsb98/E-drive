package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
