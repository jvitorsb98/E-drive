package br.com.cepedi.e_drive.security.controller.user;

import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.service.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

/**
 * Controlador responsável pelas operações relacionadas ao usuário autenticado.
 * <p>
 * Este controlador expõe endpoints para verificar a existência de um usuário, obter detalhes do usuário autenticado e atualizar os dados do usuário.
 * </p>
 */
@RestController
@RequestMapping("/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Verifica se um usuário com o e-mail fornecido existe.
     *
     * @param email O e-mail do usuário a ser verificado.
     * @return Uma resposta com um valor booleano indicando se o usuário existe.
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> userExists(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * Obtém os detalhes do usuário autenticado.
     *
     * @param userDetails Os detalhes do usuário autenticado.
     * @return Uma resposta com os detalhes do usuário.
     */
    @GetMapping("/me")
    public ResponseEntity<DataDetailsUser> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        DataDetailsUser user = userService.getDetailsUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Atualiza os dados do usuário autenticado.
     *
     * @param userDetails Os detalhes do usuário autenticado.
     * @param dataUpdateUser Dados atualizados do usuário.
     * @return Uma resposta com os detalhes atualizados do usuário.
     */
    @PutMapping("/update")
    @Transactional
    public ResponseEntity<DataDetailsUser> updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody DataUpdateUser dataUpdateUser) {
        DataDetailsUser updatedUser = userService.updateUser(dataUpdateUser, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

}
