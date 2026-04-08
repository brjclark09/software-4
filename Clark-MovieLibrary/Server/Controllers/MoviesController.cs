using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MoviesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MoviesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/movies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
    {
        return await _context.Movies.ToListAsync();
    }

    // GET: api/movies/search?title=value
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string title)
    {
        return await _context.Movies
            .Where(m => m.Title.Contains(title, StringComparison.OrdinalIgnoreCase))
            .ToListAsync();
    }

    // GET: api/movies/{movieId}
    [HttpGet("{movieId}")]
    public async Task<ActionResult<Movie>> GetMovie(int movieId)
    {
        var movie = await _context.Movies.FindAsync(movieId);

        if (movie == null)
        {
            return NotFound();
        }

        return movie;
    }
}
