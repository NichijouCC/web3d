namespace web3d.io
{
    export class loadWorkerMgr
    {
        loadworker:Worker;
        constructor(scripteSrc:string)
        {
            this.loadworker=new Worker(scripteSrc);

            this.loadworker.onmessage=(msg:any)=>{
                console.log("mgr receive msg!");
                let data=msg.data;
            }
        }

        postMessage(data:any)
        {
            console.log("mgr post msg!");
            this.loadworker.postMessage(data);
        }

        /**
         * 
         */
        stopworker()
        {
            this.loadworker.terminate();
        }
    }
}