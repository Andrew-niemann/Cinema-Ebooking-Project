package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dtos.userDtos.UpdateUserDto;
import com.example.backend.dtos.userDtos.UserInfo;
import com.example.backend.services.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/info")
    public ResponseEntity<UserInfo> getMyUserInfo(Authentication authentication) {
        UserInfo userInfo = userService.getUserInfo(authentication.getName());
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/add-favorite")
    public ResponseEntity<String> addFavoriteMovie(@RequestParam Long movieId, Authentication authentication) {

        userService.addFavoriteMovie(authentication.getName(), movieId);

        return ResponseEntity.ok("Movie added to favorites");
    }

    @DeleteMapping("/remove-favorite")
    public ResponseEntity<String> removeFavoriteMovie(@RequestParam Long movieId, Authentication authentication) {

        userService.removeFavoriteMovie(authentication.getName(), movieId);

        return ResponseEntity.ok("Movie removed from favorites");
    }

    @PatchMapping("/update-profile")
    public ResponseEntity<UserInfo> updateProfile(@RequestBody UpdateUserDto dto, Authentication auth) {

        UserInfo updatedUser = userService.updateUserProfile(auth.getName(), dto);

        return ResponseEntity.ok(updatedUser);
    }

}