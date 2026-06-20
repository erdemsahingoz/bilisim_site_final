package com.bilisim.store.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class SecurityUser implements UserDetails {

    private final String uid;
    private final String email;
    private final String role; // "USER" or "ADMIN"

    public SecurityUser(String uid, String email, String role) {
        this.uid = uid;
        this.email = email;
        this.role = role;
    }

    public String getUid() {
        return uid;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map roles to spring security authorities (e.g. ROLE_USER, ROLE_ADMIN)
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return ""; // Firebase handle authentication, no password stored locally
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
