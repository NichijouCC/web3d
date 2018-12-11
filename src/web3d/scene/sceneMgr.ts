namespace web3d
{
    export declare let curScene:Scene;
    /**
     * 可以同时有多个场景.每个场景的render互相独立。
     */
    export class SceneMgr
    {
        scenes:Scene[]=[];
        constructor()
        {
            let defscene=new Scene();
            this.scenes.push(defscene);
            curScene=defscene;
        }
    
        update(delta:number)
        {
            for(let key in this.scenes)
            {
                this.scenes[key].update(delta);
            }
        }
    
        openScene(url:string)
        {
            this.scenes.length=0;
            assetMgr.load(url,(asset,state)=>{
                let sceneInfo=asset as SceneInfo;
                
            });
        }
        openExtralScene(url:string)
        {
            
        }
    
        
    }
}
