namespace web3d
{
    export enum MouseKeyEnum
    {
        Left="MouseLeft",
        Middle="MouseMiddle",
        Right="MouseRight",//
        None="MouseNone"
    }
    export enum MouseEventEnum
    {
        Up="mouseUp",
        Down="mouseDown",
        Move="mouseMove",
        Rotate="mouseRotate"
    }

    export class ClickEvent
    {
        /**
         * 屏幕坐标 posx
         */
        pointx:number;
        /**
         * 屏幕坐标 posy
         */
        pointy:number;
        /**
         * 滚轮
         */
        rotateDelta?:number;

        movementX :number;
        movementY :number;
    }

    export class Mouse
    {
        static StateInfo:{[key:number]:boolean}={};
        static MouseEvent:{[key:string]:{[type:number]:Function[]}}={};
    
        private static readonly keyDic:{[key:number]:MouseKeyEnum}={};
        static init()
        {
            this.keyDic[0]=MouseKeyEnum.Left;
            this.keyDic[1]=MouseKeyEnum.Middle;
            this.keyDic[2]=MouseKeyEnum.Right;
    
            /**
             * 屏蔽网页原生鼠标事件
             */
            document.oncontextmenu= (e)=>{ 
                return false;
            } 
    
            // app.webgl.canvas.onmousedown=(ev: MouseEvent) => {
            //     this.OnMouseDown(ev);
            // };
            // app.webgl.canvas.onmouseup=(ev: MouseEvent) => {
            //     this.OnMouseUp(ev);
            // };
            // app.webgl.canvas.onmousemove=(ev: MouseEvent) => {
            //     this.OnMouseMove(ev);
            // };
            // app.webgl.canvas.onmousewheel=(ev: MouseEvent) => {
            //     this.OnMouseWheel(ev);
            // };
            // app.webgl.canvas.onmouseout=(ev: MouseEvent) => {
            //     this.OnMouseOut(ev);
            // };
    
            // app.webgl.canvas.onmouseenter=(ev: MouseEvent) => {
            //     this.OnMouseEnter(ev);
            // };


            app.webgl.canvas.addEventListener("mousedown",(ev: MouseEvent) => {
                let key = ev.button;
                let keyEnum=this.keyDic[key];
                this.StateInfo[keyEnum]=true;

                let event=this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(keyEnum,MouseEventEnum.Down,event);
                this.executeMouseEvent(MouseKeyEnum.None,MouseEventEnum.Up,event);
            });

            app.webgl.canvas.addEventListener("mouseup",(ev: MouseEvent) => {
                let key = ev.button;
                let keyEnum=this.keyDic[key];
                this.StateInfo[keyEnum]=false;

                let event=this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(keyEnum,MouseEventEnum.Up,event);
                this.executeMouseEvent(MouseKeyEnum.None,MouseEventEnum.Up,event);
            });

            app.webgl.canvas.addEventListener("mousemove",(ev: MouseEvent) => {
                let event=this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(MouseKeyEnum.None,MouseEventEnum.Move,event);
            });

            app.webgl.canvas.addEventListener("mousewheel",(ev: MouseEvent) => {
                let event=this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(MouseKeyEnum.None,MouseEventEnum.Rotate,event);
            });


        }
    
        
        private static executeMouseEvent(key:MouseKeyEnum,event:MouseEventEnum,ev:ClickEvent)
        {
            if(this.MouseEvent[key]==null) return;
            let funcArr=this.MouseEvent[key][event];
            if(funcArr==null) return;
            for(let key in funcArr)
            {
                let func=funcArr[key];
                func(ev);
            }
        }

        private static getClickEventByMouseEvent(ev: any):ClickEvent
        {
            let event=new ClickEvent();
            event.pointx=ev.offsetX;//鼠标指针相对于目标节点内边位置的X坐标
            event.pointy=ev.offsetY;//鼠标指针相对于目标节点内边位置的Y坐标

            Input.mousePosition.x=ev.offsetX;
            Input.mousePosition.y=ev.offsetY;

            event.movementX=ev.movementX;
            event.movementY=ev.movementY;

            event.rotateDelta=ev.detail|ev.wheelDelta;
            return event;
        }
    }
}
