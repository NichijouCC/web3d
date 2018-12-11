namespace web3d
{
    export enum KeyCodeEnum
    {
        A="A",
        B="B",
        C="C",
        D="D",
        E="E",
        F="F",
        G="G",
        H="H",
        I="I",
        J="J",
        K="K",
        L="L",
        M="M",
        N="N",
        O="O",
        P="P",
        Q="Q",
        R="R",
        S="S",
        T="T",
        U="U",
        V="V",
        W="W",
        X="X",
        Y="Y",
        Z="Z",
        SPACE=" ",
        ESC="ESC"
    }
    export enum KeyCodeEventEnum
    {
        Up="KeyUp",
        Down="KeyDown",
    }
    
    export class Keyboard
    {
        private static readonly KeyCodeDic:{[keycode:number]:string}={};
    
        static StateInfo:{[key:string]:boolean}={};
        static KeyEvent:{[key:string]:{[evetType:string]:Function[]}}={};
        static anyKeyEvent:{[evetType:string]:Function[]}={};
    
        private static keyDic:{[key:number]:string}={};
        static init()
        {
            this.initKeyCodeMap();
            
            document.onkeydown=(ev: KeyboardEvent) => {
                this.OnKeyDown(ev);
            }
            document.onkeyup=(ev: KeyboardEvent) => {
                this.OnKeyUp(ev);
            }
    
            // document.addEventListener("keydown", (ev: KeyboardEvent) => {
            //     this.OnKeyDown(ev);
            // }, false);
            // document.addEventListener("keyup", (ev: KeyboardEvent) => {          
            //     this.OnKeyUp(ev);
            // }, false);
        }
    
        private static OnKeyDown(ev: KeyboardEvent)
        {
            let key=ev.keyCode;
            let keystr=ev.key.toUpperCase();//safari浏览器不支持keypress事件中的key属性
            this.StateInfo[keystr]=true;
            this.executeKeyboardEvent(keystr,KeyCodeEventEnum.Down,ev);
    
            this.excuteAnyKeyEvent(KeyCodeEventEnum.Down,ev);
        }
    
        private static OnKeyUp(ev: KeyboardEvent)
        {
            let key=ev.keyCode;
            let keystr=ev.key.toUpperCase();//safari浏览器不支持keypress事件中的key属性
            this.StateInfo[keystr]=false;
            this.executeKeyboardEvent(keystr,KeyCodeEventEnum.Up,ev);
    
            this.excuteAnyKeyEvent(KeyCodeEventEnum.Up,ev);
        }
    
        private static executeKeyboardEvent(key:string,event:KeyCodeEventEnum,ev:KeyboardEvent)
        {
            if(this.KeyEvent[key]==null) return;
            let funcArr=this.KeyEvent[key][event];
            for(let key in funcArr)
            {
                let func=funcArr[key];
                func(ev);
            }
        }
        private static excuteAnyKeyEvent(event:KeyCodeEventEnum,ev:KeyboardEvent)
        {
            let fucArr=this.anyKeyEvent[event];
            if(fucArr==null) return;
            for(let key in fucArr)
            {
                let func=fucArr[key];
                func(ev);
            }
        }
        private static initKeyCodeMap()
        {
            this.KeyCodeDic[65]="A";
            this.KeyCodeDic[66]="B";
            this.KeyCodeDic[67]="C";
            this.KeyCodeDic[68]="D";
            this.KeyCodeDic[69]="E";
            this.KeyCodeDic[70]="F";
            this.KeyCodeDic[71]="G";
            this.KeyCodeDic[72]="H";
            this.KeyCodeDic[73]="I";
            this.KeyCodeDic[74]="J";
            this.KeyCodeDic[75]="K";
            this.KeyCodeDic[76]="L";
            this.KeyCodeDic[77]="M";
            this.KeyCodeDic[78]="N";
            this.KeyCodeDic[79]="O";
            this.KeyCodeDic[80]="P";
            this.KeyCodeDic[81]="Q";
            this.KeyCodeDic[82]="R";
            this.KeyCodeDic[83]="S";
            this.KeyCodeDic[84]="T";
            this.KeyCodeDic[85]="U";
            this.KeyCodeDic[86]="V";
            this.KeyCodeDic[87]="W";
            this.KeyCodeDic[88]="X";
            this.KeyCodeDic[89]="Y";
            this.KeyCodeDic[90]="Z";
            this.KeyCodeDic[32]="SPACE";
            this.KeyCodeDic[27]="ESC";
        }
    }
    
}
