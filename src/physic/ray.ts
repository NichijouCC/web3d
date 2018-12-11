namespace web3d
{
    export class Ray
    {
        origin:MathD.vec3;
        direction:MathD.vec3;

        constructor(origin:MathD.vec3,dir:MathD.vec3)
        {
            this.origin=origin;
            this.direction=dir;
        }

        intersectTriangle(v0:MathD.vec3,v1:MathD.vec3,v2:MathD.vec3,intersectPoint?:MathD.vec3):boolean
        {
            // 射线与三角形平行? 
            let u=MathD.vec3.create();// edge1
            MathD.vec3.subtract(v1,v0,u);
            let v=MathD.vec3.create();// edge2
            MathD.vec3.subtract(v2,v0,v);
            let normal=MathD.vec3.create();// normal
            MathD.vec3.cross(u,v,normal);
            if(MathD.vec3.equals(normal,MathD.vec3.ZERO))// triangle is degenerate 
            {
                return false;
            }

            // 计算射线与平面法向夹角
            let b=MathD.vec3.dot(normal,this.direction);
            if(Math.abs(b)<0.0001)    //射线与三角形面平行
            {
                return false;
            }

            // 计算v0到射线起始点的向量
            let w0=MathD.vec3.create();
            MathD.vec3.subtract(this.origin,v0,w0);
            let a=-(MathD.vec3.dot(normal,w0));//得到射线起点到三角形的高度
            let r=a/b;
            if (r < 0)
            {//射线和三角形面反向相交
                return false; 
            } //如果是线段，r>1.0同样不相交
            
                
            // 计算射线与平面的交点
            let interPoint=MathD.vec3.create();
            MathD.vec3.AddscaledVec(this.origin,this.direction,r,interPoint);

            // 计算交点是否在三角形内部?   
            let uu=MathD.vec3.dot(u,u);
            let uv=MathD.vec3.dot(u,v);
            let vv=MathD.vec3.dot(v,v);
            let w=MathD.vec3.create();
            MathD.vec3.subtract(interPoint,v0,w);
            let wu=MathD.vec3.dot(w,u);
            let wv=MathD.vec3.dot(w,v);
            let D = uv * uv - uu * vv;

            let s = (uv * wv - vv * wu) / D;  
            if (s < 0.0 || s > 1.0)       // 相交点在三角形外   
                return false;  
        
            let t = (uv * wu - uu * wv) / D;  
            if (t < 0.0 || (s + t) > 1.0) // 相交点在三角形外  
                return false;
            //-------------------交点在三角形内部 
            if(intersectPoint!=null)
            {
                MathD.vec3.copy(interPoint,intersectPoint);
            }
            return true;
        }

        interSectAABB(aabb:AABB,intersectPoint?:MathD.vec3):boolean
        {
            let ptOnPlane=MathD.vec3.create();
            let min=aabb.minPoint;
            let max=aabb.maxPoint;

            //分别判断射线与各面的相交情况
            let dir=this.direction;
            let origin=this.origin;
            let t;
            //判断射线与包围盒x轴方向的面是否有交点
            if (dir.x != 0) //射线x轴方向分量不为0 若射线方向矢量的x轴分量为0，射线不可能经过包围盒朝x轴方向的两个面
            {
                /*
                使用射线与平面相交的公式求交点
                */
                if (dir.x > 0)//若射线沿x轴正方向偏移
                    t = (min.x - origin.x) / dir.x;
                else  //射线沿x轴负方向偏移
                    t = (max.x - origin.x) / dir.x;
                if (t > 0) //t>0时则射线与平面相交
                {
                    MathD.vec3.AddscaledVec(origin,dir,t,ptOnPlane);//计算交点坐标
                    //判断交点是否在当前面内
                    if (min.y < ptOnPlane.y && ptOnPlane.y < max.y && min.z < ptOnPlane.z && ptOnPlane.z < max.z)
                    {
                        if(intersectPoint!=null)
                        {
                            MathD.vec3.copy(ptOnPlane,intersectPoint);
                        }
                        return true; //射线与包围盒有交点
                    }
                }
            }
            
            //若射线沿y轴方向有分量 判断是否与包围盒y轴方向有交点
            if (dir.y != 0)
            {
                if (dir.y > 0)
                    t = (min.y - origin.y) / dir.y;
                else
                    t = (max.y - origin.y) / dir.y;
                
                if (t > 0)
                {
                    MathD.vec3.AddscaledVec(origin,dir,t,ptOnPlane);//计算交点坐标
                    if (min.z < ptOnPlane.z && ptOnPlane.z < max.z && min.x < ptOnPlane.x && ptOnPlane.x < max.x)
                    {
                        if(intersectPoint!=null)
                        {
                            MathD.vec3.copy(ptOnPlane,intersectPoint);
                        }
                        return true;
                    }
                }
            }
            //若射线沿z轴方向有分量 判断是否与包围盒y轴方向有交点
            if (dir.z != 0)
            {
                if (dir.z > 0)
                    t = (min.z - origin.z) / dir.z;
                else
                    t = (max.z - origin.z) / dir.z;
                
                if (t > 0)
                {
                    MathD.vec3.AddscaledVec(origin,dir,t,ptOnPlane);//计算交点坐标
                    if (min.x < ptOnPlane.x && ptOnPlane.x < max.x && min.y < ptOnPlane.y && ptOnPlane.y < max.y)
                    {
                        if(intersectPoint!=null)
                        {
                            MathD.vec3.copy(ptOnPlane,intersectPoint);
                        }
                        return true;
                    }
                }
            }
            return false;
        }

        intersectTriangleMesh(mesh:Mesh):boolean
        {
            let posatt=mesh.getVertexData(webGraph.VertexAttTypeEnum.Position);
            let posArr:MathD.vec3[]=posatt.data;
            let triCount=mesh.trisindex.length/3;

            for(let i=0;i<triCount;i++)
            {
                let index0=mesh.trisindex[i*3+0];
                let index1=mesh.trisindex[i*3+1];
                let index2=mesh.trisindex[i*3+2];

                let beCollided=this.intersectTriangle(posArr[index0],posArr[index1],posArr[index2],);
                if(beCollided)
                {
                    return true;
                }
            }
            return false;
        }
    }
}