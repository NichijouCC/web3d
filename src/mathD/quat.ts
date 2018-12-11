namespace MathD
{
    export class quat extends Float32Array
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
    
        get w()
        {
            return this[3];
        }
        set w(value:number)
        {
            this[3]=value;
        }
    
        private static Recycle:quat[]=[];
        public static readonly norot=quat.create();
        public static create()
        {
            if(quat.Recycle&&quat.Recycle.length>0)
            {
                let item=quat.Recycle.pop() as quat;
                quat.identity(item);
                return item;
            }else
            {
                let item=new quat();
                return item;
            }
        }
        public static clone(from: quat): quat
        {
            if(quat.Recycle.length>0)
            {
                let item=quat.Recycle.pop() as quat;
                quat.copy(from,item);
                return item;
            }else
            {
                let item=new quat();
                item[0]=from[0];
                item[1]=from[1];
                item[2]=from[2];
                item[3]=from[3];
                return item;
            }
        }
        public static recycle(item:quat)
        {
            quat.Recycle.push(item);
        }
    
        public static disposeRecycledItems()
        {
            quat.Recycle.length=0;
        }
        private constructor()
        {
            super(4);
            // this[0]=0;
            // this[1]=0;
            // this[2]=0;
            this[3]=1;
        }
    
        /**
         * Copy the values from one quat to another
         *
         * @param out the receiving quaternion
         * @param a the source quaternion
         * @returns out
         * @function
         */
        public static copy(a: quat|number[],out: quat): quat{
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
    
        /**
         * Set a quat to the identity quaternion
         *
         * @param out the receiving quaternion
         * @returns out
         */
        public static identity(out: quat): quat{
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
          }
    
    
    
        /**
         * Gets the rotation axis and angle for a given
         *  quaternion. If a quaternion is created with
         *  setAxisAngle, this method will return the same
         *  values as providied in the original parameter list
         *  OR functionally equivalent values.
         * Example: The quaternion formed by axis [0, 0, 1] and
         *  angle -90 is the same as the quaternion formed by
         *  [0, 0, 1] and 270. This method favors the latter.
         * @param  {vec3} out_axis  Vector receiving the axis of rotation
         * @param  {quat} q     Quaternion to be decomposed
         * @return {number}     Angle, in radians, of the rotation
         */
        public static getAxisAngle (out_axis: vec3, q: quat): number{
            let rad = Math.acos(q[3]) * 2.0;
            let s = Math.sin(rad / 2.0);
            if (s != 0.0) {
              out_axis[0] = q[0] / s;
              out_axis[1] = q[1] / s;
              out_axis[2] = q[2] / s;
            } else {
              // If s is zero, return any axis (no rotation - axis does not matter)
              out_axis[0] = 1;
              out_axis[1] = 0;
              out_axis[2] = 0;
            }
            return rad;
          }
    
        /**
         * Adds two quat's
         *
         * @param out the receiving quaternion
         * @param a the first operand
         * @param b the second operand
         * @returns out
         * @function
         */
        public static add(a: quat, b: quat,out: quat): quat
        {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;   
        }
    
        /**
         * Multiplies two quat's
         *
         * @param out the receiving quaternion
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static multiply(a: quat, b: quat,out: quat): quat{
            let ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            let bx = b[0],
                by = b[1],
                bz = b[2],
                bw = b[3];
          
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
          }
    
        /**
         * Scales a quat by a scalar number
         *
         * @param out the receiving vector
         * @param a the vector to scale
         * @param b amount to scale the vector by
         * @returns out
         * @function
         */
        public static scale(a: quat, b: number,out: quat): quat{
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        }
    
        /**
         * Calculates the length of a quat
         *
         * @param a vector to calculate length of
         * @returns length of a
         * @function
         */
        public static length_(a: quat): number{
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
    
        /**
         * Calculates the squared length of a quat
         *
         * @param a vector to calculate squared length of
         * @returns squared length of a
         * @function
         */
        public static squaredLength(a: quat): number{
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return x * x + y * y + z * z + w * w;
        }
    
        /**
         * Normalize a quat
         *
         * @param out the receiving quaternion
         * @param src quaternion to normalize
         * @returns out
         * @function
         */
        public static normalize(src: quat,out: quat): quat{
            let x = src[0];
            let y = src[1];
            let z = src[2];
            let w = src[3];
            let len = x * x + y * y + z * z + w * w;
            if (len > 0) {
              len = 1 / Math.sqrt(len);
              out[0] = x * len;
              out[1] = y * len;
              out[2] = z * len;
              out[3] = w * len;
            }
            return out;
        }
    
        /**
         * Calculates the dot product of two quat's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns dot product of a and b
         * @function
         */
        public static dot(a: quat, b: quat): number{
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
    
        /**
         * Performs a linear interpolation between two quat's
         *
         * @param out the receiving quaternion
         * @param a the first operand
         * @param b the second operand
         * @param t interpolation amount between the two inputs
         * @returns out
         * @function
         */
        public static lerp(a: quat, b: quat, t: number,out: quat): quat{
            let ax = a[0];
            let ay = a[1];
            let az = a[2];
            let aw = a[3];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            out[3] = aw + t * (b[3] - aw);
            return out;
        }
    
        /**
         * Performs a spherical linear interpolation between two quat
         *
         * @param out the receiving quaternion
         * @param a the first operand
         * @param b the second operand
         * @param t interpolation amount between the two inputs
         * @returns out
         */
        public static slerp(a: quat, b: quat, t: number,out: quat): quat {
            // benchmarks:
            //    http://jsperf.com/quaternion-slerp-implementations
            let ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            let bx = b[0],
                by = b[1],
                bz = b[2],
                bw = b[3];
          
            let omega = void 0,
                cosom = void 0,
                sinom = void 0,
                scale0 = void 0,
                scale1 = void 0;
          
            // calc cosine
            cosom = ax * bx + ay * by + az * bz + aw * bw;
            // adjust signs (if necessary)
            if (cosom < 0.0) {
              cosom = -cosom;
              bx = -bx;
              by = -by;
              bz = -bz;
              bw = -bw;
            }
            // calculate coefficients
            if (1.0 - cosom > 0.000001) {
              // standard case (slerp)
              omega = Math.acos(cosom);
              sinom = Math.sin(omega);
              scale0 = Math.sin((1.0 - t) * omega) / sinom;
              scale1 = Math.sin(t * omega) / sinom;
            } else {
              // "from" and "to" quaternions are very close
              //  ... so we can do a linear interpolation
              scale0 = 1.0 - t;
              scale1 = t;
            }
            // calculate final values
            out[0] = scale0 * ax + scale1 * bx;
            out[1] = scale0 * ay + scale1 * by;
            out[2] = scale0 * az + scale1 * bz;
            out[3] = scale0 * aw + scale1 * bw;
          
            return out;
          }
    
        /**
         * Performs a spherical linear interpolation with two control points
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @param {quat} c the third operand
         * @param {quat} d the fourth operand
         * @param {number} t interpolation amount
         * @returns {quat} out
         */
        public static sqlerp(a: quat, b: quat, c: quat, d: quat, t: number,out: quat): quat{
            let temp1 = quat.create();
            let temp2 = quat.create();
    
            quat.slerp(a, d, t,temp1);
            quat.slerp(b, c, t,temp2);
            quat.slerp(temp1, temp2, 2 * t * (1 - t),out);
        
            return out;
        }
    
        /**
         * Calculates the inverse of a quat
         *
         * @param out the receiving quaternion
         * @param a quat to calculate inverse of
         * @returns out
         */
        public static inverse(a: quat,out: quat): quat{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3];
            let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
            let invDot = dot ? 1.0 / dot : 0;
          
            // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
          
            out[0] = -a0 * invDot;
            out[1] = -a1 * invDot;
            out[2] = -a2 * invDot;
            out[3] = a3 * invDot;
            return out;
          }
        /**
         * Calculates the conjugate of a quat
         * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
         *
         * @param out the receiving quaternion
         * @param a quat to calculate conjugate of
         * @returns out
         */
        public static conjugate(out: quat, a: quat): quat{
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a[3];
            return out;
          }
    
        /**
         * Returns a string representation of a quaternion
         *
         * @param a quat to represent as a string
         * @returns string representation of the quat
         */
        public static str(a: quat): string{
            return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
          }
    
        /**
         * Rotates a quaternion by the given angle about the X axis
         *
         * @param out quat receiving operation result
         * @param a quat to rotate
         * @param rad angle (in radians) to rotate
         * @returns out
         */
        public static rotateX(a: quat, rad: number,out: quat): quat{
            rad *= 0.5;
          
            let ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            let bx = Math.sin(rad),
                bw = Math.cos(rad);
          
            out[0] = ax * bw + aw * bx;
            out[1] = ay * bw + az * bx;
            out[2] = az * bw - ay * bx;
            out[3] = aw * bw - ax * bx;
            return out;
          }
    
        /**
         * Rotates a quaternion by the given angle about the Y axis
         *
         * @param out quat receiving operation result
         * @param a quat to rotate
         * @param rad angle (in radians) to rotate
         * @returns out
         */
        public static rotateY(a: quat, rad: number,out: quat): quat{
            rad *= 0.5;
          
            let ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            let by = Math.sin(rad),
                bw = Math.cos(rad);
          
            out[0] = ax * bw - az * by;
            out[1] = ay * bw + aw * by;
            out[2] = az * bw + ax * by;
            out[3] = aw * bw - ay * by;
            return out;
          }
    
        /**
         * Rotates a quaternion by the given angle about the Z axis
         *
         * @param out quat receiving operation result
         * @param a quat to rotate
         * @param rad angle (in radians) to rotate
         * @returns out
         */
        public static rotateZ(a: quat, rad: number,out: quat): quat{
            rad *= 0.5;
          
            let ax = a[0],
                ay = a[1],
                az = a[2],
                aw = a[3];
            let bz = Math.sin(rad),
                bw = Math.cos(rad);
          
            out[0] = ax * bw + ay * bz;
            out[1] = ay * bw - ax * bz;
            out[2] = az * bw + aw * bz;
            out[3] = aw * bw - az * bz;
            return out;
          }
    
        /**
         * Creates a quaternion from the given 3x3 rotation matrix.
         *
         * NOTE: The resultant quaternion is not normalized, so you should be sure
         * to renormalize the quaternion yourself where necessary.
         *
         * @param out the receiving quaternion
         * @param m rotation matrix
         * @returns out
         * @function
         */
        public static fromMat3(m: mat3,out: quat): quat{
            // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
            // article "Quaternion Calculus and Fast Animation".
            let fTrace = m[0] + m[4] + m[8];
            let fRoot = void 0;
          
            if (fTrace > 0.0) {
              // |w| > 1/2, may as well choose w > 1/2
              fRoot = Math.sqrt(fTrace + 1.0); // 2w
              out[3] = 0.5 * fRoot;
              fRoot = 0.5 / fRoot; // 1/(4w)
              out[0] = (m[5] - m[7]) * fRoot;
              out[1] = (m[6] - m[2]) * fRoot;
              out[2] = (m[1] - m[3]) * fRoot;
            } else {
              // |w| <= 1/2
              let i = 0;
              if (m[4] > m[0]) i = 1;
              if (m[8] > m[i * 3 + i]) i = 2;
              let j = (i + 1) % 3;
              let k = (i + 2) % 3;
          
              fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
              out[i] = 0.5 * fRoot;
              fRoot = 0.5 / fRoot;
              out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
              out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
              out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
            }
          
            return out;
          }
    
    
    
        /**
         * Sets the specified quaternion with values corresponding to the given
         * axes. Each axis is a vec3 and is expected to be unit length and
         * perpendicular to all other specified axes.
         *
         * @param out the receiving quat
         * @param view  the vector representing the viewing direction
         * @param right the vector representing the local "right" direction
         * @param up    the vector representing the local "up" direction
         * @returns out
         */
        public static setAxes(view: vec3, right: vec3, up: vec3,out: quat): quat{
            let matr = mat3.create();
    
            matr[0] = right[0];
            matr[3] = right[1];
            matr[6] = right[2];
        
            matr[1] = up[0];
            matr[4] = up[1];
            matr[7] = up[2];
        
            matr[2] = -view[0];
            matr[5] = -view[1];
            matr[8] = -view[2];
            quat.fromMat3(matr,out);
            matr=null;
    
            return  quat.normalize(out,out);
          }
    
    
    
        /**
         * Calculates the W component of a quat from the X, Y, and Z components.
         * Assumes that quaternion is 1 unit in length.
         * Any existing W component will be ignored.
         *
         * @param out the receiving quaternion
         * @param a quat to calculate W component of
         * @returns out
         */
        public static calculateW(a: quat,out: quat): quat{
            let x = a[0],
                y = a[1],
                z = a[2];
          
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
            return out;
          }
    
        /**
         * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
         *
         * @param {quat} a The first vector.
         * @param {quat} b The second vector.
         * @returns {boolean} True if the quaternions are equal, false otherwise.
         */
        public static exactEquals (a: quat, b: quat): boolean{
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        }
    
        // /**
        //  * Returns whether or not the quaternions have approximately the same elements in the same position.
        //  *
        //  * @param {quat} a The first vector.
        //  * @param {quat} b The second vector.
        //  * @returns {boolean} True if the quaternions are equal, false otherwise.
        //  */
        // public static equals (a: quat, b: quat): boolean{
        //     let a0 = a[0],
        //     a1 = a[1],
        //     a2 = a[2],
        //     a3 = a[3];
        // let b0 = b[0],
        //     b1 = b[1],
        //     b2 = b[2],
        //     b3 = b[3];
        // return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
      
        // }
        static fromYawPitchRoll(yaw: number, pitch: number, roll: number, result: quat): void 
        {
            // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
            let halfRoll = roll * 0.5;
            let halfPitch = pitch * 0.5;
            let halfYaw = yaw * 0.5;
    
            let sinRoll = Math.sin(halfRoll);
            let cosRoll = Math.cos(halfRoll);
            let sinPitch = Math.sin(halfPitch);
            let cosPitch = Math.cos(halfPitch);
            let sinYaw = Math.sin(halfYaw);
            let cosYaw = Math.cos(halfYaw);
    
            result[0] = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
            result[1] = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
            result[2] = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
            result[3] = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
        }
        /**舍弃glmatrix 的fromeuler  （坐标系不同算法不同）
         * Creates a quaternion from the given euler angle x, y, z.
         * rot order： z-y-x 
         * @param {x} Angle to rotate around X axis in degrees.
         * @param {y} Angle to rotate around Y axis in degrees.
         * @param {z} Angle to rotate around Z axis in degrees.
         * @param {quat} out the receiving quaternion
         * @returns {quat} out
         * @function
         */
        static FromEuler(x: number, y: number, z: number, out: quat):quat
        {
            x *=0.5* Math.PI / 180;
            y *=0.5* Math.PI / 180;
            z *=0.5* Math.PI / 180;
    
            let cosX: number = Math.cos(x), sinX: number = Math.sin(x);
            let cosY: number = Math.cos(y), sinY: number = Math.sin(y);
            let cosZ: number = Math.cos(z), sinZ: number = Math.sin(z);
    
            out[0] = sinX * cosY * cosZ + cosX * sinY * sinZ;
            out[1] = cosX * sinY * cosZ - sinX * cosY * sinZ;
            out[2] = cosX * cosY * sinZ - sinX * sinY * cosZ;
            out[3] = cosX * cosY * cosZ + sinX * sinY * sinZ;
            
            this.normalize(out, out);
            return out;
        }
        static ToEuler(src: quat, out: vec3)
        {
            let x=src[0],
                y=src[1],
                z=src[2],
                w=src[3];
            let temp: number = 2.0 * (w * x - y * z);
            temp = clamp(temp, -1.0, 1.0);
            out[0] = Math.asin(temp);
            out[1] = Math.atan2(2.0 * (w * y + z * x), 1.0 - 2.0 * (y * y + x * x));
            out[2] = Math.atan2(2.0 * (w * z + y * x), 1.0 - 2.0 * (x * x + z * z));
    
            out[0] /= Math.PI / 180;
            out[1] /= Math.PI / 180;
            out[2] /= Math.PI / 180;
        }
    
        /**
         * Sets a quat from the given angle and rotation axis,
         * then returns it.
         *
         * @param out the receiving quaternion
         * @param axis the axis around which to rotate
         * @param rad （弧度）the angle in radians 
         * @returns out
         **/
        public static AxisAngle( axis: vec3, rad: number,out: quat): quat 
        {
            rad = rad * 0.5;
            let s = Math.sin(rad);
            out[0] = s * axis[0];
            out[1] = s * axis[1];
            out[2] = s * axis[2];
            out[3] = Math.cos(rad);
            return out;
        }
    
                
        /**
         * Sets a quaternion to represent the shortest rotation from one
         * vector to another.
         *
         * Both vectors are assumed to be unit length.
         *
         * @param out the receiving quaternion.
         * @param from the initial vector
         * @param to the destination vector
         * @returns out
         */
        public static rotationTo(from: vec3, to: vec3,out: quat): quat{
            let tmpvec3 =vec3.create();
            let xUnitVec3 = vec3.RIGHT;
            let yUnitVec3 = vec3.UP;
    
            let dot = vec3.dot(from, to);
            if (dot < -0.999999) {
                vec3.cross(tmpvec3, xUnitVec3, from);
                if (vec3.magnitude(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, from);
                vec3.normalize(tmpvec3, tmpvec3);
                quat.AxisAngle(tmpvec3, Math.PI,out);
                return out;
            } else if (dot > 0.999999) {
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            } else {
                vec3.cross(tmpvec3, from, to);
                out[0] = tmpvec3[0];
                out[1] = tmpvec3[1];
                out[2] = tmpvec3[2];
                out[3] = 1 + dot;
                return quat.normalize(out, out);
            }
        }
        static myLookRotation(dir:vec3, out:quat,up:vec3=vec3.UP)
        {
            if(vec3.exactEquals(dir,vec3.ZERO))
            {
                console.log("Zero direction in MyLookRotation");
                return quat.norot;
            }
            if (!vec3.exactEquals(dir,up)) {
    
                let tempv=vec3.create();
                vec3.scale(up,vec3.dot(up,dir),tempv);
                vec3.subtract(dir,tempv,tempv);
                let qu=quat.create();
                this.rotationTo(vec3.FORWARD,tempv,qu);
                let qu2=quat.create();
                this.rotationTo(tempv,dir,qu2);
                quat.multiply(qu,qu2,out);
            }
            else {
                this.rotationTo(vec3.FORWARD,dir,out);
            }
        }
        // /**
        //  * 
        //  * @param pos transform self pos
        //  * @param targetpos targetpos
        //  * @param out 
        //  * @param up 
        //  */
        // static lookat(pos: vec3, targetpos: vec3, out: quat,up:vec3=vec3.UP)
        // {
        //     let baseDir=vec3.BACKWARD;
    
        //     let dir = vec3.create();
        //     vec3.subtract(targetpos, pos, dir);
        //     vec3.normalize(dir, dir);
        //     let dot = vec3.dot(baseDir, dir);
        //     if (Math.abs(dot - (-1.0)) < 0.000001)
        //     {
        //         this.AxisAngle(vec3.UP, Math.PI, out);
        //     }else if(Math.abs(dot - 1.0) < 0.000001)
        //     {
        //         quat.identity(out);
        //     }else
        //     {
        //         dot = clamp(dot, -1, 1);
        //         let rotangle = Math.acos(dot);
        //         let rotAxis = vec3.create();
        //         vec3.cross(baseDir, dir, rotAxis);
        //         vec3.normalize(rotAxis,rotAxis);
        //         quat.AxisAngle(rotAxis, rotangle, out);
        //     }
    
        //     let targetdirx:vec3=vec3.create();
        //     vec3.cross(up,out,targetdirx);
        //     let dotx = vec3.dot(targetdirx,vec3.RIGHT);
        //     let rot2=quat.create();
        //     if (Math.abs(dotx - 1.0) < 0.000001)
        //     {
        //     }else if(Math.abs(dotx - 1.0) < 0.000001)
        //     {
        //         this.AxisAngle(vec3.FORWARD, Math.PI, rot2);
        //         quat.multiply(out,rot2,out);
        //     }else
        //     {
        //         let rotAxis=vec3.create();
        //         vec3.cross(vec3.RIGHT,targetdirx,rotAxis);
        //         dotx = clamp(dotx, -1, 1);
        //         let rotangle = Math.acos(dotx);
        //         quat.AxisAngle(rotAxis, rotangle, rot2);
        //         quat.multiply(out,rot2,out);
        //     }
    
        //     vec3.recycle(dir);
        //     // vec3.recycle(rotAxis);
    
        //     // let dir = vec3.create();
        //     // vec3.subtract(targetpos, pos, dir);
        //     // vec3.normalize(dir, dir);
        //     // this.rotationTo(vec3.BACKWARD,dir,out);
        // }
    
        static LookRotation(lookAt:vec3,up:vec3=vec3.UP)
        {
            /*Vector forward = lookAt.Normalized();
            Vector right = Vector::Cross(up.Normalized(), forward);
            Vector up = Vector::Cross(forward, right);*/
            
            // Vector forward = lookAt.Normalized();
            // Vector::OrthoNormalize(&up, &forward); // Keeps up the same, make forward orthogonal to up
            // Vector right = Vector::Cross(up, forward);
            
            // Quaternion ret;
            // ret.w = sqrtf(1.0f + right.x + up.y + forward.z) * 0.5f;
            // float w4_recip = 1.0f / (4.0f * ret.w);
            // ret.x = (forward.y - up.z) * w4_recip;
            // ret.y = (right.z - forward.x) * w4_recip;
            // ret.z = (up.x - right.y) * w4_recip;
            
            // return ret;
    
            let forward=vec3.create();
            vec3.normalize(lookAt,forward);
            let right=vec3.create();
            vec3.cross(up,forward,right);
        }
    
        static transformVector(src: quat, vector: vec3, out: vec3) {
            var x1: number, y1: number, z1: number, w1: number;
            var x2: number = vector[0], y2: number = vector[1], z2: number = vector[2];
    
            w1 = -src[0] * x2 - src[1] * y2 - src[2] * z2;
            x1 = src[3] * x2 + src[1] * z2 - src[2] * y2;
            y1 = src[3] * y2 - src[0] * z2 + src[2] * x2;
            z1 = src[3] * z2 + src[0] * y2 - src[1] * x2;
    
            out.x = -w1 * src[0] + x1 * src[3] - y1 * src[2] + z1 * src[1];
            out.y = -w1 * src[1] + x1 * src[2] + y1 * src[3] - z1 * src[0];
            out.z = -w1 * src[2] - x1 * src[1] + y1 * src[0] + z1 * src[3];
    
        }
        static unitxyzToRotation(xAxis: vec3, yAxis: vec3, zAxis: vec3, out: quat)
        {
            var m11 = xAxis[0], m12 = yAxis[0], m13 = zAxis[0];
            var m21 = xAxis[1], m22 = yAxis[1], m23 = zAxis[1];
            var m31 = xAxis[2], m32 = yAxis[2], m33 = zAxis[2];
            var trace = m11 + m22 + m33;
            var s;
            if (trace > 0)
            {
    
                s = 0.5 / Math.sqrt(trace + 1.0);
    
                out.w = 0.25 / s;
                out.x = (m32 - m23) * s;
                out.y = (m13 - m31) * s;
                out.z = (m21 - m12) * s;
            } else if (m11 > m22 && m11 > m33)
            {
    
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
    
                out.w = (m32 - m23) / s;
                out.x = 0.25 * s;
                out.y = (m12 + m21) / s;
                out.z = (m13 + m31) / s;
            } else if (m22 > m33)
            {
    
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
    
                out.w = (m13 - m31) / s;
                out.x = (m12 + m21) / s;
                out.y = 0.25 * s;
                out.z = (m23 + m32) / s;
            } else
            {
    
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
    
                out.w = (m21 - m12) / s;
                out.x = (m13 + m31) / s;
                out.y = (m23 + m32) / s;
                out.z = 0.25 * s;
            }
        }
        static lookat(pos: vec3, targetpos: vec3, out: quat,up:vec3=vec3.UP)
        {
            // let baseDir=vec3.BACKWARD;
            let dirz = vec3.create();
            vec3.subtract(pos,targetpos, dirz);
            vec3.normalize(dirz, dirz);
    
            let dirx:vec3=vec3.create();
            vec3.cross(up,dirz,dirx);
            vec3.normalize(dirx, dirx);
    
            let diry:vec3=vec3.create();
            vec3.cross(dirz,dirx,diry);
            // vec3.normalize(diry, diry);
    
            this.unitxyzToRotation(dirx,diry,dirz,out);
            
            vec3.recycle(dirx);
            vec3.recycle(diry);
            vec3.recycle(dirz);
        }
        
        /**
         * Returns whether or not the vectors have approximately the same elements in the same quat.
         *
         * @param {vec4} a The first vector.
         * @param {vec4} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static equals (a: quat, b: quat): boolean{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3];
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3];
            return Math.abs(a0 - b0) <= EPSILON && Math.abs(a1 - b1) <= EPSILON && Math.abs(a2 - b2) <= EPSILON && Math.abs(a3 - b3) <= EPSILON;
        }
        /**
         * 
         * @param from 
         * @param to 
         * @param out 
         */
        static fromToRotation(from:MathD.vec3,to:MathD.vec3,out:MathD.quat)
        {
            let dir1=MathD.vec3.create();
            let dir2=MathD.vec3.create();

            vec3.normalize(from,dir1);
            vec3.normalize(to,dir2);

            let dir=MathD.vec3.create();
            MathD.vec3.cross(dir1,dir2,dir);
            if(MathD.vec3.magnitude(dir)<0.001)
            {
                MathD.quat.identity(out);
            }else
            {
                let dot=MathD.vec3.dot(dir1,dir2);
                MathD.vec3.normalize(dir,dir);
                quat.AxisAngle(dir,Math.acos(dot),out);
            }
            MathD.vec3.recycle(dir);
            MathD.vec3.recycle(dir1);
            MathD.vec3.recycle(dir2);

        }
    }
}
