namespace web3d
{
    export class Frustum
    {
        planes:Plane[]=[];

        constructor(p0:Plane=null,p1:Plane=null,p2:Plane=null,p3:Plane=null,p4:Plane=null,p5:Plane=null)
        {
            this.planes[0]=(p0!=null)?p0:new Plane();
            this.planes[1]=(p1!=null)?p1:new Plane();
            this.planes[2]=(p2!=null)?p2:new Plane();
            this.planes[3]=(p3!=null)?p3:new Plane();
            this.planes[4]=(p4!=null)?p4:new Plane();
            this.planes[5]=(p5!=null)?p5:new Plane();
        }
        set(p0:Plane,p1:Plane,p2:Plane,p3:Plane,p4:Plane,p5:Plane)
        {
            this.planes[0].copy(p0);
            this.planes[1].copy(p1);
            this.planes[2].copy(p2);
            this.planes[3].copy(p3);
            this.planes[4].copy(p4);
            this.planes[5].copy(p5);
        }
        setFromMatrix( me:MathD.mat4 ):Frustum {

            let planes = this.planes;
            let me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
            let me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
            let me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
            let me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];
    
            planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 );
            planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 );
            planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 );
            planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 );
            planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 );
            planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 );

            return this;
        }
        intersectRender(render:IRender):boolean
        {
            let sphere=render.bouningSphere.clone();
            sphere.applyMatrix(render.gameObject.transform.worldMatrix);
            let result=this.intersectSphere(sphere);
            BoundingSphere.recycle(sphere);
            return result;
        }
        /**
         * 和包围球检测相交
         * @param sphere 包围球
         * @param mat 用于变换包围球
         */
        intersectSphere(sphere:BoundingSphere,mat:MathD.mat4=null):boolean
        {
            let planes = this.planes;
            if(mat!=null)
            {
                let clonesphere=sphere.clone();
                clonesphere.applyMatrix(mat);

                let center = clonesphere.center;
                let negRadius = - clonesphere.radius;
                for ( let i = 0; i < 6; i ++ ) {
                    let distance:number = planes[ i ].distanceToPoint( center );
                    if ( distance < negRadius ) {
                        return false;
                    }
                }
                BoundingSphere.recycle(sphere);  
            }else
            {
                let center = sphere.center;
                let negRadius = - sphere.radius;
                for ( let i = 0; i < 6; i ++ ) {
                    let distance:number = planes[ i ].distanceToPoint( center );
                    if ( distance < negRadius ) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}