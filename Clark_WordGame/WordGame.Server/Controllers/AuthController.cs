using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;
using AutoMapper;
using Microsoft.Extensions.Options;
using System.Text;
using WordGame.Server.Models;
using WordGame.Server.Dtos;
using WordGame.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly UrlEncoder _urlEncoder;
    private readonly IConfiguration _config;
    private readonly JwtSettings _jwtSettings;
    private readonly IMapper _mapper;

    public AuthController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        UrlEncoder urlEncoder,
        IConfiguration config,
        IOptions<JwtSettings> jwtSettings,
        IMapper mapper
    ) {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
        _urlEncoder = urlEncoder;
        _config = config;
        _jwtSettings = jwtSettings.Value;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterWithEmail(EmailLoginDetails details) {
        AuthResult authResult = await RegisterWithEmail(Request, details);

        if (authResult.HasErrors) {
            return BadRequest(authResult.Errors);
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LoginWithEmail(EmailLoginDetails details)
    {
        var user = await _userManager.FindByEmailAsync(details.Email);
        if (user == null)
            return Unauthorized("Wrong email or password.");

        var result = await _signInManager.PasswordSignInAsync(details.Email, details.Password, details.RememberMe, false).ConfigureAwait(false);
        if (result.Succeeded) {

            var token = this.GenerateJwtToken(user);

            UserDto userDto = _mapper.Map<UserDto>(user);

            return Ok(new { success = true, user = userDto, emailConfirmed = true, requires2fa = false, accessToken = token });
        }
        if (result.RequiresTwoFactor) {
            return Ok(new { success = true, emailConfirmed = true, requires2fa = true });
        }
        if (result.IsLockedOut) {
            return Ok(new { success = false, isLockedOut = true });
        }

        return Unauthorized();
    }

    [HttpPost("sign-in-with-token")]
    public async Task<IActionResult> SignInWithToken() {
        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token == null) {
            return Unauthorized(new { message = "Token is missing" });
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key)),
            ValidateIssuer = true,
            ValidIssuer = _jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = _jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        try {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (null == user) {
                return Unauthorized(new { message = "Invalid token" });
            }

            var newToken = GenerateJwtToken(user);

            UserDto userDto = _mapper.Map<UserDto>(user);

            return Ok(new { message = "Token is valid", user = userDto, accessToken = newToken });
        } catch {
            return Unauthorized(new { message = "Invalid token" });
        }
    }

    private string GenerateJwtToken(ApplicationUser user) {
        if (null == user) {
            throw new ArgumentNullException(nameof(user));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var now = DateTime.UtcNow;
        var clockSkewMinutes = 5;
        var expires = now.AddMinutes(_jwtSettings.ExpiresInMinutes);
        var notBefore = now.AddMinutes(-clockSkewMinutes); // Subtracting for clock skew

        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
        }),
            Expires = expires,
            SigningCredentials = creds,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    private async Task<AuthResult> RegisterWithEmail(HttpRequest request, EmailLoginDetails details) {
        AuthResult? authResult = new AuthResult();
        ApplicationUser? user = new ApplicationUser { UserName = details.Email, Email = details.Email };
        IdentityResult? result = await _userManager.CreateAsync(user, details.Password);

        if (!result.Succeeded) {
            authResult.Errors = result.Errors.Select(identityError => identityError.Description).ToList();

            return authResult;
        }

        authResult.Success = true;
        return authResult;
    }
}
