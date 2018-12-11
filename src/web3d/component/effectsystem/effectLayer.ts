namespace web3d
{
    export class EffectLayer
    {
        public active:boolean = true;//timeline window 的toggle
        public effect:EffectSystem;

        // public data:F14LayerData;
        public type:F14TypeEnum;

        public frameList:number[] =[];//记录存在的frame，再排个序  boolcontainframe (关键帧的索引值，从小到大)
        public frames:{[index:number]:F14Frame} = {};//取得对应Frame的信息
        // public frames:NumberDic<F14Frame>=new NumberDic();
        public Attlines:{[name:string]:F14AttTimeLine} ={}; //记录了五种数据的（关键帧位置和值）
        public baseData:ElementData;

        element:LayerElement;
        // batch:F14Basebatch;
        constructor(effect:EffectSystem,data:F14LayerData)
        {
            this.effect = effect;
            this.type = data.type;
            for(let key in data.frames)
            {
                this.addFrame(data.frames[key]);
            }
        }
        addFrame(framedata:F14FrameData):F14Frame
        {
            let index=framedata.frameindex;
            if(this.frames[index])
            {
                console.warn("frame data rewrite!");
            }
            let frame = new F14Frame(framedata);

            if(this.frames[index] ==null)
            {
                this.frameList.push(index);
                this.frameList.sort((a,b)=>{return a-b;});
            }
            this.frames[index]=frame;
            return frame;
        }
        removeFrame(frameIndex:number)
        {
            if(this.frames[frameIndex]!=null)
            {
                let index=this.frameList.indexOf(frameIndex);
                this.frameList.splice(index,1);

                delete this.frames[frameIndex]

                for(let item in this.Attlines)
                {
                    this.Attlines[item].remove(frameIndex);
                }
            }
        }
        setFrameData(index:number,attname:string,value:any)
        {
            if(this.frames[index]!=null)
            {
                let frame=this.frames[index];
                frame.setdata(attname,value);
                this.setAttLineData(index,attname,value);
            }else
            {
                console.warn("Failed to setFrameData！");
            }
        }
        removeFrameData(index:number,attname:string)
        {
            if(this.frames[index]!=null)
            {
                let frame=this.frames[index];
                frame.removedata(attname);
                this.removeAttLineData(index,attname);
            }
        }

        getLineValue(index:number,attname:string,out:any)
        {
            if(this.Attlines[attname])
            {
                this.Attlines[attname].getValue(index,this.baseData,out);
            }else
            {
                out=null;
            }
        }
        


        private setAttLineData(index:number,attname:string,value:any)
        {
            if(value instanceof MathD.vec3)
            {
                this.Attlines[attname]=new F14AttTimeLine(attname,MathD.vec3.lerp,MathD.vec3.copy);
            }else if(value instanceof MathD.vec4)
            {
                this.Attlines[attname]=new F14AttTimeLine(attname,MathD.vec4.lerp,MathD.vec4.copy);
            }else if(value instanceof MathD.color)
            {
                this.Attlines[attname]=new F14AttTimeLine(attname,MathD.color.lerp,MathD.color.copy);                    
            }else
            {
                console.warn("failed to setAttLineData. attName: "+attname+ " value: ",value);
            }
            this.Attlines[attname].addNode(index,value);
        }
        private removeAttLineData(index:number,attname:string)
        {
            if(this.Attlines[attname])
            {
                this.Attlines[attname].remove(index);
            }
        }

        render()
        {
            
        }
        public dispose()
        {
            this.frames=null;
            this.effect=null;
            this.frames=null;
            this.Attlines=null;
            this.element=null;
            // this.batch=null;
        }
    }
    export class F14Frame
    {
        // public layer:F14Layer;
        // public data:F14FrameData;
        public attDic:{[name:string]:any};//自行设置的data 包含5种关键数据
        constructor(data:F14FrameData)
        {
            // this.layer = layer;
            // this.data = data;
            this.attDic=data.singlemeshAttDic;

            for (let i in data)
            {
                if (data.hasOwnProperty(i) && typeof data[i] != "function") 
                {
                    this.setdata(i,data[i]);
                }
            }
        }
        setdata(name:string,value:any)
        {
            this.attDic[name]=value;
        }
        removedata(name:string)
        {
            delete this.attDic[name];
        }
        getdata(name:string)
        {
            return this.attDic[name];
        }
    }
    
    export class F14AttTimeLine
    {
        private attName:string;
        private frameList:number[] =[];    //记录了关键帧的索引值
        private line:{[index:number]:any} ={};//记录了关键帧的帧索引和某一项值

        private lerpFunc:(from,to,lerp,out)=>void;
        private cloneFunc:(from,to)=>void;
        constructor(name:string,lerpfunc:(from,to,lerp,out)=>void,clonefunc:(from,to)=>void)
        {
            this.attName = name;
            this.lerpFunc=lerpfunc;
            this.cloneFunc=clonefunc;
        }
        
        //public Dictionary<int, object> cacheData = new Dictionary<int, object>();
        addNode(frame:number,_value:any)
        {
            if(this.line[frame] ==null)
            {
                this.frameList.push(frame);
                this.frameList.sort((a,b)=>{return a-b;});
            }
            this.line[frame]=_value;

        }
        remove(frame:number)
        {
            if(this.line[frame]!=null)
            {
                let index=this.frameList.indexOf(frame);
                if(index>=0)
                {
                    this.frameList.splice(index,1);
                }
            }
            delete this.line[frame];
        }
    
        getValue(frame:number, basedate:ElementData,out:any)
        {
            if(this.line[frame]!=null)
            {
                this.cloneFunc(this.line[frame],out);
                return;
            }
            if(frame <this.frameList[0])
            {
                let from=basedate[this.attName];
                this.cloneFunc(from,out);
            }
            else if(frame>=this.frameList[this.frameList.length-1])
            {
                this.cloneFunc(this.line[this.frameList[this.frameList.length - 1]],out);
            }
            else
            {
                for (let i=0;i<this.frameList.length;i++)
                {
                    if(this.frameList[i]>frame)
                    {
                        let to = this.frameList[i];
                        let from = this.frameList[i - 1];
                        this.lerpFunc(this.line[from],this.line[to], (frame - from)/(to - from),out);
                        return;
                    }
                }
            }
    

        }
    }
    export class NumberDic<T>
    {
        private keys:number[]=[];
        private map:{[key:number]:T}={};

        add(key:number,value:T)
        {
            this.keys.push(key);
            this.map[key]=value;

            this.keys.sort((a,b)=>{return a-b;});
        }
        remove(key:number)
        {
            if(this.containsKey(key))
            {
                let index=this.keys.indexOf(key);
                this.keys.splice(index,1);
                delete this.map[key];
            }
        }
        getKeys():number[]
        {
            return this.keys;
        }
        getFirstKey():number|null
        {
            return this.keys[0];
        }
        getEndKey():number|null
        {
            return this.keys[this.keys.length-1];
        }

        getValue(key:number)
        {
            return this.map[key];
        }
        containsKey(key:number)
        {
            return this.map[key]!=null;
        }
        foreach(fuc:(_key:number,_value:any)=>void)
        {
            this.keys.forEach((key)=>{
                fuc(key,this.map[key]);
            })
        }
    }
    

}