using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WordGame.Models;
using WordGame.Server.Dtos;
using WordGame.Server.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] EmailLoginDetails details)
    {
        var user = new ApplicationUser { UserName = details.Email, Email = details.Email };
        var result = await _userManager.CreateAsync(user, details.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new UserDto
        {
            UserId = user.Id,
            Email = user.Email!
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok("Logged out successfully.");
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] EmailLoginDetails details)
    {
        var user = await _userManager.FindByEmailAsync(details.Email);
        if (user == null)
            return Unauthorized();

        var result = await _signInManager.CheckPasswordSignInAsync(user, details.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Unauthorized();

        return Ok(new UserDto
        {
            UserId = user.Id,
            Email = user.Email!
        });
    }
}
