using System;
using System.Net;
using System.Runtime.ExceptionServices;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware

{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var Response = new ProblemDetails
        {
            Status = 500,
            Detail = env.IsDevelopment() 
                ? ex.StackTrace?.ToString()
                : null,
            Title = ex.Message
        };

        var option = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

        var json = JsonSerializer.Serialize(Response, option);

        await context.Response.WriteAsync(json);
    }
}
