package com.bilisim.store.service;

import com.bilisim.store.dto.RegisterRequest;
import com.bilisim.store.dto.UserResponse;
import com.bilisim.store.entity.User;
import com.bilisim.store.exception.ResourceNotFoundException;
import com.bilisim.store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registers a new user or returns the existing user if they are already registered.
     */
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        // If user already exists by UID, return that user
        return userRepository.findByUid(request.getUid())
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    // Check if email already exists
                    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new IllegalArgumentException("Bu e-posta adresiyle kayıtlı başka bir kullanıcı var.");
                    }

                    // Determine role: if email contains "admin", assign ADMIN role, otherwise USER
                    String role = "USER";
                    if (request.getEmail().toLowerCase().contains("admin")) {
                        role = "ADMIN";
                    }

                    User user = User.builder()
                            .uid(request.getUid())
                            .email(request.getEmail())
                            .displayName(request.getDisplayName() != null ? request.getDisplayName() : "")
                            .role(role)
                            .build();

                    User savedUser = userRepository.save(user);
                    return mapToResponse(savedUser);
                });
    }

    /**
     * Finds a user by Firebase UID or throws ResourceNotFoundException.
     */
    public User getUserByUid(String uid) {
        return userRepository.findByUid(uid)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı. UID: " + uid));
    }

    /**
     * Maps a User entity to a UserResponse DTO.
     */
    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .uid(user.getUid())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
