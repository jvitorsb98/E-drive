package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Address}.
 * Extende o JpaRepository para fornecer métodos CRUD básicos e consultas personalizadas.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Consulta personalizada para encontrar endereços associados a um usuário específico
     * e que estão ativados.
     *
     * @param userId ID do usuário para buscar os endereços.
     * @param pageable Objeto de paginação que especifica a página e o tamanho da página.
     * @return Um {@link Page} de {@link Address} que correspondem ao ID do usuário e estão ativados.
     */
    @Query("SELECT a FROM Address a WHERE a.user.id = :userId AND a.activated = true")
    Page<Address> findByUserIdAndActivated(@Param("userId") Long userId, Pageable pageable);

}
