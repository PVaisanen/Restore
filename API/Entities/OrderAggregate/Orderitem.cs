using System;

namespace API.Entities.OrderAggregate;

public class Orderitem
{
    public int Id { get; set; }
    public required ProductItemOrdered itemOrdered { get; set; }
    public long Price { get; set; }

    public int  Quantity { get; set; }

}
