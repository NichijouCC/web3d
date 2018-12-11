namespace web3d
{
    export class BufferviewNode
    {
        view:ArrayBufferView;
        byteStride?:number;
        
    }
    
    export class ParseBufferViewNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<BufferviewNode>
        {
            let bundle=loader.bundle;
            if(bundle.bufferviewNodeCache[index])
            {
                return Promise.resolve(bundle.bufferviewNodeCache[index]);
            }else
            {
                
                let bufferview=bundle.gltf.bufferViews[index];
                let node=new BufferviewNode();
                if(bufferview.byteStride!=null)
                {
                    node.byteStride=bufferview.byteStride;
                }
                let bufferindex=bufferview.buffer;
                return ParseBufferNode.parse(bufferindex,loader).then((buffer)=>{
                    node.view=new Uint8Array(buffer,bufferview.byteOffset,bufferview.byteLength);
                    //---------------add to cache
                    bundle.bufferviewNodeCache[index]=node;
                    return node;
                });
    
            }
    
            
    
    
        }
    }
}
