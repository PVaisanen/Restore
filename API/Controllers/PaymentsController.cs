using System;
using System.Net.Mime;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService,
     StoreContext contex, IConfiguration config, ILogger<PaymentsController> logger) : BaseApiController
{

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentintent()
    {
        var basket = await contex.Baskets.GetBasketwithItems(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("Problem with the basket");

        var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) return BadRequest("Problem creating payment intent");

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        if (contex.ChangeTracker.HasChanges())
        {
             var result = await contex.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Problem updatin basket with intent");
        }

        return basket.ToDto();
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = ConstructStripeEvent(json);

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid event data");
            }

            if (intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
            else await HandlePaymentIntentFailed(intent);

            return Ok(); 
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe webhook error");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error has occure");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexcepted error");
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await contex.Orders
            .Include(x => x.Ordersitems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");

        foreach (var item in order.Ordersitems)
        {
            var productItem = await contex.Products
                .FindAsync(item.itemOrdered.ProductId)
                    ?? throw new Exception("Problem updating order stock");

            productItem.QuantityInStock += item.Quantity;
            
            order.OrderStatus = OrderStatus.PaymentFailed;

            await contex.SaveChangesAsync();
        }
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await contex.Orders
            .Include(x => x.Ordersitems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");

        if(order.GetTotal() != intent.Amount) {
            order.OrderStatus = OrderStatus.PaymentMismatch;
        }
        else {
            order.OrderStatus = OrderStatus.PaymentReceived;
        }

        var basket = await contex.Baskets.FirstOrDefaultAsync( x=> 
            x.PaymentIntentId == intent.Id);

        if (basket != null) contex.Baskets.Remove(basket);

        await contex.SaveChangesAsync();

    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json, 
                Request.Headers["Stripe-Signature"], config["StripeSettings:WhSecret"]);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to construct stripe event");
            throw new StripeException("Invalid signature");
        }
    }

}
