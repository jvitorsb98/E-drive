package br.com.cepedi.e_drive.security.controller;

import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/exists")
    public ResponseEntity<Boolean> userExists(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/me")
    public ResponseEntity<DataDetailsUser> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        DataDetailsUser user = userService.getDetailsUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<DataDetailsUser> updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody DataUpdateUser dataUpdateUser) {
        DataDetailsUser updatedUser = userService.updateUser(userDetails, dataUpdateUser);
        return ResponseEntity.ok(updatedUser);
    }

}