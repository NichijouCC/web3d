namespace MathD
{
    export const EPSILON:number=0.000001;

    export function clamp(v: number, min: number = 0, max: number = 1): number
    {
        if (v <= min)
            return min;
        else if (v >= max)
            return max;
        else
            return v;
    }
    
    export function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
      }
    
    export function lerp(from:number,to:number,lerp:number,out:number)
    {
        out=(to-from)*lerp+from;
    }
    
    export function random(min:number=0,max:number=1)
    {
        let bund=max-min;
        return min+bund*Math.random();
    }
    
    export function numberEqual(a:number,b:number):boolean
    {
        return a==b;
    }
    export function arrayEqual(a:number[]|Float32Array,b:number[]|Float32Array)
    {
        for(let i=0;i<a.length;i++)
        {
            if(a[i]!=b[i])
            {
                return false;
            }
        }
        return true;
    }
    //row：图片行数//column:图片列数//index：第几张图片（index从0开始计数）
    export function spriteAnimation(row: number, column: number, index: number, out: MathD.vec4) {
        var width = 1.0 / column;
        var height = 1.0 / row;
        var offsetx = width * (index % column);
        var offsety = height *row-height*(Math.floor(index / column) + 1) ;
        
        out.x = width;
        out.y = height;
        out.z = offsetx;
        out.w = offsety;
        // var uvOffset=new gd3d.math.vector4(width,height,offsetx,offsety);
        // return  uvOffset;
    }

    export function numberLerp(fromV: number, toV: number, v: number)
    {
        return fromV * (1 - v) + toV * v;
    }
    
    export function disposeAllRecyle()
    {
        color.disposeRecycledItems();
        mat2d.disposeRecycledItems();
        mat3.disposeRecycledItems();
        mat4.disposeRecycledItems();
        quat.disposeRecycledItems();
        vec2.disposeRecycledItems();
        vec3.disposeRecycledItems();
        vec4.disposeRecycledItems();
    }
}
