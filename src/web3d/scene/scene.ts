
namespace web3d
{
    export class Scene
    {
        name: string;
        private rootNode: Transform= new GameObject().transform;
        // renderCameras: Camera[] = [];//需要camera class 
        // renderLights: light[] = [];//需要光源 class
        lightmaps: Texture[] = [];//lightmap
        
        // mainCamera: Camera = null;
        // public get mainCamera()
        //  {
        //     if(this._mainCamera == null)
        //     {
        //         this._mainCamera = this.renderCameras[0];
        //     }
        //      return this._mainCamera;
        // }
        // public set mainCamera(_camera: Camera) {
        //     this._mainCamera = _camera;
        // }
    
    
        update(delta: number)
        {
            // webgl.depthMask(true);
            // webgl.clearColor(1, 0, 1, 1);
            // webgl.clearDepth(1.0);
            // webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    
            //更新矩阵
            // this.rootNode.updateTran();
            
           // this.rootNode.updateAABBChild();//更新完tarn再更新子物体aabb 确保每个transform的aabb正确
    
            // renderMgr.renderlistall.clear();
    
            // this.collectCameraAndLight(this.rootNode);
    
            //gameobject start/update
            this.updateGameObject(this.rootNode, delta);
            Canvas.inc.update(delta);
    
            renderMgr.renderScene(this);
            Canvas.inc.render();
    
            webgl.flush();
        }
    
        // private updateScene(node: Transform, delta)
        // {
        //     this.objupdate(node,delta);
        // }
    
        private updateGameObject(node: Transform, delta:number)
        {
            node.gameObject.start();//组件还未初始化的初始化
            node.gameObject.update(delta);
            
            for (let i = 0,len=node.children.length; i < len; i++)
            {
                this.updateGameObject(node.children[i], delta);
            }
        }
        // private collectCameraAndLight(node: Transform)
        // {
        //     if(!node.gameObject.beVisible) return;
        //     //收集摄像机
        //     if (node.gameObject.camera)
        //     {
        //         this.renderCameras.push(node.gameObject.camera);
        //     }
        //     //收集灯光
        //     if (node.gameObject.light)
        //     {
        //         this.renderLights.push(node.gameObject.light);
        //     }
        //     for (let i = 0,len=node.children.length; i < len; i++)
        //     {
        //         this.collectCameraAndLight(node.children[i]);
        //     }
        // }
    
        addChild(node: Transform|Transform2D)
        {
            if(node instanceof Transform)
            {
                this.rootNode.addChild(node);
            }else
            {
                Canvas.inc.addChild(node);
            }
        }
        removeChild(node: Transform)
        {
            this.rootNode.removeChild(node);
        }
        getChild(index: number): Transform
        {
            return this.rootNode.children[index];
        }
        getChilds(): Transform[]
        {
            return this.rootNode.children;
        }
        getChildCount(): number
        {
            return this.rootNode.children.length;
        }
        
        /**
         * 根据name获取child
         */
        getChildByName(name: string): Transform
        {
            let res = this.rootNode.find(name);
            return res;
        }
        
        /**
         * 获取场景根节点
         */
        getRoot()
        {
            return this.rootNode;
        }
    
        enableFog()
        {
            renderMgr.globalDrawType=renderMgr.globalDrawType|DrawTypeEnum.FOG;
        }
        disableFog()
        {
            renderMgr.globalDrawType=renderMgr.globalDrawType&DrawTypeEnum.NOFOG;
        }
        enableLightMap()
        {
            renderMgr.globalDrawType=renderMgr.globalDrawType|DrawTypeEnum.LIGHTMAP;
        }
        disableLightMap()
        {
            renderMgr.globalDrawType=renderMgr.globalDrawType&DrawTypeEnum.NOLIGHTMAP;
        }
    
        enableSkyBox()
        {
            SkyBox.setActive(true);
        }
        disableSkyBox()
        {
            SkyBox.setActive(false);
        }   
    }
}
