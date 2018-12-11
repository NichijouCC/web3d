namespace web3d
{
    /**
    * 
    * (0,0)-----|
    * |         |
    * |         |
    * |------(w,h)
    * 
    */
    export class GameScreen
    {
        /**
         * 绘制区域宽/高度 像素单位
         */
        private static canvaswidth: number;
        private static canvasheight: number;
        private static apset: number;
    
        /**
         * 屏幕(canvas)高度
         */
        static get Height()
        {
            return GameScreen.canvasheight;
        }
        /**
         * 屏幕(canvas)宽度
         */
        static get Width()
        {
            return GameScreen.canvaswidth;
        }
    
        private static _windowWidth:number;
        private static _windowHeight:number;

        /**
         * 窗口宽度,一般用于html
         */
        static get windowWidth()
        {
            return this._windowWidth;
        }
        /**
         * 窗口高度,一般用于html
         */
        static get windowHeight()
        {
            return this._windowHeight;
        }
        /**
         * width/height
         */
        static get aspect()
        {
            return this.apset;
        }
        //#region canvas resize
        private static scale:number=1;
        /**
         * 修改canvas 缩放
         * 可提升画面效果，消除闪烁(最好用mipmap解决)
         * @param scale 
         */
        static SetCanvasSize(scale:number)
        {
            GameScreen.scale=scale;
            this.OnResizeCanvas();
        }
    
        private static canvas:HTMLCanvasElement;
        static divcontiner:HTMLDivElement;
        static init(canvas:HTMLCanvasElement)
        {
            this.canvas=canvas;
            this.OnResizeCanvas();
            window.onresize=()=>{
                this.OnResizeCanvas();
            }
    
            let divcontiner=document.createElement("div");
            divcontiner.className="divContiner";
            divcontiner.style.overflow="hidden";
            divcontiner.style.left="0px";
            divcontiner.style.top="0px";
            canvas.parentElement.appendChild(divcontiner);
            this.divcontiner=divcontiner;
        }
        private static OnResizeCanvas()
        {
            console.warn("canvas resize!");
            this._windowWidth=window.innerWidth;
            this._windowHeight=window.innerHeight;
    
            let pixelRatio=window.devicePixelRatio||1;
            this.canvaswidth = pixelRatio*this.scale*this._windowWidth;
            this.canvasheight =pixelRatio*this.scale*this._windowHeight;
    
            this.canvas.width =this.canvaswidth;
            this.canvas.height =this.canvasheight;
    
            this.apset=this.canvaswidth/this.canvasheight;
            for(let i=0;i<this.resizeListenerArr.length;i++)
            {
                let fuc=this.resizeListenerArr[i];
                fuc();
            }
        }
        private static resizeListenerArr:Function[]=[];
        static addListenertoCanvasResize(fuc:()=>void)
        {
            this.resizeListenerArr.push(fuc);
        }

        // static windowToCanvas(windowx:number,windowy:number,screenPos:MathD.vec2)
        // {
        //     let bbox = this.canvas.getBoundingClientRect();
        //     screenPos.x=windowx- bbox.left - (bbox.width - this.canvas.width) / 2;
        //     screenPos.y=windowy- bbox.top - (bbox.height - this.canvas.height) / 2;
        // }

    }
}
