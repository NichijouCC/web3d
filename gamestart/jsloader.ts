namespace game
{
    export class Jsloader
    {
        private static instance:Jsloader;
    
        public static get ins()
        {
            if(this.instance==null)
            {
                this.instance=new Jsloader();
            }
            return this.instance;
        }
        private LoadList:string[]=[];
        addScripte(src:string)
        {
            this.LoadList.push(src);
        }
        private onComplete:()=>void;
        private onState:(taskDone:number,tottalTask:number)=>void;
        preload(onComplete:()=>void,onState:(taskDone:number,tottalTask:number)=>void=null)
        {
            this.onComplete=onComplete;
            this.onState=onState;
    
            let perFinish=()=>{
                if(this.LoadList.length<=0)
                {
                    this.onComplete();
                }else
                {
                    let s = this.LoadList.shift();
                    this.loadJsFile(s,perFinish);
                }
            }
    
            if(this.LoadList.length>0)
            {
                let s = this.LoadList.shift();
                this.loadJsFile(s,perFinish);
            }
        }
        loadJsFile(src:string,onComplete:()=>void)
        {
            let script = document.createElement("script");
            script.src = src;
            script.onload =()=>{
                if(onComplete)
                {
                    onComplete();
                }
            }
            script.onerror =(ev)=>{
                let error = "load Script Error \r\n no file:" + ev.srcElement.baseURI;
                alert(error);
            }
            document.head.appendChild(script);
        }
    }
}
