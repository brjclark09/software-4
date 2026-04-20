using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WordGame.Server.Data;
using WordGame.Server.Dtos;
using WordGame.Server.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GamePlayController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebHostEnvironment _env;

    public GamePlayController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
    {
        _context = context;
        _userManager = userManager;
        _env = env;
    }

    private static GameDto ToDto(Game g) => new GameDto
    {
        Id = g.Id,
        UserId = g.UserId,
        Status = g.Status,
        Guesses = g.Guesses,
        View = g.View,
        RemainingGuesses = g.RemainingGuesses,
        Answer = g.Status != "Unfinished" ? g.Target : null
    };

    [HttpGet("games")]
    public async Task<IActionResult> GetAllGames()
    {
        var userId = _userManager.GetUserId(User);

        var games = await _context.Games
            .Where(g => g.UserId == userId)
            .ToListAsync();

        return Ok(games.Select(ToDto));
    }

    [HttpGet("games/{gameId}")]
    public async Task<IActionResult> GetGame(int gameId)
    {
        var userId = _userManager.GetUserId(User);

        var game = await _context.Games
            .FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);

        if (game == null)
            return NotFound();

        return Ok(ToDto(game));
    }

    [HttpDelete("games/{gameId}")]
    public async Task<IActionResult> DeleteGame(int gameId)
    {
        var userId = _userManager.GetUserId(User);

        var game = await _context.Games
            .FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);

        if (game == null)
            return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();

        var remaining = await _context.Games
            .Where(g => g.UserId == userId)
            .ToListAsync();

        return Ok(remaining.Select(ToDto));
    }

    [HttpPost("games/{gameId}/guesses")]
    public async Task<IActionResult> MakeGuess(int gameId, [FromQuery] string guess)
    {
        var userId = _userManager.GetUserId(User);

        var game = await _context.Games
            .FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);

        if (game == null)
            return NotFound();

        if (game.Status != "Unfinished")
            return BadRequest("Game is already over.");

        var letter = guess[0];
        game.Guesses += letter;

        if (game.Target.Contains(letter))
        {
            var view = game.View.ToCharArray();
            for (int i = 0; i < game.Target.Length; i++)
            {
                if (game.Target[i] == letter)
                    view[i] = letter;
            }
            game.View = new string(view);

            if (!game.View.Contains('_'))
                game.Status = "Win";
        }
        else
        {
            game.RemainingGuesses--;

            if (game.RemainingGuesses <= 0)
                game.Status = "Loss";
        }

        await _context.SaveChangesAsync();

        return Ok(ToDto(game));
    }

    [HttpPost("games")]
    public async Task<IActionResult> CreateGame()
    {
        var userId = _userManager.GetUserId(User);

        var wordListPath = Path.Combine(_env.ContentRootPath, "Assets", "wordList.json");
        var json = await System.IO.File.ReadAllTextAsync(wordListPath);
        var wordList = JsonSerializer.Deserialize<WordList>(json)!;

        var allWords = wordList.Easy
            .Concat(wordList.EasyMed)
            .Concat(wordList.Med)
            .Concat(wordList.MedHard)
            .Concat(wordList.Hard)
            .ToList();

        var target = allWords[Random.Shared.Next(allWords.Count)];

        var game = new Game
        {
            UserId = userId!,
            Target = target,
            View = new string('_', target.Length)
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return Ok(ToDto(game));
    }
}
