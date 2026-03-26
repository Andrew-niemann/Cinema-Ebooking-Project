package com.example.backend.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.services.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtService.extractEmail(token);
                if (jwtService.isTokenValid(token, email)) {
                    UsernamePasswordAuthenticationToken auth = 
                        new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    // Token is expired or invalid → send 401
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired or invalid");
                    return;
                }
            } catch (Exception e) {
                // Exception while parsing token → send 401
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token invalid");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}