namespace web3d
{

    export class Plane
    {//ax+by+cz+d=0;
        normal:MathD.vec3=MathD.vec3.create(0,1,0);
        constant:number=0;

        distanceToPoint(point:MathD.vec3):number
        {
            return MathD.vec3.dot(point,this.normal)+this.constant;
        }

        copy(to:Plane)
        {
            MathD.vec3.copy(this.normal,to.normal);
            to.constant=this.constant;
        }

        setComponents(nx:number,ny:number,nz:number,ds:number)
        {
            this.normal[0]=nx;
            this.normal[1]=ny;
            this.normal[2]=nz;
            let inverseNormalLength = 1.0 /MathD.vec3.magnitude(this.normal);
            MathD.vec3.scale(this.normal,inverseNormalLength,this.normal);
            this.constant=ds*inverseNormalLength;
        }
    }
}