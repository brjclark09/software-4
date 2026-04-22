using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WordGame.Server.Data;
using WordGame.Server.Mappings;
using WordGame.Server.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));

string? jwtKey = builder.Configuration["Jwt:Key"];
string? jwtIssuer = builder.Configuration["Jwt:Issuer"];
string? jwtAudience = builder.Configuration["Jwt:Audience"];
string? jwtExpiresInMinutesRaw = builder.Configuration["Jwt:ExpiresInMinutes"];

if (string.IsNullOrWhiteSpace(jwtKey)) {
    throw new InvalidOperationException("Jwt:Key is not configured.");
}

if (string.IsNullOrWhiteSpace(jwtIssuer)) {
    throw new InvalidOperationException("Jwt:Issuer is not configured.");
}

if (string.IsNullOrWhiteSpace(jwtAudience)) {
    throw new InvalidOperationException("Jwt:Audience is not configured.");
}

if (!double.TryParse(jwtExpiresInMinutesRaw, out double jwtExpiresInMinutes)) {
    throw new InvalidOperationException("Jwt:ExpiresInMinutes is missing or invalid.");
}

builder.Services.Configure<JwtSettings>(options => {
    options.Key = jwtKey;
    options.Issuer = jwtIssuer;
    options.Audience = jwtAudience;
    options.ExpiresInMinutes = jwtExpiresInMinutes;
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
