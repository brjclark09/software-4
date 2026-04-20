using WordGame.Server.Models;

namespace WordGame.Server.Models;

public class Game
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public string Status { get; set; } = "Unfinished";
    public string Target { get; set; } = string.Empty;
    public string Guesses { get; set; } = string.Empty;
    public string View { get; set; } = string.Empty;
    public int RemainingGuesses { get; set; } = 8;
}
