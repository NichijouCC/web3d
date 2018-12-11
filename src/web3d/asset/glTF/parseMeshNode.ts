namespace web3d
{
    export class ParseMeshNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<PrimitiveNode[]>
        {
            let bundle=loader.bundle;
            if(bundle.meshNodeCache[index])
            {
                return Promise.resolve(bundle.meshNodeCache[index]);
            }else
            {
                let node=bundle.gltf.meshes[index];
                let dataArr:Promise<PrimitiveNode>[]=[];
                if(node.primitives)
                {
                    for(let key in node.primitives)
                    {
                        let primitive=node.primitives[key];
                        let data=ParsePrimitiveNode.parse(primitive,loader);
                        dataArr.push(data);
                    }
                }
                let task=Promise.all(dataArr);
                task.then((value)=>{
                    //---------------add to cache
                    bundle.meshNodeCache[index]=value;
                })
                return task;
            }
        }
    }
    
}
