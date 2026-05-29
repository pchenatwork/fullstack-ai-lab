using AutoRepair.Api.Repositories;
using AutoRepair.Api.Services;
using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Microsoft.AspNetCore.HttpOverrides;

//using Microsoft.EntityFrameworkCore;
//using MongoDB.Driver;
//using Npgsql.EntityFrameworkCore.PostgreSQL;
//using StackExchange.Redis;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Key Vault — Azure-hosted environments only (Render uses env vars)
if (builder.Environment.IsProduction())
{
 builder.Configuration.AddAzureKeyVault(
        new Uri("https://kv-autorepair.vault.azure.net/"), new DefaultAzureCredential());
}

// ## Add services to the container. ##

// Register Azure OpenAI client (points to Foundry Hub endpoint)
builder.Services.AddSingleton(sp => {
    var cfg = sp.GetRequiredService<IConfiguration>();
    return new AzureOpenAIClient(
        new Uri(cfg["AzureOpenAI:Endpoint"]!),
        new AzureKeyCredential(cfg["AzureOpenAI:ApiKey"]!)
    );
});
// Register AI Search client for queries
builder.Services.AddSingleton(sp => {
    var cfg = sp.GetRequiredService<IConfiguration>();
    return new SearchClient(
        new Uri(cfg["AzureSearch:Endpoint"]!),
        "servicemanuals-index",
        new AzureKeyCredential(cfg["AzureSearch:ApiKey"]!)
    );
});
// Register AI Search index client for index management
builder.Services.AddSingleton(sp => {
    var cfg = sp.GetRequiredService<IConfiguration>();
    return new SearchIndexClient(
        new Uri(cfg["AzureSearch:Endpoint"]!),
        new AzureKeyCredential(cfg["AzureSearch:ApiKey"]!)
    );
});

// Repository: Singleton — vehicles.json is loaded once for the app's lifetime.
builder.Services.AddSingleton<IVehicleRepository, JsonFileVehicleRepository>();

// Service: Scoped — conventional default; thin pass-through today.
builder.Services.AddScoped<IVehicleService, VehicleService>();

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// OpenAPI — built-in .NET 9 (no Swashbuckle needed)
builder.Services.AddOpenApi();

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
const string CorsPolicy = "frontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins(
                  "http://localhost:3000",          // Vite dev
                  "https://YOUR-SWA-URL.azurestaticapps.net")  // deployed frontend
              .AllowAnyHeader()
              .AllowAnyMethod());
});

/** Lab 6 : Add services for PostgreSQL, Redis, and MongoDB.
// PostgreSQL via EF Core
builder.Services.AddDbContext<ConversationDbContext>(opt =>
     opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));
 builder.Services.AddScoped<ConversationService>();

// Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(
        builder.Configuration.GetConnectionString("Redis")!));
builder.Services.AddSingleton<CacheService>();

// MongoDB
builder.Services.AddSingleton(sp =>
    new MongoClient(sp.GetRequiredService<IConfiguration>()
        .GetConnectionString("MongoDB")));
//?/ builder.Services.AddSingleton<ChunkAuditService>(); 
**/

var app = builder.Build();
app.UseForwardedHeaders(new ForwardedHeadersOptions   // ← first
{
    // To address Render.com HTTP/HTTPS confusion
    ForwardedHeaders = ForwardedHeaders.XForwardedProto
});
app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();              // /openapi/v1.json
    app.MapScalarApiReference();   // /scalar/v1 — interactive UI
}

// Since HTTPS only, no HTTP profile, we don't need this redirect
//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
