using System;
using System.Net.Mime;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext contex) : BaseApiController
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

}
