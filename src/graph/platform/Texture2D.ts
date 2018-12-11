namespace webGraph
{
    /**
     * The 2D texture class.
     */
    export class Texture2D extends abstractPlatformEntity<WebGLTexture> {
        unit:number;
        /**
         * Constructor.
         * @param filter The filter
         * @param wrap The wrap
         */
           public constructor(imagedata:HTMLImageElement|HTMLCanvasElement|Uint8Array|null,sampler:TextureOption) {
            super(rendingWebgl.createTexture());
            if(sampler==null)
            {
                sampler=new TextureOption();
            }
            rendingWebgl.activeTexture(GLConstants.TEXTURE0);
            this.attach();
            this.bufferData(imagedata,sampler);
            this.detach();
        }

        public bufferData(imagedata:HTMLImageElement|HTMLCanvasElement|Uint8Array|null,sampler:TextureOption)
        {
            if(imagedata instanceof HTMLImageElement || imagedata instanceof HTMLCanvasElement)
            {
                let image=imagedata as HTMLImageElement;
     
                rendingWebgl.pixelStorei(GLConstants.UNPACK_FLIP_Y_WEBGL,Number(sampler.flip_y));
                rendingWebgl.pixelStorei(GLConstants.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Number(sampler.preMultiply_alpha))
                rendingWebgl.texImage2D(rendingWebgl.TEXTURE_2D,0,sampler.pixelFormat,sampler.pixelFormat,sampler.pixelDatatype,image);
                
                if(isPowerOf2(image.width)&&isPowerOf2(image.height))
                {
                    rendingWebgl.generateMipmap(rendingWebgl.TEXTURE_2D);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_S,sampler.wrap_s);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
                    //webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER,option.min_filter);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MIN_FILTER,GLConstants.LINEAR_MIPMAP_NEAREST);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                }else
                {
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_S,TexWrapEnum.clampToEdge);//非2次方的不能用repeat
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_T,TexWrapEnum.clampToEdge);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MIN_FILTER,sampler.min_filter);
                    rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                }
                
            }else if(imagedata instanceof Uint8Array)
            {
                rendingWebgl.texImage2D(rendingWebgl.TEXTURE_2D,0,sampler.pixelFormat,sampler.width,sampler.height,0,sampler.pixelFormat,sampler.pixelDatatype,imagedata as Uint8Array);
                rendingWebgl.pixelStorei(GLConstants.UNPACK_FLIP_Y_WEBGL,Number(sampler.flip_y));
                rendingWebgl.pixelStorei(GLConstants.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Number(sampler.preMultiply_alpha))

                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MIN_FILTER,sampler.min_filter);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_S, sampler.wrap_s);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
            }else
            {
                if(sampler.width>0&&sampler.height>0)
                {
                    rendingWebgl.texImage2D(rendingWebgl.TEXTURE_2D,0,sampler.pixelFormat,sampler.width,sampler.height,0,sampler.pixelFormat,sampler.pixelDatatype,null);
                }else
                {
                    rendingWebgl.texImage2D(rendingWebgl.TEXTURE_2D,0,sampler.pixelFormat,sampler.pixelFormat,sampler.pixelDatatype,null);
                }
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_S,sampler.wrap_s);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MIN_FILTER,sampler.min_filter);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_2D, rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
            }
        }

        public attach(): void 
        {
            rendingWebgl.bindTexture(rendingWebgl.TEXTURE_2D, this.instance); 
        }
        public detach(): void { rendingWebgl.bindTexture(rendingWebgl.TEXTURE_2D, null); }
        public dispose():void {rendingWebgl.deleteTexture(this.instance)}
    }


}
