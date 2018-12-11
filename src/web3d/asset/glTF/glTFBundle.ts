namespace web3d
{
    export class glTFBundle extends Web3dAsset
    {
        static BeUsePBRMaterial=false;
    
        gltf:IGLTF;
        rootURL:string;
    
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url);
            this.type="glTFBundle";
            let index=url.lastIndexOf("/");
            let dirpath=url.substring(0,index);
            this.rootURL=dirpath;
        }
        meshNodeCache:{[index:number]:PrimitiveNode[]}={};
        skinNodeCache:{[index:number]:SkinNode}={};
        bufferviewNodeCache:{[index:number]:BufferviewNode}={};  
        bufferNodeCache:{[index:number]:ArrayBuffer}={};
        materialNodeCache:{[index:number]:Material}={};
        textrueNodeCache:{[index:number]:Texture}={};
        beContainAnimation:boolean=false;
        animationNodeCache:{[index:number]:AnimationClip}={};
    
        //------------
        bundleAnimator:Animation;
        nodeDic:{[index:number]:Transform}={};
        /**
         * 实例化一个对象出来
         * 实例化过程：----（资源已加载好）---》建立场景树结构（在nodedic中存储映射关系）---》资源(animtion、skin)中nodeindex 需要指引到新的transform上去
         */
        Instantiate():Transform
        {
            let gltf=this.gltf;
            let sceneindex=gltf.scene;
            if(sceneindex==null) return null;
            if(gltf.scenes==null) return null;
            let sceneRoot=new GameObject();
            if(this.beContainAnimation)
            {
                this.bundleAnimator=sceneRoot.addComponent<Animation>("Animator");
                for(let key in this.animationNodeCache)
                {
                    let clip=this.animationNodeCache[key];
                    this.bundleAnimator.addClip(clip);
                }
            }
            
            let scene=gltf.scenes[sceneindex];
            for(let k=0;k<scene.nodes.length;k++)
            {
                let nodeIndex=scene.nodes[k];
                if(gltf.nodes==null) return;
                let trans=ParseSceneNode.parse(nodeIndex,this);
                sceneRoot.transform.addChild(trans);
            }
            return sceneRoot.transform;
        }
        dispose()
        {
            
        }
    }
}
