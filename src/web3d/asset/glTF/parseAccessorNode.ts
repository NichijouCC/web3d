namespace web3d
{
    export class AccessorNode
    {
        view:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array;//需要？
        componentSize:number;
        componentType:number;
        /**
         * 元素间的间隔
         */
        byteStride:number;
        // viewStride:number;
        /**
         * typeByte*componentSize
         */
        byteSize:number;
        count:number;
        data:any[]=[];
    }
    
    export class parseAccessorNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<AccessorNode>
        {
            // return new Promise<AccessorNode>((resolve,reject)=>{
                let accessor=loader.bundle.gltf.accessors[index];
                let node=new AccessorNode();
                node.componentSize=this.getComponentSize(accessor.type);
    
                node.componentType=accessor.componentType;
                node.count=accessor.count;
                node.byteSize=this.getByteSize(node.componentType,node.componentSize);
    
                let bufferdata:Promise<BufferviewNode>;
                if(accessor.bufferView!=null)
                {
                    bufferdata=ParseBufferViewNode.parse(accessor.bufferView,loader);
                }else
                {
                    let viewdata=new BufferviewNode();
                    viewdata.view=this.GetTyedArryByLen(accessor.componentType,accessor.count);
                    bufferdata=Promise.resolve(viewdata);
                };
                return bufferdata.then((viewnode)=>{
    
                    let byteoffset=accessor.byteOffset||0;
                    node.view=this.GetTypedArry(node.componentType,viewnode.view,byteoffset,node.componentSize*accessor.count);
                    node.byteStride=viewnode.byteStride||node.byteSize;
                    for(let i=0;i<node.count;i++)
                    {
                        let value=this.GetTypedArry(node.componentType,node.view,i*node.byteStride,node.componentSize);
                        node.data.push(value);
                    }
    
                    if(accessor.sparse)
                    {
                        let sparseNode=accessor.sparse;
    
                        let indexPromise=ParseBufferViewNode.parse(sparseNode.indices.bufferView,loader);
                        let valuePromise=ParseBufferViewNode.parse(sparseNode.values.bufferView,loader);
    
                        Promise.all([indexPromise,valuePromise]).then(([indexViewNode,dataViewNode])=>{
    
                            let indexArr=this.GetTypedArry(sparseNode.indices.componentType,indexViewNode.view,sparseNode.indices.byteOffset,sparseNode.count);
                            let dataArr=this.GetTypedArry(accessor.componentType,dataViewNode.view,sparseNode.values.byteOffset,sparseNode.count);
                            for(let i=0;i<indexArr.length;i++)
                            {
                                let index=indexArr[i]*node.componentSize;
                                for(let k=0;k<node.componentSize;k++)
                                {
                                    viewnode.view[index+k]=dataArr[index+k];
                                }
                            }
    
                            return node;
                        });
                    }else
                    {
                        return node;
                    }
                });
            // });
        }
        static GetTyedArryByLen(componentType: AccessorComponentType,Len:number)
        {
            switch (componentType) 
            {
                case AccessorComponentType.BYTE: return new Int8Array(Len);
                case AccessorComponentType.UNSIGNED_BYTE: return new Uint8Array(Len);
                case AccessorComponentType.SHORT: return new Int16Array(Len);
                case AccessorComponentType.UNSIGNED_SHORT: return new Uint16Array(Len);
                case AccessorComponentType.UNSIGNED_INT: return new Uint32Array(Len);
                case AccessorComponentType.FLOAT: return new Float32Array(Len);
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
    
        static GetTypedArry(componentType: AccessorComponentType,bufferview:ArrayBufferView,byteOffset:number,Len:number)
        {
            let buffer=bufferview.buffer;
            byteOffset=bufferview.byteOffset+ (byteOffset||0);
            switch (componentType) 
            {
                case AccessorComponentType.BYTE: return new Int8Array(buffer, byteOffset, Len);
                case AccessorComponentType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, Len);
                case AccessorComponentType.SHORT: return new Int16Array(buffer, byteOffset, Len);
                case AccessorComponentType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, Len);
                case AccessorComponentType.UNSIGNED_INT: return new Uint32Array(buffer, byteOffset, Len);
                case AccessorComponentType.FLOAT:
                {
                    if((byteOffset/4)%1!=0)
                    {
                        console.error("??");
                    }
                    return new Float32Array(buffer, byteOffset, Len);
                }
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
    
        private static getComponentSize(type:string):number
        {
            switch(type)
            {
                case "SCALAR":
                    return 1;
                case "VEC2": 
                    return 2;
                case "VEC3": 
                    return 3;
                case "VEC4":
                case "MAT2":
                    return 4;
                case "MAT3":
                    return 9;
                case "MAT4":
                    return 16;
            }
        }
    
        // private static GetByteStrideFromType(type:string): number {
        //     // Needs this function since "byteStride" isn't requiered in glTF format
        //     switch (type) {
        //         case "VEC2": return 2*4;
        //         case "VEC3": return 3*4;
        //         case "VEC4": return 4*4;
        //         case "MAT2": return 4*4;
        //         case "MAT3": return 9*4;
        //         case "MAT4": return 16*4;
        //         default: return 1*4;
        //     }
        // }
    
        // private static getViewStride(componentType:number,byteStride:number):number
        // {
        //     switch (componentType) 
        //     {
        //         case AccessorComponentType.BYTE:
        //             return byteStride/Int8Array.BYTES_PER_ELEMENT;
        //         case AccessorComponentType.UNSIGNED_BYTE:
        //             return byteStride/Uint8Array.BYTES_PER_ELEMENT;
        //         case AccessorComponentType.SHORT:
        //             return byteStride/Int16Array.BYTES_PER_ELEMENT;
        //         case AccessorComponentType.UNSIGNED_SHORT:
        //             return byteStride/Uint16Array.BYTES_PER_ELEMENT;
        //         case AccessorComponentType.UNSIGNED_INT:
        //             return byteStride/Uint32Array.BYTES_PER_ELEMENT;
        //         case AccessorComponentType.FLOAT:
        //             return byteStride/Float32Array.BYTES_PER_ELEMENT;
        //         default: throw new Error(`Invalid component type ${componentType}`);
        //     }
        // }
    
        private static getByteSize(componentType:number,componentSize:number):number
        {
            switch (componentType) 
            {
                case AccessorComponentType.BYTE:
                    return componentSize*Int8Array.BYTES_PER_ELEMENT;
                case AccessorComponentType.UNSIGNED_BYTE:
                    return componentSize*Uint8Array.BYTES_PER_ELEMENT;
                case AccessorComponentType.SHORT:
                    return componentSize*Int16Array.BYTES_PER_ELEMENT;
                case AccessorComponentType.UNSIGNED_SHORT:
                    return componentSize*Uint16Array.BYTES_PER_ELEMENT;
                case AccessorComponentType.UNSIGNED_INT:
                    return componentSize*Uint32Array.BYTES_PER_ELEMENT;
                case AccessorComponentType.FLOAT:
                    return componentSize*Float32Array.BYTES_PER_ELEMENT;
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
    
        private static isInteger(obj) {
            return typeof obj === 'number' && obj%1 === 0
           }
    
    
    }
}
