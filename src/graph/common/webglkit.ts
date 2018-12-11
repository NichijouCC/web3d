namespace webGraph
{
/**
     * @private
     */
    export class caps
    {
        public maxTexturesImageUnits: number;
        public maxTextureSize: number;
        public maxCubemapTextureSize: number;
        public maxRenderTextureSize: number;
        public standardDerivatives: boolean;
        public s3tc: WEBGL_compressed_texture_s3tc;
        public textureFloat: boolean;
        public textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        public maxAnisotropy: number;
        public instancedArrays: ANGLE_instanced_arrays;
        public uintIndices: boolean;
        public highPrecisionShaderSupported: boolean;
        public fragmentDepthSupported: boolean;
        public textureFloatLinearFiltering: boolean;
        public textureLOD: boolean;
        public drawBuffersExtension;
        public pvrtcExtension: any;
    }
    /**
     * @private
     */
    export class webglkit
    {
        private static _maxVertexAttribArray: number = 0;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number)
        {
            
            for (let i = count; i < webglkit._maxVertexAttribArray; i++)
            {
                webgl.disableVertexAttribArray(i);
            }
            webglkit._maxVertexAttribArray = count;
        }
        private static _texNumber: number[] = null;

        static GetTextureNumber(webgl: WebGLRenderingContext, index: number): number
        {
            webglkit.initConst(webgl);
            return webglkit._texNumber[index];
        }
        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static caps: caps = new caps();
        static initConst(webgl: WebGLRenderingContext): void
        {
            if (webglkit._texNumber == null)
            {
                webglkit._texNumber = [];
                webglkit._texNumber.push(webgl.TEXTURE0);
                webglkit._texNumber.push(webgl.TEXTURE1);
                webglkit._texNumber.push(webgl.TEXTURE2);
                webglkit._texNumber.push(webgl.TEXTURE3);
                webglkit._texNumber.push(webgl.TEXTURE4);
                webglkit._texNumber.push(webgl.TEXTURE5);
                webglkit._texNumber.push(webgl.TEXTURE6);
                webglkit._texNumber.push(webgl.TEXTURE7);
                webglkit._texNumber.push(webgl.TEXTURE8);
                webglkit._texNumber.push(webgl.TEXTURE9);

                webglkit.LEQUAL = webgl.LEQUAL;
                webglkit.NEVER = webgl.NEVER;
                webglkit.EQUAL = webgl.EQUAL;
                webglkit.GEQUAL = webgl.GEQUAL;
                webglkit.NOTEQUAL = webgl.NOTEQUAL;
                webglkit.LESS = webgl.LESS;
                webglkit.GREATER = webgl.GREATER;
                webglkit.ALWAYS = webgl.ALWAYS;

                webglkit.FUNC_ADD = webgl.FUNC_ADD;
                webglkit.FUNC_SUBTRACT = webgl.FUNC_SUBTRACT;
                webglkit.FUNC_REVERSE_SUBTRACT = webgl.FUNC_REVERSE_SUBTRACT;


                webglkit.ONE = webgl.ONE;
                webglkit.ZERO = webgl.ZERO;
                webglkit.SRC_ALPHA = webgl.SRC_ALPHA;
                webglkit.SRC_COLOR = webgl.SRC_COLOR;
                webglkit.ONE_MINUS_SRC_ALPHA = webgl.ONE_MINUS_SRC_ALPHA;
                webglkit.ONE_MINUS_SRC_COLOR = webgl.ONE_MINUS_SRC_COLOR;
                webglkit.ONE_MINUS_DST_ALPHA = webgl.ONE_MINUS_DST_ALPHA;
                webglkit.ONE_MINUS_DST_COLOR = webgl.ONE_MINUS_DST_COLOR;

                // Extensions
                //这个扩展会影响bump
                webglkit.caps.standardDerivatives = (webgl.getExtension('OES_standard_derivatives') !== null);
                webglkit.caps.pvrtcExtension = webgl.getExtension('WEBGL_compressed_texture_pvrtc');
                //各种扩展
                // webglkit.caps.s3tc = webgl.getExtension('WEBGL_compressed_texture_s3tc');
                // webglkit.caps.textureFloat = (webgl.getExtension('OES_texture_float') !== null);
                // webglkit.caps.textureAnisotropicFilterExtension = webgl.getExtension('EXT_texture_filter_anisotropic') || webgl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || webgl.getExtension('MOZ_EXT_texture_filter_anisotropic');
                // webglkit.caps.maxAnisotropy = webglkit.caps.textureAnisotropicFilterExtension ? webgl.getParameter(webglkit.caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
                // webglkit.caps.instancedArrays = webgl.getExtension('ANGLE_instanced_arrays');
                // webglkit.caps.uintIndices = webgl.getExtension('OES_element_index_uint') !== null;
                // webglkit.caps.fragmentDepthSupported = webgl.getExtension('EXT_frag_depth') !== null;
                // webglkit.caps.highPrecisionShaderSupported = true;
                // webglkit.caps.drawBuffersExtension =webgl.getExtension('WEBGL_draw_buffers');
                // webglkit.caps.textureFloatLinearFiltering = webgl.getExtension('OES_texture_float_linear');
                // webglkit.caps.textureLOD = webgl.getExtension('EXT_shader_texture_lod');
            }
        }
    }
}

