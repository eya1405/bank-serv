package com.banquex.banking.service;

import com.banquex.banking.dto.AuthResponse;
import com.banquex.banking.dto.LoginRequest;
import com.banquex.banking.dto.UserDto;
import com.banquex.banking.model.User;
import com.banquex.banking.repository.UserRepository;
import com.banquex.banking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("Found user: " + user.getEmail());
            System.out.println("Stored password: " + user.getPassword());
            System.out.println("Input password: " + loginRequest.getPassword());
            System.out.println("Password matches: " + passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()));

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail());
                UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
                return new AuthResponse(token, userDto);
            }
        }

        System.out.println("Authentication failed for email: " + loginRequest.getEmail());
        throw new RuntimeException("Invalid credentials");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDto getCurrentUser(String email) {
        User user = findByEmail(email);
        return new UserDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
    }
}