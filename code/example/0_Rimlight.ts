namespace dome
{   /*
    *-------------------------------描边-----------------
     */
    export class rimlight implements IState
    {
        start() 
        {
            throw new Error("Method not implemented.");
        }
        update(delta: number) 
        {
            throw new Error("Method not implemented.");
        }

        
        private loadmodel()
        {
            let long=web3d.assetMgr.load("resource/prefab/elong/resources/elong_elong.mesh.bin") as web3d.Mesh;
            let mat=web3d.assetMgr.load("resource/prefab/elong/resources/1525_firedragon02_d.mat.json") as web3d.Material;

            let trans=new web3d.Transform();
            let meshr=trans.gameObject.addComponent(web3d.SkinMeshRender.type) as web3d.SkinMeshRender;
            meshr.material=mat;
            meshr.mesh=long;
            web3d.curScene.addChild(trans);

        }
        
    }
}