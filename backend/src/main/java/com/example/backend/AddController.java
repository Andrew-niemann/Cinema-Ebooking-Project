package com.example.backend;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
public class AddController {

    @GetMapping("/add")
    public int add(@RequestParam int a,
                   @RequestParam int b) {
        return a + b;
    }
}