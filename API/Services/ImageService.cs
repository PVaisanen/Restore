using System;
using Api.RequestHelper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class ImageService
{
    private readonly Cloudinary _cloudinary;
    public ImageService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName, 
            config.Value.ApiKey, 
            config.Value.ApiSecret);

        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> AddimageAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "ts-course"
                //Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };

            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);

        var result = await _cloudinary.DestroyAsync(deletionParams);

        return result;
    }
}
