namespace MathD
{
    export class Rect extends Float32Array
    {
        get x()
        {
            return this[0];
        }
        set x(value:number)
        {
            this[0]=value;
        }
    
        get y()
        {
            return this[1];
        }
        set y(value:number)
        {
            this[1]=value;
        }
    
        get z()
        {
            return this[2];
        }
        set z(value:number)
        {
            this[2]=value;
        }
    
        get width()
        {
            return this[2];
        }
    
        get height()
        {
            return this[3];
        }
        get w()
        {
            return this[3];
        }
        set w(value:number)
        {
            this[3]=value;
        }
    
        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0)
        {
            super(4);
    
            this[0] = x;
            this[1] = y;
            this[2] = w;
            this[3] = h;
        }
    
        private static Recycle:Rect[]=[];
        public static create(x: number=0, y: number=0, w: number=0,h:number=0):Rect
        {
            if(Rect.Recycle&&Rect.Recycle.length>0)
            {
                let item=Rect.Recycle.pop();
                item[0]=x;
                item[1]=y;
                item[2]=w;
                item[3]=h;
                return item;
            }else
            {
                let item=new Rect(x,y,w,h);
                return item;
            }
        }
        public static clone(from: Rect): Rect
        {
            if(Rect.Recycle.length>0)
            {
                let item=Rect.Recycle.pop();
                Rect.copy(from,item);
                return item;
            }else
            {
                let item=new Rect(from[0],from[1],from[2],from[3]);
                return item;
            }
        }
        public static recycle(item:Rect)
        {
            Rect.Recycle.push(item);
        }
    
        public static disposeRecycledItems()
        {
            Rect.Recycle.length=0;
        }
    
        public static copy(a: Rect,out: Rect): Rect{
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
    
        public static euqal(a:Rect,b:Rect):boolean
        {
            if(a[0]!=b[0]) return false;
            if(a[1]!=b[1]) return false;
            if(a[2]!=b[2]) return false;
            if(a[3]!=b[3]) return false;
            return true;
        }
    }
    
    export function rectSet_One(out: Rect)
    {
        out[0] = 0;
        out[1] = 0;
        out[2] = 1;
        out[3] = 1;
    }
    
    export function rectSet_Zero(out: Rect)
    {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
    }
    
    export function rectEqul(src1: Rect, src2: Rect): boolean
    {
        return !((src1[0] != src2[0]) ||
            (src1[1] != src2[1]) ||
            (src1[2] != src2[2]) ||
            (src1[3] != src2[3]));
    }
    
    export function rectInner(x: number, y: number, src: Rect): boolean
    {
        if (x < src[0] || x > src[0] + src[2] ||
            y < src[1] || y > src[1] + src[3])
        {
            return false;
        }
        return true;
    }
}
