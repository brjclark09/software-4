namespace Server.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Director { get; set; }
    public string Genre { get; set; }
    public int ReleaseYear { get; set; }
    public decimal Rating { get; set; }
    public bool IsAvailableToStream { get; set; }
    public string Description { get; set; }
    public string PosterPath { get; set; }
}
