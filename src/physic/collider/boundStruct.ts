namespace web3d
{
    export class BoundingSphere
    {
        center: MathD.vec3=MathD.vec3.create();
        radius:number=0;

        applyMatrix(mat:MathD.mat4)
        {
            MathD.mat4.transformPoint(this.center,mat,this.center);
        }
        setFromPoints(points:MathD.vec3[],center:MathD.vec3=null)
        {
            if(center!=null)
            {
                MathD.vec3.copy(center,this.center);
            }else
            {
                let center=new AABB().setFromPoints(points).centerPoint;
                MathD.vec3.copy(center,this.center);
            }
            for(let i=0;i<points.length;i++)
            {
                let dis=MathD.vec3.distance(points[i],this.center);
                if(dis>this.radius)
                {
                    this.radius=dis;
                }
            }
        }
        setFromMesh(mesh:Mesh,center:MathD.vec3=null):BoundingSphere
        {
            let points=mesh.vertexAttData[webGraph.VertexAttTypeEnum.Position].data;
            this.setFromPoints(points,center);
            return this;
        }

        copyTo(to:BoundingSphere)
        {
            MathD.vec3.copy(this.center,to.center);
            to.radius=this.radius;
        }

        clone():BoundingSphere
        {
            let newSphere=BoundingSphere.create();
            this.copyTo(newSphere);
            return newSphere;
        }
        private static pool:BoundingSphere[]=[];
        static create()
        {
            if(this.pool.length>0)
            {
                return this.pool.pop();
            }else
            {
                return new BoundingSphere();
            }
        }
        static recycle(item:BoundingSphere)
        {
            this.pool.push(item);
        }

    }
    
    export class BoundingBox
    {
        center: MathD.vec3=MathD.vec3.create();
        halfSize: MathD.vec3=MathD.vec3.create(1,1,1);

        private static pool:BoundingBox[]=[];
        static create()
        {
            if(this.pool.length>0)
            {
                return this.pool.pop();
            }else
            {
                return new BoundingBox();
            }
        }
        static recycle(item:BoundingBox)
        {
            this.pool.push(item);
        }
    }
}

