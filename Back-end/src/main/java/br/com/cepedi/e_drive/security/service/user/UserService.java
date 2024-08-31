package br.com.cepedi.e_drive.security.service.user;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.security.service.user.validations.update.UserValidationUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private List<UserValidationUpdate> userValidationUpdateList;

    // Método para buscar usuário pelo email
    public User getUserActivatedByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.saveAndFlush(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public DataDetailsUser getDetailsUserByEmail(String email){
        return new DataDetailsUser(userRepository.findByEmail(email));
    }

    public DataDetailsUser updateUser(DataUpdateUser data, UserDetails userDetails) {
        String email = userDetails.getUsername();
        userValidationUpdateList.forEach(v -> v.validate(data, email));
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.update(data);
        return new DataDetailsUser(user);
    }
}
