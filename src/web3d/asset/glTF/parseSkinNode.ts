namespace web3d
{
    export class SkinNode
    {
        // joints:string[]=[];
        // joints:Transform[]=[];
        jointIndexs:number[]=[];
        // jointDic:{[name:string]:Transform}={};
        inverseBindMat:MathD.mat4[]=[];
    }
    
    export class ParseSkinNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<SkinNode>
        {
            let bundle=loader.bundle;
            let data=new SkinNode();
            let node=bundle.gltf.skins[index];
            data.jointIndexs=node.joints;
            
            if(node.inverseBindMatrices!=null)
            {
               return parseAccessorNode.parse(node.inverseBindMatrices,loader).then((accessordata)=>{
    
                    // let matdata=accessordata.view as Float32Array;
                    // for(let i=0;i<node.joints.length;i++)
                    // {
                    //     let mat=MathD.mat4.create();
                    //     for(let k=0;k<16;k++)
                    //     {
                    //         mat[k]=matdata[i*16+k];
                    //     }
                    //     data.inverseBindMat.push(mat);
                    // }
    
                    data.inverseBindMat=accessordata.data;
                    bundle.skinNodeCache[index]=data;
                    return data;
                });
            }else
            {
                for(let i=0;i<node.joints.length;i++)
                {
                    let mat=MathD.mat4.create();
                    data.inverseBindMat.push(mat); 
                }
                bundle.skinNodeCache[index]=data;
                return Promise.resolve(data);
            }
        }
    }
}
