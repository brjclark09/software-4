namespace WordGame.Server.Dtos;

public class GameDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Status { get; set; } = "Unfinished";
    public string Guesses { get; set; } = string.Empty;
    public string View { get; set; } = string.Empty;
    public int RemainingGuesses { get; set; } = 8;
    public string? Answer { get; set; }
}
