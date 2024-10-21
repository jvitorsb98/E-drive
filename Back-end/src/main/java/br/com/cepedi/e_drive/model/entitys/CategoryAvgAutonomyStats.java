package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.entitys.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "category_avg_autonomy_stats")
public class CategoryAvgAutonomyStats {

    /**
     * Identificador único da média de autonomia. Este campo é obrigatório.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Identificador da categoria. Este campo é obrigatório.
     */
    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * Média da autonomia elétrica para a categoria. Este campo é obrigatório.
     */
    @Column(name = "avg_autonomy_electric_mode", nullable = false)
    private BigDecimal avgAutonomyElectricMode;

    /**
     * Construtor que cria uma nova instância de CategoryAvgAutonomyStats com base nos dados fornecidos.
     *
     * @param category                        Categoria associada à média de autonomia.
     * @param avgAutonomyElectricMode        Média da autonomia elétrica para a categoria.
     */
    public CategoryAvgAutonomyStats(Category category, BigDecimal avgAutonomyElectricMode) {
        this.category = category;
        this.avgAutonomyElectricMode = avgAutonomyElectricMode;
    }
}
