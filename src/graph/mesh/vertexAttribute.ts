namespace webGraph
{
    export enum VertexAttTypeEnum
    {
        Position ="a_pos",
        UV0 ="a_texcoord0",
        Color0 ="a_color",
        BlendIndex4 ="a_blendindex4",
        BlendWeight4 = "a_blendweight4",
        Normal = "a_normal",
        Tangent = "a_tangent",
        UV1 = "a_texcoord1",
        Color1 ="a_color1",
    
        instance_pos ="a_InstancePos",
        instance_scale ="a_InstanceScale",
        instance_rot ="a_InstanceRot",
    }
    
    export enum VertexAttLocationEnum
    {
        Position =1,
        UV0 = 2,
        Color0 =3,
        BlendIndex4 = 4,
        BlendWeight4 =5,
        Normal = 6,
        Tangent = 7,
        UV1 = 8,
        Color1 = 9,
    
        instance_pos=10,
        instance_scale=11,
        instance_rot=12
    }
    export function getCompnentSizeByVertexType(type:VertexAttTypeEnum):number
    {
        switch(type)
        {
            case VertexAttTypeEnum.UV0:
            case VertexAttTypeEnum.UV1:
                return 2;
            case VertexAttTypeEnum.Position:
            case VertexAttTypeEnum.Normal:
            case VertexAttTypeEnum.Tangent:
            case VertexAttTypeEnum.instance_pos:
            case VertexAttTypeEnum.instance_scale:
                return 3;
            case VertexAttTypeEnum.Color0:
            case VertexAttTypeEnum.Color1:
            case VertexAttTypeEnum.BlendIndex4:
            case VertexAttTypeEnum.BlendWeight4:
            case VertexAttTypeEnum.instance_rot:
                return 4;
            default:
                console.error("vertex type error!");
        }
    }
    export class VertexAttribute
    {
        beInstanceAtt:boolean=false;
    
        type:VertexAttTypeEnum;
        location:number;
        componentSize:number;
        componentDataType:number;
        normalize:boolean;
    
        // /**
        //  * typeByte*componentSize(例如:float3=4 * 3)
        //  */
        // byteSize:number;
        // /**
        //  * arraybufferview 中元素的byte间隔
        //  */
        // viewByteStride:number;
    
        // view:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array;
        // data:any[]=[];
        // count:number;
    
        vbo:VertexBuffer;
        /**
         * 构成离散vbo时候设置的属性,对应vertexattributepointer方法
         */
        offsetInBytes:number=0;
        /**
         * 构成离散vbo时候设置的属性,对应vertexattributepointer方法
         */
        strideInBytes:number=0;
    
    
        static PrepareVertexAttribute(type:VertexAttTypeEnum,view:Float32Array,componentSize?:number,byteStride?:number):VertexAttribute
        {
            let att=new VertexAttribute();
            att.type=type;
            att.location=AttributeSetter.getAttLocationByType(type);
            att.componentSize=componentSize;

            att.componentSize=componentSize||getCompnentSizeByVertexType(type);
            att.componentDataType=GLConstants.FLOAT;
            att.normalize=false;

            //att.byteSize=att.componentSize*view.BYTES_PER_ELEMENT;
    
            // let stride=byteStride||att.byteSize;
            //let dataArr=GetDataArr(view,stride,att.componentSize,ViewDataType.FLOAT);
    
            // att.view=view;
            // att.data=dataArr;
            // att.viewByteStride=stride;
            // att.count=dataArr.length;
    
            att.vbo=new webGraph.VertexBuffer();
            att.vbo.bufferData(view);
            if(type==VertexAttTypeEnum.instance_pos||type==VertexAttTypeEnum.instance_rot||type==VertexAttTypeEnum.instance_scale)
            {
                att.beInstanceAtt=true;
            }
            return att;
        }

        static createByType(type:VertexAttTypeEnum,attinfo?:IAttinfo):VertexAttribute
        {
            let att=new VertexAttribute();
            att.type=type;
            att.location=AttributeSetter.getAttLocationByType(type);
            
            if(type==VertexAttTypeEnum.instance_pos||type==VertexAttTypeEnum.instance_rot||type==VertexAttTypeEnum.instance_scale)
            {
                att.beInstanceAtt=true;
            }
            if(attinfo!=null)
            {
                att.componentSize=attinfo.componentSize||getCompnentSizeByVertexType(type);
                att.componentDataType=attinfo.componentDataType||GLConstants.FLOAT;
                att.normalize=attinfo.normalize||false;
            }else
            {
                att.componentSize=getCompnentSizeByVertexType(type);
                att.componentDataType=GLConstants.FLOAT;
                att.normalize=false;
            }
            return att;
        }

    
        /**
         * 动态 vbo
         */
        refreshVboData(vbodata:Float32Array)
        {
            this.vbo.bufferData(vbodata);
        }
    }
    export interface IAttinfo
    {
        componentSize?:number;
        componentDataType?:number;
        normalize?:boolean;
        viewByteStride?:number;
    }


    export enum ViewDataType {
        /**
         * Byte
         */
        BYTE = 5120,
        /**
         * Unsigned Byte
         */
        UNSIGNED_BYTE = 5121,
        /**
         * Short
         */
        SHORT = 5122,
        /**
         * Unsigned Short
         */
        UNSIGNED_SHORT = 5123,
        /**
         * Unsigned Int
         */
        UNSIGNED_INT = 5125,
        /**
         * Float
         */
        FLOAT = 5126,
    }
    
    export function GetDataArr(view:ArrayBufferView,byteStride:number,compoentSize:number,compenttype:ViewDataType=ViewDataType.FLOAT):any[]
    {
        let dataArr:any[]=[];
        let count=view.byteLength/byteStride;
    
        for(let i=0;i<count;i++)
        {
            dataArr.push(GetTypedArry(compenttype,view.buffer,view.byteOffset+i*byteStride,compoentSize));
        }
        return dataArr;
    }
    
    export function GetTypedArry(componentType: ViewDataType,buffer:ArrayBuffer,byteOffset:number,Len:number)
    {
        switch (componentType) 
        {
            case ViewDataType.BYTE: return new Int8Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, Len);
            case ViewDataType.SHORT: return new Int16Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_INT: return new Uint32Array(buffer, byteOffset, Len);
            case ViewDataType.FLOAT: return new Float32Array(buffer, byteOffset, Len);
            default: throw new Error(`Invalid component type ${componentType}`);
        }
    }
    export function GetByteSize(componentType:ViewDataType,componentSize:number):number
    {
        switch (componentType) 
        {
            case ViewDataType.BYTE:
                return componentSize*Int8Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_BYTE:
                return componentSize*Uint8Array.BYTES_PER_ELEMENT;
            case ViewDataType.SHORT:
                return componentSize*Int16Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_SHORT:
                return componentSize*Uint16Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_INT:
                return componentSize*Uint32Array.BYTES_PER_ELEMENT;
            case ViewDataType.FLOAT:
                return componentSize*Float32Array.BYTES_PER_ELEMENT;
            default: throw new Error(`Invalid component type ${componentType}`);
        }
    }
}
