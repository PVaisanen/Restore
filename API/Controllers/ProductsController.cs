using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelper;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController(StoreContext context, IMapper mapper, 
        ImageService ImageService ) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery]ProductParams productParams)
        {
            var query = context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query,
                productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeder(products.Metadata);

            return products; //query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);


            if (product == null) return NotFound();
            
            return product;
        }

       [HttpGet("filters")] 
       public async Task<IActionResult> GetFilters()
       {
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
       }

        [HttpPost]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product =  mapper.Map<Product>(productDto);

            if (productDto.File != null)
            {
                var imageResult = await ImageService.AddimageAsync(productDto.File);

                if (imageResult.Error != null) return BadRequest(imageResult.Error.Message);

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            context.Products.Add(product);
            var result = await context.SaveChangesAsync() > 0;

            if(result) return CreatedAtAction(nameof(GetProduct), new {id = product.Id}, product);

            return BadRequest("Failed to create product");
        }

        [HttpPut]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<Product>> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await context.Products.FindAsync(updateProductDto.Id);

            if(product == null) return NotFound();

            mapper.Map(updateProductDto, product);

            if (updateProductDto.File != null)
            {
                var imageResult = await ImageService.AddimageAsync(updateProductDto.File);

                if (imageResult.Error != null) return BadRequest(imageResult.Error.Message);

                if(!string.IsNullOrEmpty(product.PublicId))
                    await ImageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            var result = await context.SaveChangesAsync() > 0;

            if(result) return NoContent();

            return BadRequest("Failed to update product");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if(product == null) return NotFound();

            context.Products.Remove(product);

            var result = await context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest("Failed to delete product");
        }      



    }
}
