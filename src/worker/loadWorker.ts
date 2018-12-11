namespace web3d.io
{

    onmessage = function (msg) {
        //console.log("webworker receive msg: type: "+msg.data.type);
        console.log("webworker receive msg: url: "+msg.data.url);
        web3d.io.loadTool.ins.load(msg);
    }
    function postMsg(msg,transferList=null)
    {
        if(transferList==null)
        {
            (postMessage as any)(msg);            
        }else
        {
            (postMessage as any)(msg,transferList);
        }

        // let someData1=new Float32Array(10);
        // let someData2=new Float32Array(10);
        // postMessage({
        //     data1: someData1, // Float32Array
        //     data2: someData2, // Float32Array
        //     data3: someSmallData // normal Object
        // },
        // [someData1.buffer, someData2.buffer]);
    }

    export class loadTool
    {
        private static _ins:loadTool;
        public static get ins()
        {
            if(this._ins==null)
            {
                this._ins=new loadTool();
            }
            return this._ins;
        }


        load(msg:MessageEvent)
        {
            let taskid=msg.data.id;

            switch(msg.data.type)
            {
                case "loadMeshData":
                    web3d.io.loadArrayBuffer("../"+msg.data.url,(_buffer,err)=>{
                        if(err!=null)
                        {
                            postMsg(
                                {
                                    id:taskid,
                                    iserror:true,
                                    errorcontent:err.message
                                }
                            );
                        }else
                        {
                            //let data=web3d.io.loadMeshData(_buffer);
                            // data["id"]=taskid;
                            // postMsg(
                            //     data,[data.vboarr.buffer,data.eboarr.buffer]
                            // );
                        }
                    });
                    break;
                case "LoadAniclip":
                    web3d.io.loadArrayBuffer("../"+msg.data.url,(_buffer,err)=>{
                        if(err)
                        {
                            postMsg(
                                {
                                    id:taskid,
                                    iserror:true,
                                    errorcontent:err.message
                                }
                            );
                        }else
                        {
                            // let data=web3d.io.load(_buffer);
                            // postMsg(
                            //     {
                            //         id:taskid,
                                    
                            //         originVF:data.vf,
                            //         submeshinfo:data.submeshinfo,
                            //         vbo:data.vboarr,
                            //         ebo:data.eboarr
                            //     },[data.vboarr.buffer,data.eboarr.buffer]
                            // );
                        }
                    });
                // case 'trace':
                //     q3bsp.trace(msg.data.traceId, msg.data.start, msg.data.end, msg.data.radius, msg.data.slide);
                //     break;
                // case 'visibility':
                //     q3bsp.buildVisibleList(q3bsp.getLeaf(msg.data.pos));
                //     break;
                // default:
                //     throw 'Unexpected message type: ' + msg.data;
            }
        };

        
    }
}



