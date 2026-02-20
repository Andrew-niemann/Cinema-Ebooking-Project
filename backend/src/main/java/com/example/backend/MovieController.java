package com.example.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private List<Movie> movies = List.of(
        new Movie(
            1,
            "The Shawshank Redemption",
            "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/NmzuHjWmXOc?si=m_wB-eDtC2wBX3XQ\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Crime/Drama",
            "R",
            "Andy Dufresne (Tim Robbins) is sentenced to two consecutive life terms in prison for the murders of his wife and her lover and is sentenced to a tough prison. However, only Andy knows he didn't commit the crimes. While there, he forms a friendship with Red (Morgan Freeman), experiences brutality of prison life, adapts, helps the warden, etc., all in 19 years.",
            "Currently Running",
            List.of("1:00 PM", "4:00 PM", "7:00 PM"),
            List.of("3-5-2026", "3-6-2026", "3-7-2026")
        ),
        new Movie(
            2,
            "The Godfather",
            "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/sY1S34973zA?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Crime/Drama",
            "R",
            "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            "Currently Running",
            List.of("2:00 PM", "5:00 PM", "8:00 PM"),
            List.of("3-5-2026", "3-6-2026", "3-7-2026")
        ),
        new Movie(
            3,
            "The Dark Knight",
            "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/EXeTwQWrcwY?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Action/Crime",
            "PG-13",
            "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "Currently Running",
            List.of("3:00 PM", "6:00 PM", "9:00 PM"),
            List.of("3-5-2026", "3-6-2026", "3-7-2026")
        ),
        new Movie(
            4,
            "Pulp Fiction",
            "https://upload.wikimedia.org/wikipedia/en/8/82/Pulp_Fiction_cover.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/s7EdQ4FqbhY?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Crime/Drama",
            "R",
            "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            "Currently Running",
            List.of("4:00 PM", "7:00 PM", "10:00 PM"),
            List.of("3-5-2026", "3-6-2026", "3-7-2026")
        ),
        new Movie(
            5,
            "The Lord of the Rings: The Return of the King",
            "https://upload.wikimedia.org/wikipedia/en/9/9d/The_Lord_of_the_Rings_-_The_Return_of_the_King.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/r5X-hFf6Bwo?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Adventure/Fantasy",
            "PG-13",
            "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            "Coming Soon",
            List.of("5:00 PM", "8:00 PM", "11:00 PM"),
            List.of("3-8-2026", "3-9-2026", "3-10-2026")
        ),
        new Movie(
            6,
            "Forrest Gump",
            "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/bLvqoHBptjg?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Drama/Romance",
            "PG-13",
            "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
            "Coming Soon",
            List.of("6:00 PM", "9:00 PM", "12:00 AM"),
            List.of("3-8-2026", "3-9-2026", "3-10-2026")
        ),
        new Movie(
            7,
            "Inception",
            "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/YoHD9XEInc0?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Action/Sci-Fi",
            "PG-13",
            "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
            "Coming Soon",
            List.of("7:00 PM", "10:00 PM", "1:00 AM"),
            List.of("3-8-2026", "3-9-2026", "3-10-2026")
        ),
        new Movie(
            8,
            "The Matrix",
            "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/vKQi3bBA1y8?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Action/Sci-Fi",
            "R",
            "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
            "Coming Soon",
            List.of("8:00 PM", "11:00 PM", "2:00 AM"),
            List.of("3-8-2026", "3-9-2026", "3-10-2026")
        ),
        new Movie(
            9,
            "Interstellar",
            "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/zSWdZVtXT7E?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Adventure/Sci-Fi",
            "PG-13",
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            "Coming Soon",
            List.of("9:00 PM", "12:00 AM", "3:00 AM"),
            List.of("3-8-2026", "3-9-2026", "3-10-2026")
        ),
        new Movie(
            10,
            "The Lion King",
            "https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg",
            "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/4sj1MT05lAA?si=9n8sXoQh5mL7j3e\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            "Animation/Adventure",
            "G",
            "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
            "Coming Soon",
            List.of("10:00 PM", "1:00 AM", "4:00 AM"),
            List.of("3-10-2026", "3-11-2026", "3-12-2026")
        )
    );

    @GetMapping
    public List<Movie> getAllMovies() {
        return movies;
    }

    @GetMapping("/search")
    public List<Movie> SearchMovies(@RequestParam(required = false) String title,
        @RequestParam(required = false) String genre,
        @RequestParam(required = false) String showDate)
    {
        return movies.stream()
            .filter(movie -> {
            // 1. Check Title (if null/empty, skip this filter)
            boolean matchesTitle = (title == null || title.isBlank()) || 
            movie.getTitle().toLowerCase().contains(title.toLowerCase());

            // 2. Check Genre (if null/empty, skip this filter)
            boolean matchesGenre = (genre == null || genre.isBlank()) || 
                movie.getGenre().toLowerCase().contains(genre.toLowerCase());

            // 3. Check Date (if null/empty, skip this filter)
            boolean matchesDate = (showDate == null || showDate.isBlank()) || 
                movie.getShowDates() != null && movie.getShowDates().contains(showDate);

            // The movie must pass ALL three "gates"
            return matchesTitle && matchesGenre && matchesDate;
        })
        .toList();
    }

}