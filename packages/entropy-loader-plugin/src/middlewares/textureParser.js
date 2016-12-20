import { Resource } from 'resource-loader';

export default PIXI => (loader, resource, next) => {
  // create a new texture if the data is an Image object
  if (resource.data && resource.type === Resource.TYPE.IMAGE && resource.metadata && resource.metadata.pixiTexture) {
    const baseTexture = new PIXI.BaseTexture(resource.data, null, PIXI.utils.getResolutionOfUrl(resource.url));

    baseTexture.imageUrl = resource.url;
    resource.texture = new PIXI.Texture(baseTexture);

    // lets also add the frame to pixi's global cache for fromFrame and fromImage fucntions
    PIXI.utils.BaseTextureCache[resource.name] = baseTexture;
    PIXI.utils.TextureCache[resource.name] = resource.texture;

    // also add references by url if they are different.
    if (resource.name !== resource.url) {
      PIXI.utils.BaseTextureCache[resource.url] = baseTexture;
      PIXI.utils.TextureCache[resource.url] = resource.texture;
    }
  }

  return next();
};
