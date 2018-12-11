
namespace web3d
{
    export class webworker
    {
        private worker:Worker;
        private static _inc:webworker;
        static get inc():webworker
        {
            if(!this._inc)
            {
                this._inc=new webworker();
            }
            return this._inc;
        } 
    
        private constructor(){
            this.worker=new Worker("");
            this.worker.onmessage=(msg)=>{
                this.onMsg(msg);
            }
        };
        //#region  ------------------利用worker 多线程 加载数据
        //向worker发送消息
        //private WorkerLoad:{[taskid:number]:(state: stateLoad)=>void}={};
        private workerLoad:{[taskid:number]:(data)=>void}={};        
        Load(msg:any,onFinish:(data)=>void=null)
        {
            let taskid=new WebWorkerTaskID();
            msg.id=taskid.getID();
            this.worker.postMessage(msg);
            this.workerLoad[msg.id]=onFinish;
        }
        //接收到worker发来的消息
        private onMsg(msg)
        {
            console.log("assetmgr receive msg: type: "+msg.data.id);
            let onFinish=this.workerLoad[msg.data.id];
            if(onFinish) onFinish(msg.data);
        }
        //#endregion
    }
    
    export class WebWorkerTaskID
    {
        constructor()
        {
            this.id = WebWorkerTaskID.next();
        }
        private static idAll: number = 1;
        private static next(): number
        {
            let next = WebWorkerTaskID.idAll;
            WebWorkerTaskID.idAll++;
            return next;
        }
        private id: number;
        getID(): number
        {
            return this.id;
        }
    }
}
// const worker = new Worker(workerPath);
// console.log(workerPath, worker);
// worker.addEventListener('message', message => {
//     console.log(message);
// });
// worker.postMessage('this is a test message to the worker');

