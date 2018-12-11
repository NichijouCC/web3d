namespace webGraph
{
    /**
     * The 2D texture class.
     */
    export class CubeTex extends abstractPlatformEntity<WebGLTexture> {
        unit:number;
        /**
         * Constructor.
         * @param filter The filter
         * @param wrap The wrap
         */
        public constructor(imagedArr:HTMLImageElement[]|ImageData[]) {
            super(rendingWebgl.createTexture());
            if(imagedArr==null) return;

            rendingWebgl.activeTexture(rendingWebgl.TEXTURE0);
            this.attach();
            rendingWebgl.pixelStorei(rendingWebgl.UNPACK_FLIP_Y_WEBGL,0);
            rendingWebgl.pixelStorei(rendingWebgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0)
            for(let i=0;i<6;i++)
            {
                rendingWebgl.texImage2D(rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, rendingWebgl.RGBA, rendingWebgl.RGBA, rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
            }
            rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_MIN_FILTER, rendingWebgl.LINEAR);
            rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_MAG_FILTER, rendingWebgl.LINEAR);
            rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_WRAP_S, rendingWebgl.CLAMP_TO_EDGE);
            rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_WRAP_T, rendingWebgl.CLAMP_TO_EDGE);
        }

        uploadImage(imagedArr:HTMLImageElement[]|ImageData[],mipmapLevel:number=-1)
        {
            if(mipmapLevel==-1)
            {
                rendingWebgl.activeTexture(GLConstants.TEXTURE0);
                this.attach();
                for(let i=0;i<6;i++)
                {
                    rendingWebgl.texImage2D(rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, rendingWebgl.RGBA, rendingWebgl.RGBA, rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
                }
            }else
            {
                rendingWebgl.activeTexture(GLConstants.TEXTURE0);
                this.attach();
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_WRAP_S, rendingWebgl.CLAMP_TO_EDGE);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_WRAP_T, rendingWebgl.CLAMP_TO_EDGE);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_MIN_FILTER, rendingWebgl.LINEAR_MIPMAP_LINEAR);
                rendingWebgl.texParameteri(rendingWebgl.TEXTURE_CUBE_MAP, rendingWebgl.TEXTURE_MAG_FILTER, rendingWebgl.LINEAR);
                rendingWebgl.pixelStorei(rendingWebgl.UNPACK_FLIP_Y_WEBGL,0);
                rendingWebgl.pixelStorei(rendingWebgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0)

                for(let i=0;i<6;i++)
                {
                    rendingWebgl.texImage2D(rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X+i, mipmapLevel, rendingWebgl.RGBA, rendingWebgl.RGBA, rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
                }
            }
        }

        // onLoadImage(face, image:HTMLImageElement, level:number) {
        //     webgl.activeTexture(GLConstants.TEXTURE0);
        //     this.attach();
        //     webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, false);
        //     webgl.texImage2D(face, level, webgl.RGBA,webgl.RGBA, webgl.UNSIGNED_BYTE, image);
        // }

        public attach(): void { rendingWebgl.bindTexture(rendingWebgl.TEXTURE_CUBE_MAP, this.instance); }
        public detach(): void { rendingWebgl.bindTexture(rendingWebgl.TEXTURE_CUBE_MAP, null); }

        public dispose():void {rendingWebgl.deleteTexture(this.instance)}

    }

}
