namespace web3d
{
    export class AABB
    {
        maxPoint: MathD.vec3=MathD.vec3.create();
        minPoint: MathD.vec3=MathD.vec3.create();
        centerPoint: MathD.vec3=MathD.vec3.create();

        setMaxPoint(pos: MathD.vec3)
        {
            MathD.vec3.copy(pos,this.maxPoint);
        }
        setMinPoint(pos: MathD.vec3)
        {
            MathD.vec3.copy(pos,this.minPoint);
        }
    
        setFromPoints(pos: MathD.vec3|MathD.vec3[]):AABB
        {
            if(pos instanceof Array)
            {
                for(let key in pos)
                {
                    MathD.vec3.min(this.minPoint,pos[key],this.minPoint);
                    MathD.vec3.max(this.maxPoint,pos[key],this.maxPoint);
                }
            }else
            {
                MathD.vec3.min(this.minPoint,pos,this.minPoint);
                MathD.vec3.max(this.maxPoint,pos,this.maxPoint);
            }
            MathD.vec3.center(this.minPoint,this.maxPoint,this.centerPoint);
            return this;
        }

        setFromMesh(mesh:Mesh):AABB
        {
            let points=mesh.vertexAttData[webGraph.VertexAttTypeEnum.Position].data;
            this.setFromPoints(points);
            return this;
        }
        
        addAABB(box:AABB)
        {
            MathD.vec3.min(this.minPoint,box.minPoint,this.minPoint);
            MathD.vec3.max(this.maxPoint,box.maxPoint,this.maxPoint);
            MathD.vec3.center(this.minPoint,this.maxPoint,this.centerPoint);
        }

        beEmpty():boolean
        {
            return (this.minPoint[0]>this.maxPoint[0])||(this.minPoint[1]>this.maxPoint[1])||(this.minPoint[2]>this.maxPoint[2]);
        }
    
        containPoint(point: MathD.vec3):boolean
        {
            return  (point[0]>=this.minPoint[0])&&(point[0]<=this.maxPoint[0])&&
                    (point[1]>=this.minPoint[1])&&(point[1]<=this.maxPoint[1])&&
                    (point[2]>=this.minPoint[2])&&(point[2]<=this.maxPoint[2]);
        }
    
        intersectAABB(box:AABB):boolean
        {
            let interMin=box.minPoint;
            let interMax=box.maxPoint;
    
            if(this.minPoint[0]>interMax[0]) return false;
            if(this.minPoint[1]>interMax[1]) return false;
            if(this.minPoint[2]>interMax[2]) return false;
            if(this.maxPoint[0]>interMin[0]) return false;
            if(this.maxPoint[1]>interMin[1]) return false;
            if(this.maxPoint[2]>interMin[2]) return false;
    
            return true;
        }
    


        applyMatrix(mat:MathD.mat4)
        {
            if(this.beEmpty()) return;
            let min=MathD.vec3.create();
            let max=MathD.vec3.create();
            min[0]+=mat[12];
            max[0]+=mat[12];
            min[1]+=mat[13];
            max[1]+=mat[13];
            min[2]+=mat[14];
            max[2]+=mat[14];
    
            for(let i=0;i<3;i++)
            {
                for(let k=0;k<3;k++)
                {    
                    if(mat[k+i*4]>0)
                    {
                        min[i]+=mat[k+i*4]*this.minPoint[i];
                        max[i]+=mat[k+i*4]*this.maxPoint[i];
                    }else
                    {
                        min[i]+=mat[k+i*4]*this.maxPoint[i];
                        max[i]+=mat[k+i*4]*this.minPoint[i];
                    }
                }
            }
            MathD.vec3.recycle(this.minPoint);
            MathD.vec3.recycle(this.maxPoint);
            this.minPoint=min;
            this.maxPoint=max;
        }
    }
}
