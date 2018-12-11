namespace web3d
{
    export class Physics
    {
        static Raycast(origin:MathD.vec3, direction:MathD.vec3, distance:number=Number.MAX_VALUE)
        {
            
        }

        // 射线与三角形求交V0，V1，V2三角形三顶点 I为交点
        static rayIntersect(origin:MathD.vec3,rayDir:MathD.vec3,v0:MathD.vec3,v1:MathD.vec3,v2:MathD.vec3,intersectPoint?:MathD.vec3):boolean
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
            let b=MathD.vec3.dot(normal,rayDir);
            if(Math.abs(b)<0.0001)    // ray is parallel to triangle plane   
            {
                return false;
            }

            // 计算v0到射线起始点的向量
            let w0=MathD.vec3.create();
            MathD.vec3.subtract(origin,v0,w0);
            let a=-(MathD.vec3.dot(normal,w0));
            // get intersect point of ray with triangle plane   
            let r=a/b;
            if (r < 0)
            {// ray goes away from triangle   
                return false;                 // => no intersect   
            } // for a segment, also test if (r > 1.0) => no intersect 
                
            // 计算射线与平面的交点
            let interPoint=MathD.vec3.create();
            MathD.vec3.AddscaledVec(origin,rayDir,r,interPoint);

            // 计算交点是否在三角形内部?   
            let uu=MathD.vec3.dot(u,u);
            let uv=MathD.vec3.dot(u,v);
            let vv=MathD.vec3.dot(v,v);
            let w=MathD.vec3.create();
            MathD.vec3.subtract(interPoint,v0,w);
            let wu=MathD.vec3.dot(w,u);
            let wv=MathD.vec3.dot(w,v);
            let D = uv * uv - uu * vv;
            // get and test parametric coords   
            let s = (uv * wv - vv * wu) / D;  
            if (s < 0.0 || s > 1.0)       // I is outside T   
                return false;  
        
            let t = (uv * wu - uu * wv) / D;  
            if (t < 0.0 || (s + t) > 1.0) // I is outside T   
                return false;
            //-------------------交点在三角形内部 
            if(intersectPoint!=null)
            {
                MathD.vec3.copy(interPoint,intersectPoint);
            }
            return true;
        }

        static rayIntersectMesh(origin:MathD.vec3,rayDir:MathD.vec3,mesh:Mesh):boolean
        {
            let ray=new Ray(origin,rayDir);
            return ray.intersectTriangleMesh(mesh);
        }
    }
}