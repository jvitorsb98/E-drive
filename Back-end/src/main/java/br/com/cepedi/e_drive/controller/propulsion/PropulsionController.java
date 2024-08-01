package br.com.cepedi.e_drive.controller.propulsion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.service.propulsion.PropulsionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/propulsions")
@Tag(name = "Propulsion", description = "Endpoints for managing propulsions")
public class PropulsionController {

    @Autowired
    private PropulsionService propulsionService;

    	@Operation(summary = "Register a new propulsion", responses = {
        @ApiResponse(responseCode = "201", description = "Propulsion registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<DataPropulsionDetails> registerPropulsion(@Valid @RequestBody DataRegisterPropulsion data) {
        DataPropulsionDetails details = propulsionService.registerPropulsion(data);
        return new ResponseEntity<>(details, HttpStatus.CREATED);
    }

    @Operation(summary = "List all propulsions", responses = {
        @ApiResponse(responseCode = "200", description = "List of propulsions retrieved")
    })
    @GetMapping
    public ResponseEntity<Page<DataPropulsionDetails>> listAllPropulsions(Pageable pageable) {
        Page<DataPropulsionDetails> propulsions = propulsionService.listAllPropulsions(pageable);
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @Operation(summary = "List all deactivated propulsions", responses = {
        @ApiResponse(responseCode = "200", description = "List of deactivated propulsions retrieved")
    })
    @GetMapping("/deactivated")
    public ResponseEntity<Page<DataPropulsionDetails>> listAllDeactivatedPropulsions(Pageable pageable) {
        Page<DataPropulsionDetails> propulsions = propulsionService.listAllDeactivatedPropulsions(pageable);
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @Operation(summary = "Search propulsions by name", responses = {
        @ApiResponse(responseCode = "200", description = "List of propulsions retrieved by name"),
        @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    @GetMapping("/search")
    public ResponseEntity<Page<DataPropulsionDetails>> listPropulsionsByName(
            @RequestParam("name") String name, Pageable pageable) {
        Page<DataPropulsionDetails> propulsions = propulsionService.listPropulsionsByName(name, pageable);
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @Operation(summary = "Get a propulsion by ID", responses = {
        @ApiResponse(responseCode = "200", description = "Propulsion retrieved"),
        @ApiResponse(responseCode = "404", description = "Propulsion not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DataPropulsionDetails> getPropulsionById(@PathVariable Long id) {
        DataPropulsionDetails details = propulsionService.getPropulsionById(id);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    @Operation(summary = "Update a propulsion", responses = {
        @ApiResponse(responseCode = "200", description = "Propulsion updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Propulsion not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<DataPropulsionDetails> updatePropulsion(
            @PathVariable Long id, @Valid @RequestBody DataUpdatePropulsion data) {
        data = new DataUpdatePropulsion(id, data.name(), data.activated()); // Ensure ID is included
        DataPropulsionDetails details = propulsionService.updatePropulsion(data);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    @Operation(summary = "Disable a propulsion", responses = {
        @ApiResponse(responseCode = "204", description = "Propulsion disabled successfully"),
        @ApiResponse(responseCode = "404", description = "Propulsion not found")
    })
    @PatchMapping("/{id}/disable")
    public ResponseEntity<Void> disablePropulsion(@PathVariable Long id) {
        propulsionService.disablePropulsion(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
