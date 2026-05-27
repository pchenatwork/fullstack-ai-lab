using AutoRepair.Api.Models;
using AutoRepair.Api.Services;
using Azure;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using UglyToad.PdfPig;


namespace AutoRepair.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IngestController(
    AzureOpenAIClient openAiClient,
    SearchIndexClient indexClient,
    IConfiguration config) : ControllerBase
{
    private const int ChunkSize = 500;
    private const string EmbeddingModel = "text-embedding-3-small";

    [HttpPost]
    public async Task<IActionResult> IngestAsync([FromBody] IngestRequest req)
    {
        // 1. Ensure the index exists (idempotent)
        await IndexService.EnsureIndexExistsAsync(indexClient);

        // 2. Download PDF from Blob Storage
        var blobClient = new BlobClient(
            config["BlobStorage:ConnectionString"], "repairmanuals", req.FileName); //' repairmanuals' is the container name
        using var stream = await blobClient.OpenReadAsync();

        // 3. Extract text with PdfPig
        using var pdf = PdfDocument.Open(stream);
        /***
        var fullText = string.Join(" ",
            pdf.GetPages().Select(p => p.Text)); ***/
        
        var sb = new System.Text.StringBuilder();
        var pageCount = pdf.NumberOfPages;
        int i = 0;
        foreach (var page in pdf.GetPages())
        {
            sb.Append(page.Text);
            sb.Append(' ');
            i++;
            if (i % 10 == 0)
                Debug.WriteLine($"  Extracted {i}/{pageCount} pages...");
        }
        var fullText = sb.ToString();


        // 4. Split into 500-word chunks
        var chunks = fullText.Split(' ')
            .Chunk(ChunkSize)
            .Select((w, i) => (text: string.Join(" ", w), index: i))
            .ToList();

        // 5. Embed each chunk and upsert into AI Search
        var embedClient = openAiClient.GetEmbeddingClient(EmbeddingModel);
        var searchClient = new SearchClient(
            new Uri(config["AzureSearch:Endpoint"]!),
            "servicemanuals-index",
            new AzureKeyCredential(config["AzureSearch:ApiKey"]!));

        var safeFileName = System.Text.RegularExpressions.Regex.Replace( req.FileName, @"[^a-zA-Z0-9_\-=]", "_");

        foreach (var chunk in chunks)
        {
            var embedding = await embedClient.GenerateEmbeddingAsync(chunk.text);
            await searchClient.UploadDocumentsAsync(new[] {
                new ServiceManualChunk {
                    Id         = $"{safeFileName}-{chunk.index}",
                    FileName   = safeFileName, // req.FileName,
                    Text       = chunk.text,
                    TextVector = embedding.Value.ToFloats().ToArray()
                }
            }); 
        }

        return Ok(new { chunksIngested = chunks.Count, fileName = req.FileName });
    }
}