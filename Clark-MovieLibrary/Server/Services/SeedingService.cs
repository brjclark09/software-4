using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class SeedingService {
    private readonly ApplicationDbContext _context;

    public SeedingService(ApplicationDbContext context) {
        _context = context;
    }

    public async Task Seed() {
        if (await _context.Movies.AnyAsync()) {
            // Do not seed database if already populated.
            return;
        }

        var movies = new List<Movie> {
            new Movie {
                Title = "Inception",
                Director = "Christopher Nolan",
                Genre = "Science Fiction",
                ReleaseYear = 2010,
                Rating = 8.8m,
                IsAvailableToStream = true,
                Description = "A skilled thief enters people's dreams to steal secrets and is given a chance at redemption through one final job.",
                PosterPath = "https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"
            },
            new Movie {
                Title = "The Dark Knight",
                Director = "Christopher Nolan",
                Genre = "Action",
                ReleaseYear = 2008,
                Rating = 9.0m,
                IsAvailableToStream = false,
                Description = "Batman faces the Joker, a chaotic criminal mastermind who pushes Gotham City to the brink.",
                PosterPath = "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
            },
            new Movie {
                Title = "Interstellar",
                Director = "Christopher Nolan",
                Genre = "Science Fiction",
                ReleaseYear = 2014,
                Rating = 8.7m,
                IsAvailableToStream = true,
                Description = "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
                PosterPath = "https://image.tmdb.org/t/p/w342/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg"
            },
            new Movie {
                Title = "Spider-Man: Into the Spider-Verse",
                Director = "Bob Persichetti, Peter Ramsey, Rodney Rothman",
                Genre = "Animation",
                ReleaseYear = 2018,
                Rating = 8.4m,
                IsAvailableToStream = true,
                Description = "Miles Morales becomes Spider-Man and meets alternate Spider-People from other dimensions.",
                PosterPath = "https://image.tmdb.org/t/p/w342/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg"
            },
            new Movie {
                Title = "Whiplash",
                Director = "Damien Chazelle",
                Genre = "Drama",
                ReleaseYear = 2014,
                Rating = 8.5m,
                IsAvailableToStream = false,
                Description = "A young drummer enrolls at a prestigious music conservatory and faces an intense instructor.",
                PosterPath = "https://image.tmdb.org/t/p/w342/7fn624j5lj3xTme2SgiLCeuedmO.jpg"
            },
            new Movie {
                Title = "The Matrix",
                Director = "The Wachowskis",
                Genre = "Science Fiction",
                ReleaseYear = 1999,
                Rating = 8.7m,
                IsAvailableToStream = true,
                Description = "A computer hacker learns the truth about reality and his role in the war against its controllers.",
                PosterPath = "https://image.tmdb.org/t/p/w342/p96dm7sCMn4VYAStA6siNz30G1r.jpg"
            },
            new Movie {
                Title = "Parasite",
                Director = "Bong Joon-ho",
                Genre = "Thriller",
                ReleaseYear = 2019,
                Rating = 8.5m,
                IsAvailableToStream = true,
                Description = "A poor family schemes to become employed by a wealthy household, with unexpected consequences.",
                PosterPath = "https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
            },
            new Movie {
                Title = "La La Land",
                Director = "Damien Chazelle",
                Genre = "Musical",
                ReleaseYear = 2016,
                Rating = 8.0m,
                IsAvailableToStream = false,
                Description = "A jazz musician and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
                PosterPath = "https://image.tmdb.org/t/p/w342/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"
            }
        };

        await _context.Movies.AddRangeAsync(movies);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }
}