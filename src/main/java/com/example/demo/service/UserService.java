package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.dto.UserRegisterDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDTO registerUser(UserRegisterDTO registerDTO) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // Create new user
        User user = new User();
        BeanUtils.copyProperties(registerDTO, user);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword())); //Encode password
        user.setRole("USER");
        user.setActive(true);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return convertToDTO(user);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Update fields
        BeanUtils.copyProperties(userDTO, user, "id", "password", "role");
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }

    public UserDTO loginUser(String email, String username, String password) throws Exception {
    User user = null;

    if (email != null && !email.isEmpty()) {
        user = userRepository.findByEmail(email).orElse(null);
    }

    if (user == null && username != null && !username.isEmpty()) {
        user = userRepository.findByUsername(username).orElse(null);
    }

    if (user == null) {
        throw new Exception("User not found");
    }

    // Check password
    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new Exception("Invalid password");
    }

    return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
    }
}