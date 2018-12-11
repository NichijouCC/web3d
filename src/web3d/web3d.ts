namespace web3d
{
    /**
     * 引擎的主入口
     */
    export class application
    {
        private version: string = "v0.0.1";
        private build: string = "b000010";

        webgl: WebGLRenderingContext;
        container:HTMLDivElement;

        /**
         * 引擎的启动方法
         * @param div 绘制区域的dom
         */
        start(div: HTMLDivElement)
        {
            console.log("version: " + this.version + "  build: " + this.build);
            div.style.overflow="hidden";
            //-----------初始化canvas
            this.container=div;
            let canvas = document.createElement("canvas");
            div.appendChild(canvas);
            canvas.style.position = "absolute";
            canvas.style.width = "100%";
            canvas.style.height = "100%";

            this.boost(canvas);
        }
        /**
         * 微信启动
         */
        startByWxPlatform()
        {
            let canvas = document.createElement("canvas");
            this.boost(canvas);
        }
        private boost(canvas:HTMLCanvasElement)
        {
            GameScreen.init(canvas);
            //-----------init webgl;
            this.webgl = <WebGLRenderingContext>canvas.getContext("webgl", {
                premultipliedAlpha: false,alpha:false,stencil:true // 请求非预乘阿尔法通道
            });
            //----------初始化 scene
            //this.initScene();
            //----------初始化 各种全局变量
            new GlobalMgr(this);
            //---------loop 循环 update-draw
            GameTimer.Init();
            GameTimer.OnUpdate=(delta)=>{this.Loop(delta)};
            GameTimer.addListenToTimerUpdate((delta)=>{
                if(StateMgr.stats!=null)
                {
                    StateMgr.stats.update();
                }
            });
        }


        /**
         * 全局update驱动
         * delta 单位秒
         */             
        private Loop(delta: number)
        {
            this.updateUserCode(delta);
            //this.updateEditorCode(delta);
            sceneMgr.update(delta);
        }

        //#region  usercode 管控
        //用户控制层代码，逻辑非常简单，就是给用户一个全局代码插入的机会，update不受场景切换的影响
        private _userCode: IUserCode[] = [];
        private _userCodeNew: IUserCode[] = [];

        private updateUserCode(delta: number)
        {
            //add new code;
            for (let i = this._userCodeNew.length - 1; i >= 0; i--)
            {
                let c = this._userCodeNew[i];
                if (c.isClosed() == false)
                {
                    c.onStart(this);
                    this._userCode.push(c);
                    this._userCodeNew.splice(i, 1);
                }
            }
            //update logic
            let closeindex = -1;
            for (let i = 0; i < this._userCode.length; i++)
            {
                let c = this._userCode[i];
                if (c.isClosed() == false)
                {
                    c.onUpdate(delta);
                }
                else if (closeindex < 0)
                {
                    closeindex = i;
                }
            }
            //remove closed
            if (closeindex >= 0)
            {
                this._userCode.splice(closeindex, 1);
            }
        }
        /**
         * 直接添加usercode实例
         */
        private addUserCodeDirect(program: IUserCode)
        {
            this._userCodeNew.push(program);
        }
        /**
         * 根据classname添加usercode
         */
        addUserCode(classname: string)
        {
            let code=creatUserCode(classname);
            if(code)
            {
                this.addUserCodeDirect(code);                
            }
        }
        //#endregion

    }
    /**
     * usercode接口
     */
    export interface IUserCode
    {
        onStart(app: application);
        //以秒为单位的间隔
        onUpdate(delta: number);
        isClosed(): boolean;
    }
    /**
     * editorcode接口
     */
    export interface IEditorCode
    {
        onStart(app: application);
        //以秒为单位的间隔
        onUpdate(delta: number);
        isClosed(): boolean;
    }


}

