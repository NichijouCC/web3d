namespace web3d
{
    export class Quadtree
    {
        private static TOP_LEFT=0;
        private static TOP_RIGHT=1;
        private static BOTTOM_LEFT=2;
        private static BOTTOM_RIGHT=3;
    
        private MAX_OBJECTS:number = 10;
        private MAX_LEVELS:number = 5;
    
        private level:number;        // 子节点深度
        private objects:MathD.Rect[];     // 物体数组
        private _stuckChildren:MathD.Rect[];
        private bounds:MathD.Rect;// 区域边界
        private nodes:Quadtree[]; // 四个子节点
    
        public constructor(level:number,bounds:MathD.Rect)
        {
            this.level=level;
            this.bounds=bounds;
            this.objects=[];
            this._stuckChildren=[];
            this.nodes=[];
        }
    
        public clear()
        {
            this.objects.length=0;
            this._stuckChildren.length=0;
            for(let i=0;i<this.nodes.length;i++)
            {
                if(this.nodes[i]!=null)
                {
                    this.nodes[i].clear();
                    this.nodes[i]=null;
                }
            }
        }
    
        private split() 
        {
            let subWidth =this.bounds.width/2;
            let subHeight = this.bounds.height/2;
            let x =this.bounds.x;
            let y =this.bounds.y;
         
            this.nodes[Quadtree.TOP_LEFT] = new Quadtree(this.level+1, MathD.Rect.create(x,y, subWidth, subHeight));
            this.nodes[Quadtree.TOP_RIGHT] = new Quadtree(this.level+1, MathD.Rect.create(x+subWidth,y, subWidth, subHeight));
            this.nodes[Quadtree.BOTTOM_LEFT] = new Quadtree(this.level+1, MathD.Rect.create(x, y + subHeight, subWidth, subHeight));
            this.nodes[Quadtree.BOTTOM_RIGHT] = new Quadtree(this.level+1, MathD.Rect.create(x + subWidth, y + subHeight, subWidth, subHeight));
        }
    
        private getIndex( pRect:MathD.Rect):number
        {
            var left = (pRect.x > this.bounds.x + this.bounds.width / 2) ? false : true;
            var top = (pRect.y > this.bounds.y + this.bounds.height / 2) ? false : true;
            if(left)
            {
                if(top)
                {
                    return Quadtree.TOP_LEFT;
                }else
                {
                    return Quadtree.BOTTOM_LEFT;
                }
            }else
            {
                if(top)
                {
                    return Quadtree.TOP_RIGHT;
                }else
                {
                    return Quadtree.BOTTOM_RIGHT;
                }
            }
        }
        /*
        * 将物体插入四叉树
        * 如果当前节点的物体个数超出容量了就将该节点分裂成四个从而让多数节点分给子节点
        */
        public insert(item:MathD.Rect) {
            // 插入到子节点
            if (this.nodes.length>0) {
                let index = this.getIndex(item);
                
                if(item.x>this.bounds.x&&item.x+item.width<=this.bounds.x+this.bounds.width&&
                    item.y>this.bounds.y&&item.y+item.height<=this.bounds.y+this.bounds.height)
                {
                    this.nodes[index].insert(item);
                }else
                {
                    this._stuckChildren.push(item);
                }
                return;
            }
            // 还没分裂或者插入到子节点失败，只好留给父节点了
            this.objects.push(item);
            let len=this.objects.length;
            // 超容量后如果没有分裂则分裂
            if (len > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) 
            {
                this.split();
    
                for(let i=0;i<len;i++)
                {
                    this.insert(this.objects[i]);
                }
                this.objects.length=0;
            }
        }
    
        public retrieveAllObjects(item:MathD.Rect):MathD.Rect[]
        {
            let arr=[];
            this.retrieve(arr,item);
            return arr;
        }
        /*
        * 返回所有可能和指定物体碰撞的物体
        */
        private retrieve(returnObjects:MathD.Rect[],item:MathD.Rect)
        {
            if(this.nodes.length>0)
            {
                let index = this.getIndex(item);
                let node=this.nodes[index];
                if(item.x>=node.bounds.x&&item.x+item.width<=node.bounds.x+node.bounds.width&&
                    item.y>=node.bounds.y&&item.y+item.height<=node.bounds.y+node.bounds.height)
                {
                    node.retrieve(returnObjects,item);
                }else
                {
                    if(item.x<=this.nodes[Quadtree.TOP_RIGHT].bounds.x)
                    {
                        if(item.y<=this.nodes[Quadtree.BOTTOM_LEFT].bounds.y)
                        {
                            this.nodes[Quadtree.TOP_LEFT].getAllContent(returnObjects);
                        }
                        if(item.y+item.height>this.nodes[Quadtree.BOTTOM_LEFT].bounds.y)
                        {
                            this.nodes[Quadtree.BOTTOM_LEFT].getAllContent(returnObjects);
                        }
                    }
    
                    if(item.x+item.width>this.nodes[Quadtree.TOP_RIGHT].bounds.x)
                    {
                        if(item.y<=this.nodes[Quadtree.BOTTOM_RIGHT].bounds.y)
                        {
                            this.nodes[Quadtree.TOP_RIGHT].getAllContent(returnObjects);
                        }
    
                        if(item.y+item.height>this.nodes[Quadtree.BOTTOM_RIGHT].bounds.y)
                        {
                            this.nodes[Quadtree.BOTTOM_RIGHT].getAllContent(returnObjects);
                        }
                    }
                }
            }
        }
    
        private getAllContent(returnArr:MathD.Rect[])
        {
            if (this.nodes.length) 
            {
                for (let i = 0; i < this.nodes.length; i++)
                {
                    this.nodes[i].getAllContent(returnArr);
                }
            }
            this.objects.forEach((item)=>{
                returnArr.push(item);
            })
            this._stuckChildren.forEach((item)=>{
                returnArr.push(item);
            })
        };
    }
}
