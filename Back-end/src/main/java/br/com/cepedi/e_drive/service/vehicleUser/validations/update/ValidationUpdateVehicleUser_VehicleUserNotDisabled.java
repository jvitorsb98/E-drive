	package br.com.cepedi.e_drive.service.vehicleUser.validations.update;
	
	
	import br.com.cepedi.e_drive.model.entitys.VehicleUser;
	import br.com.cepedi.e_drive.repository.VehicleUserRepository;
	import br.com.cepedi.e_drive.security.model.entitys.User;
	import jakarta.validation.ValidationException;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Component;
	
	@Component
	public class ValidationUpdateVehicleUser_VehicleUserNotDisabled implements ValidationUpdateVehicleUser{
	
	    @Autowired
	    private VehicleUserRepository vehicleUserRepository;
	
	    @Override
	    public void validate(Long id) {
	        if (vehicleUserRepository.existsById(id)) {
	            VehicleUser vehicleUser  = vehicleUserRepository.getReferenceById(id);
	            if(!vehicleUser.isActivated()){
	                throw new ValidationException("The provided vehicle user id is disabled");
	            }
	        }
	    }
	}
