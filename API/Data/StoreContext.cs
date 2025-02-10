using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole {Id = "cab21e32-75f6-495b-9727-e88c602048b4", Name = "Member", NormalizedName = "MEMBER"},
                new IdentityRole {Id = "8f7485bf-5a61-42c0-8003-dc29ccf277f7", Name = "Admin", NormalizedName = "ADMIN"}
            );
    }

}
