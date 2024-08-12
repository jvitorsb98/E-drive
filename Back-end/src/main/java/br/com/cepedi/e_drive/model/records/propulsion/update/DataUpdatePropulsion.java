package br.com.cepedi.e_drive.model.records.propulsion.update;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdatePropulsion(


		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name


		) {
}
