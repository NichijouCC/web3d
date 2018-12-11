///<reference path="../common/glconstant.ts" />

namespace webGraph
{
    export class TextureOption
    {
        //---------------pixstore-------------------
        preMultiply_alpha:boolean=false;
        flip_y:boolean=false;
        
        //----------------texParameteri-------------
        max_filter:number=TexFilterEnum.linear;
        min_filter:number=TexFilterEnum.nearest;
        /**
         * 为了uv滚动
         */
        wrap_s:number=TexWrapEnum.repeat;
        wrap_t:number=TexWrapEnum.repeat;
    
        //-----------------------------
        pixelFormat:number=PixelFormat.rgba;
        pixelDatatype:number=PixelDatatype.UNSIGNED_BYTE;
        //------------必须的数据-------------------
        data:Uint8Array|HTMLImageElement;
        // arr:Uint8Array;
        // image:ImageData;
        width:number=1;
        height:number=1;
    
        setPixsStore(preMultiply_alpha:boolean,flip_y:boolean)
        {
            this.preMultiply_alpha=preMultiply_alpha;
            this.flip_y=flip_y;
        }
        setWrap(wrap_s:TexWrapEnum,wrap_t:TexWrapEnum)
        {
            this.wrap_s=wrap_s;
            this.wrap_t=wrap_t;
        }
    
        setFilterModel(maxf:TexFilterEnum,minf:TexFilterEnum)
        {
            this.max_filter=maxf;
            this.min_filter=minf;
        }
    
        setArrayData(data:Uint8Array,width:number,height:number,format:PixelFormat=PixelFormat.rgba,dataType:PixelDatatype=PixelDatatype.UNSIGNED_BYTE)
        {
            this.data=data;
            this.width=width;
            this.height=height;
            this.pixelFormat=format;
            this.pixelDatatype=dataType;
        }
        setImageData(data:HTMLImageElement,format:PixelFormat=PixelFormat.rgba,dataType:PixelDatatype=PixelDatatype.UNSIGNED_BYTE)
        {
            this.data=data;
            this.pixelFormat=format;
            this.pixelDatatype=dataType;  
        }
        setNullImageData(width:number,height:number,format:PixelFormat=PixelFormat.rgba,dataType:PixelDatatype=PixelDatatype.UNSIGNED_BYTE)
        {
            this.data=null;
            this.width=width;
            this.height=height;
            this.pixelFormat=format;
            this.pixelDatatype=dataType;  
        }
    
    
        static getDefFboTextureOp(width:number,height:number):TextureOption
        {
            let op=new TextureOption();
            op.data=null;
            op.width=width;
            op.height=height;
            op.wrap_s=TexWrapEnum.clampToEdge;
            op.wrap_t=TexWrapEnum.clampToEdge;
            return op;
        }
    }
    export enum TexWrapEnum
    {
        clampToEdge=<number>GLConstants.CLAMP_TO_EDGE,
        repeat=GLConstants.REPEAT,
        mirroredRepeat=GLConstants.MIRRORED_REPEAT
    }
    export enum TexFilterEnum
    {
        linear=GLConstants.LINEAR,
        nearest=GLConstants.NEAREST,
        nearest_mipmap_nearest=GLConstants.NEAREST_MIPMAP_NEAREST,
        linear_mipmap_nearest=GLConstants.LINEAR_MIPMAP_NEAREST,
        nearest_mipmap_linear=GLConstants.NEAREST_MIPMAP_LINEAR,
        linear_mipmap_linear=GLConstants.LINEAR_MIPMAP_LINEAR,
    }
    
    export enum  PixelFormat
    {
        depth_component=GLConstants.DEPTH_COMPONENT,
        depth_stencil=GLConstants.DEPTH_STENCIL,
        alpha=GLConstants.ALPHA,
        rgb=GLConstants.RGB,
        rgba=GLConstants.RGBA,
        luminance=GLConstants.LUMINANCE,
        luminance_alpha=GLConstants.LUMINANCE_ALPHA,
        rgb_dxt1=GLConstants.COMPRESSED_RGB_S3TC_DXT1_EXT,
        rgba_dxt1=GLConstants.COMPRESSED_RGBA_S3TC_DXT1_EXT,
        rgba_dxt3=GLConstants.COMPRESSED_RGBA_S3TC_DXT3_EXT,
        rgba_dxt5=GLConstants.COMPRESSED_RGBA_S3TC_DXT5_EXT,
        rgb_pvrtc_2bppv1=GLConstants.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
        rgb_pvrtc_4bppv1=GLConstants.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
        rgba_pvrtc_2bppv1=GLConstants.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
        rgba_pvrtc_4bppv1=GLConstants.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
        rgb_etc1=GLConstants.COMPRESSED_RGB_ETC1_WEBGL
    }
    export enum PixelDatatype
    {
        UNSIGNED_BYTE = GLConstants.UNSIGNED_BYTE,
        UNSIGNED_SHORT = GLConstants.UNSIGNED_SHORT,
        UNSIGNED_INT =GLConstants.UNSIGNED_INT,
        FLOAT =GLConstants.FLOAT,
        UNSIGNED_INT_24_8 = GLConstants.UNSIGNED_INT_24_8,
        UNSIGNED_SHORT_4_4_4_4 = GLConstants.UNSIGNED_SHORT_4_4_4_4,
        UNSIGNED_SHORT_5_5_5_1 = GLConstants.UNSIGNED_SHORT_5_5_5_1,
        UNSIGNED_SHORT_5_6_5 = GLConstants.UNSIGNED_SHORT_5_6_5,
    }
}
