namespace MathD
{
    export class color extends Float32Array
    {
        static readonly WHITE:color=new color(1,1,1,1);
    
        get r()
        {
            return this[0];
        }
        set r(value:number)
        {
            this[0]=value;
        }
    
        get g()
        {
            return this[1];
        }
        set g(value:number)
        {
            this[1]=value;
        }
    
        get b()
        {
            return this[2];
        }
        set b(value:number)
        {
            this[2]=value;
        }
    
        get a()
        {
            return this[3];
        }
        set a(value:number)
        {
            this[3]=value;
        }
        private static Recycle:color[]=[];
        public static create(r:number=1,g:number=1,b:number=1,a:number=1):color
        {
            if(color.Recycle&&color.Recycle.length>0)
            {
                let item=color.Recycle.pop() as color;
                item[0]=r;
                item[1]=g;
                item[2]=b;
                item[3]=a;
                return item;
            }else
            {
                let item=new color(r,g,b,a);
                return item;
            }
        }
        public static clone(from: color): color
        {
            if(color.Recycle.length>0)
            {
                let item=color.Recycle.pop() as color;
                color.copy(from,item);
                return item;
            }else
            {
                let item=new color(from[0],from[1],from[2],from[3]);
                return item;
            }
        }
        public static recycle(item:color)
        {
            color.Recycle.push(item);
        }
        public static disposeRecycledItems()
        {
            color.Recycle.length=0;
        }
        private constructor(r:number=1,g:number,b:number=1,a:number=1)
        {
            super(4);
            this[0]=r;
            this[1]=g;
            this[2]=b;
            this[3]=a;
        }
        static setWhite(out: color):color
        {
            out[0] = 1;
            out[1] = 1;
            out[2] = 1;
            out[3] = 1;
            return out;
        }
        static setBlack(out: color)
        {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
        }
        static setGray(out: color)
        {
            out[0] = 0.5;
            out[1] = 0.5;
            out[2] = 0.5;
            out[3] = 1;
        }
        
        static multiply(srca: color, srcb: color, out: color)
        {
            out[0] = srca[0]*srcb[0];
            out[1] = srca[1]*srcb[1];
            out[2] = srca[2]*srcb[2];
            out[3] = srca[3]*srcb[3];
        }
    
        static scaleToRef(src: color, scale: number, out: color)
        {
            out[0] = src[0]*scale;
            out[1] = src[1]*scale;
            out[2] = src[2]*scale;
            out[3] = src[3]*scale;
        }
    
    
        static lerp(srca: color, srcb: color, t: number, out: color)
        {
            t=clamp(t);
            out[0] = t * (srcb[0] - srca[0]) + srca[0];
            out[1] = t * (srcb[1] - srca[1]) + srca[1];
            out[2] = t * (srcb[2] - srca[2]) + srca[2];
            out[3] = t * (srcb[3] - srca[3]) + srca[3];
    
        }
        /**
         * Copy the values from one color to another
         *
         * @param out the receiving vector
         * @param a the source vector
         * @returns out
         */
        public static copy(a: color,out: color): color{
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
    
        /**
         * Returns whether or not the vectors have approximately the same elements in the same color.
         *
         * @param {vec4} a The first vector.
         * @param {vec4} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static equals (a: color, b: color): boolean{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3];
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3];
            return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
        }
    }
}
