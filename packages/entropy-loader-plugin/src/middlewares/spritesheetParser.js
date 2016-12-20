import { Resource } from 'resource-loader';
import path from 'path';

const BATCH_SIZE = 1000;

export default PIXI => (loader, resource, next) => {
  let resourcePath;
  const imageResourceName = `${resource.name}_texture_atlas_image`;

  // skip if no data, its not json, it isn't spritesheet data, or the image resource already exists
  if (!resource.data || resource.type !== Resource.TYPE.JSON || !resource.data.frames || !resource.metadata || !resource.metadata.textureAtlas) {
    return next();
  }

  const loadOptions = {
    crossOrigin: resource.crossOrigin,
    loadType: Resource.LOAD_TYPE.IMAGE,
    metadata: {
      pixiTexture: true,
    },
    parentResource: resource,

  };

  // Prepend url path unless the resource image is a data url
  if (resource.isDataUrl) {
    resourcePath = resource.data.meta.image;
  } else {
    resourcePath = `${path.dirname(resource.url.replace(loader.loader.baseUrl, ''))}/${resource.data.meta.image}`;
  }

  // load the image for this sheet
  loader.loadPixiTexture({
    name: imageResourceName,
    url: resourcePath,
    options: loadOptions,
    onLoad(res) {
      resource.textures = {};

      const frames = resource.data.frames;
      const frameKeys = Object.keys(frames);
      const baseTexture = res.texture.baseTexture;
      let resolution = PIXI.utils.getResolutionOfUrl(resource.url);
      const scale = resource.data.meta.scale;

      // for now (to keep things compatible) resolution overrides scale
      // Support scale field on spritesheet
      if (resolution === 1 && scale !== undefined && scale !== 1)
      {
        baseTexture.resolution = resolution = scale;
        baseTexture.update();
      }

      let batchIndex = 0;

      function processFrames(initialFrameIndex, maxFrames)
      {
        let frameIndex = initialFrameIndex;

        while (frameIndex - initialFrameIndex < maxFrames && frameIndex < frameKeys.length)
        {
          const i = frameKeys[frameIndex];
          const rect = frames[i].frame;

          if (rect)
          {
            let frame = null;
            let trim = null;
            const orig = new PIXI.Rectangle(
              0,
              0,
              frames[i].sourceSize.w / resolution,
              frames[i].sourceSize.h / resolution
            );

            if (frames[i].rotated)
            {
              frame = new PIXI.Rectangle(
                rect.x / resolution,
                rect.y / resolution,
                rect.h / resolution,
                rect.w / resolution
              );
            }
            else
            {
              frame = new PIXI.Rectangle(
                rect.x / resolution,
                rect.y / resolution,
                rect.w / resolution,
                rect.h / resolution
              );
            }

            //  Check to see if the sprite is trimmed
            if (frames[i].trimmed)
            {
              trim = new PIXI.Rectangle(
                frames[i].spriteSourceSize.x / resolution,
                frames[i].spriteSourceSize.y / resolution,
                rect.w / resolution,
                rect.h / resolution
              );
            }

            resource.textures[i] = new PIXI.Texture(
              baseTexture,
              frame,
              orig,
              trim,
              frames[i].rotated ? 2 : 0
            );

            // lets also add the frame to pixi's global cache for fromFrame and fromImage functions
            PIXI.utils.TextureCache[i] = resource.textures[i];
          }

          frameIndex++;
        }
      }

      function shouldProcessNextBatch()
      {
        return batchIndex * BATCH_SIZE < frameKeys.length;
      }

      function processNextBatch(done)
      {
        processFrames(batchIndex * BATCH_SIZE, BATCH_SIZE);
        batchIndex++;
        setTimeout(done, 0);
      }

      function iteration()
      {
        processNextBatch(() =>
        {
          if (shouldProcessNextBatch())
          {
            iteration();
          }
          else
          {
            next();
          }
        });
      }

      if (frameKeys.length <= BATCH_SIZE)
      {
        processFrames(0, BATCH_SIZE);
        next();
      }
      else
      {
        iteration();
      }
    }
  });
}