package br.com.cepedi.e_drive.model.records.propulsion.input;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataRegisterPropulsion(
		@NotNull(message = "Name cannot be null.")
		@Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
		String name

		) {
}
