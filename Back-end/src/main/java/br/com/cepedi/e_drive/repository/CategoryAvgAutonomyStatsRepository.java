package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.CategoryAvgAutonomyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryAvgAutonomyStatsRepository extends JpaRepository<CategoryAvgAutonomyStats,Long> {
}
