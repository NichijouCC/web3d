namespace webGraph
{

    
    
    export function numberEqual(a,b):boolean
    {
        return a==b;
    }
    export function ArrayEqual(a:number[]|Float32Array,b:number[]|Float32Array)
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
    export function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
      }
}

