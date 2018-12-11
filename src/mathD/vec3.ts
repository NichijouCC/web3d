namespace MathD
{
    export class vec3 extends Float32Array 
    {
        public static readonly UP=vec3.create(0,1,0);
        public static readonly DOWN=vec3.create(0,-1,0);
        
        public static readonly RIGHT=vec3.create(1,0,0);
        public static readonly LEFT=vec3.create(-1,0,0);
        
        public static readonly FORWARD=vec3.create(0,0,1);
        public static readonly BACKWARD=vec3.create(0,0,-1);
        
        public static readonly ONE=vec3.create(1,1,1);
        public static readonly ZERO=vec3.create(0,0,0);
        
        public get x()
        {
            return this[0];
        }
        public set x(value:number)
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
    
        private static Recycle:vec3[]=[];
        public static create(x: number=0, y: number=0, z: number=0)
        {
            if(vec3.Recycle&&vec3.Recycle.length>0)
            {
                let item=vec3.Recycle.pop() as vec3;
                item[0]=x;
                item[1]=y;
                item[2]=z;
                return item;
            }else
            {
                // let item=new Float32Array(3);
                // item[0]=x;
                // item[1]=y;
                // item[2]=z;
                let item=new vec3(x,y,z);
                return item;
            }
        }
        public static clone(from: vec3): vec3
        {
            if(vec3.Recycle.length>0)
            {
                let item=vec3.Recycle.pop()as vec3;
                
                vec3.copy(from,item);
                return item;
            }else
            {
                //let item=new Float32Array(3);
                let item=new vec3(from[0],from[1],from[2]);
                // item[0]=from[0];
                // item[1]=from[1];
                // item[2]=from[2];
                return item;
            }
        }
        public static recycle(item:vec3)
        {
            vec3.Recycle.push(item);
        }
        public static disposeRecycledItems()
        {
            vec3.Recycle.length=0;
        }
    
        private constructor(x: number=0, y: number=0, z: number=0)
        {
            super(3);
            this[0]=x;
            this[1]=y;
            this[2]=z;
        }
        /**
         * Copy the values from one vec3 to another
         *
         * @param out the receiving vector
         * @param src the source vector
         * @returns out
         */
        public static copy(from: vec3|number[],out: vec3): vec3{
            out[0] = from[0];
            out[1] = from[1];
            out[2] = from[2];
            return out;    
        }
    
        /**
         * Adds two vec3's
         *
         * @param out the receiving vector
         * @param lhs the first operand
         * @param rhs the second operand
         * @returns out
         */
        public static add(lhs: vec3, rhs: vec3,out: vec3): vec3{
            out[0] = lhs[0] + rhs[0];
            out[1] = lhs[1] + rhs[1];
            out[2] = lhs[2] + rhs[2];
            return out;
        }
    
        public static toZero(a:vec3)
        {
            a[0]=a[1]=a[2]=0;
        }
    
        /**
         * Subtracts vector b from vector a
         *
         * @param out the receiving vector
         * @param lhs the first operand
         * @param rhs the second operand
         * @returns out
         */
        public static subtract(lhs: vec3, rhs: vec3,out: vec3): vec3{
            out[0] = lhs[0] - rhs[0];
            out[1] = lhs[1] - rhs[1];
            out[2] = lhs[2] - rhs[2];
            return out;
        }
        /**
         * Multiplies two vec3's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static multiply(a: vec3, b: vec3,out: vec3): vec3{
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            return out;
        }
    
        public static center(a:vec3,b:vec3,out:vec3)
        {
            this.add(a,b,out);
            this.scale(out,0.5,out);
            return out;
        }
    
        /**
         * Divides two vec3's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static divide(out: vec3, a: vec3, b: vec3): vec3{
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            return out;
        }
    
        /**
         * Math.ceil the components of a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to ceil
         * @returns {vec3} out
         */
        public static ceil (out: vec3, a: vec3): vec3{
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            out[2] = Math.ceil(a[2]);
            return out;
        }
    
        /**
         * Math.floor the components of a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to floor
         * @returns {vec3} out
         */
        public static floor (out: vec3, a: vec3): vec3{
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            out[2] = Math.floor(a[2]);
            return out;
        }
    
        /**
         * Returns the minimum of two vec3's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static min(a: vec3, b: vec3,out: vec3): vec3{
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            return out;
        }
    
        /**
         * Returns the maximum of two vec3's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static max(out: vec3, a: vec3, b: vec3): vec3{
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            return out;
        }
    
        /**
         * Math.round the components of a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to round
         * @returns {vec3} out
         */
        public static round (out: vec3, a: vec3): vec3{
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            out[2] = Math.round(a[2]);
            return out;
        }
    
        /**
         * Scales a vec3 by a scalar number
         *
         * @param out the receiving vector
         * @param a the vector to scale
         * @param b amount to scale the vector by
         * @returns out
         */
        public static scale(a: vec3, b: number,out: vec3): vec3{
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            return out;
        }
    
        /**
         * Adds two vec3's after scaling the second operand by a scalar value
         *
         * @param out the receiving vector
         * @param lhs the first operand
         * @param rhs the second operand
         * @param scale the amount to scale b by before adding
         * @returns out
         */
        public static AddscaledVec(lhs: vec3, rhs: vec3, scale: number,out: vec3): vec3{
            out[0] = lhs[0] + rhs[0] * scale;
            out[1] = lhs[1] + rhs[1] * scale;
            out[2] = lhs[2] + rhs[2] * scale;
            return out;
        }
    
        /**
         * Calculates the euclidian distance between two vec3's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns distance between a and b
         */
        public static distance(a: vec3, b: vec3): number{
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
    
        /**
         * Calculates the squared euclidian distance between two vec3's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns squared distance between a and b
         */
        public static squaredDistance(a: vec3, b: vec3): number{
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            return x * x + y * y + z * z;
        }
    
        /**
         * Calculates the length of a vec3
         *
         * @param a vector to calculate length of
         * @returns length of a
         */
        public static magnitude(a: vec3): number{
            let x = a[0];
            let y = a[1];
            let z = a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
    
        /**
         * Calculates the squared length of a vec3
         *
         * @param a vector to calculate squared length of
         * @returns squared length of a
         */
        public static squaredLength(a: vec3): number{
            let x = a[0];
            let y = a[1];
            let z = a[2];
            return x * x + y * y + z * z;
        }
    
        /**
         * Negates the components of a vec3
         *
         * @param out the receiving vector
         * @param a vector to negate
         * @returns out
         */
        public static negate(a: vec3,out: vec3): vec3{
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            return out;
        }
    
        /**
         * Returns the inverse of the components of a vec3
         *
         * @param out the receiving vector
         * @param a vector to invert
         * @returns out
         */
        public static inverse(a: vec3,out: vec3): vec3{
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            return out;
        }
    
        /**
         * Normalize a vec3
         *
         * @param out the receiving vector
         * @param src vector to normalize
         * @returns out
         */
        public static normalize(src: vec3,out: vec3): vec3{
            let x = src[0];
            let y = src[1];
            let z = src[2];
            let len = x * x + y * y + z * z;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = src[0] * len;
                out[1] = src[1] * len;
                out[2] = src[2] * len;
            }
            return out;
        }
    
        /**
         * Calculates the dot product of two vec3's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns dot product of a and b
         */
        public static dot(a: vec3, b: vec3): number{
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
    
        /**
         * Computes the cross product of two vec3's
         *
         * @param out the receiving vector
         * @param lhs the first operand
         * @param rhs the second operand
         * @returns out
         */
        public static cross(lhs: vec3, rhs: vec3,out: vec3): vec3{
            let ax = lhs[0],
                ay = lhs[1],
                az = lhs[2];
            let bx = rhs[0],
                by = rhs[1],
                bz = rhs[2];
        
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        }
    
        /**
         * Performs a linear interpolation between two vec3's
         *
         * @param out the receiving vector
         * @param lhs the first operand
         * @param rhs the second operand
         * @param lerp interpolation amount between the two inputs
         * @returns out
         */
        public static lerp(lhs: vec3, rhs: vec3, lerp: number,out: vec3): vec3{
            let ax = lhs[0];
            let ay = lhs[1];
            let az = lhs[2];
            out[0] = ax + lerp * (rhs[0] - ax);
            out[1] = ay + lerp * (rhs[1] - ay);
            out[2] = az + lerp * (rhs[2] - az);
            return out;
        }
    
        /**
         * Performs a hermite interpolation with two control points
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @param {vec3} c the third operand
         * @param {vec3} d the fourth operand
         * @param {number} t interpolation amount between the two inputs
         * @returns {vec3} out
         */
        public static hermite (out: vec3, a: vec3, b: vec3, c: vec3, d: vec3, t: number): vec3{
            let factorTimes2 = t * t;
            let factor1 = factorTimes2 * (2 * t - 3) + 1;
            let factor2 = factorTimes2 * (t - 2) + t;
            let factor3 = factorTimes2 * (t - 1);
            let factor4 = factorTimes2 * (3 - 2 * t);
            
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            
            return out;
        }
    
        /**
         * Performs a bezier interpolation with two control points
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @param {vec3} c the third operand
         * @param {vec3} d the fourth operand
         * @param {number} t interpolation amount between the two inputs
         * @returns {vec3} out
         */
        public static bezier (out: vec3, a: vec3, b: vec3, c: vec3, d: vec3, t: number): vec3{
            let inverseFactor = 1 - t;
            let inverseFactorTimesTwo = inverseFactor * inverseFactor;
            let factorTimes2 = t * t;
            let factor1 = inverseFactorTimesTwo * inverseFactor;
            let factor2 = 3 * t * inverseFactorTimesTwo;
            let factor3 = 3 * factorTimes2 * inverseFactor;
            let factor4 = factorTimes2 * t;
            
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            
            return out;
        }
    
    
        /**
         * Generates a random vector with the given scale
         *
         * @param out the receiving vector
         * @param [scale] Length of the resulting vector. If omitted, a unit vector will be returned
         * @returns out
         */
        public static random(out: vec3, scale: number=1): vec3{
            scale = scale || 1.0;
            
                let r = Math.random()* 2.0 * Math.PI;
                let z = Math.random() * 2.0 - 1.0;
                let zScale = Math.sqrt(1.0 - z * z) * scale;
            
                out[0] = Math.cos(r) * zScale;
                out[1] = Math.sin(r) * zScale;
                out[2] = z * scale;
                return out;
        }
    
    
        // /**
        //  * Transforms the vec3 with a mat3.
        //  *
        //  * @param out the receiving vector
        //  * @param a the vector to transform
        //  * @param m the 3x3 matrix to transform with
        //  * @returns out
        //  */
        // public static transformMat3(out: vec3, a: vec3, m: mat3): vec3{
        //     let x = a[0],
        //     y = a[1],
        //     z = a[2];
        // out[0] = x * m[0] + y * m[3] + z * m[6];
        // out[1] = x * m[1] + y * m[4] + z * m[7];
        // out[2] = x * m[2] + y * m[5] + z * m[8];
        // return out;
        // }
    
        // /**
        //  * 转到mat4中
        //  * Transforms the vec3 with a mat4.
        //  * 4th vector component is implicitly '1'
        //  *
        //  * @param out the receiving vector
        //  * @param a the vector to transform
        //  * @param m matrix to transform with
        //  * @returns out
        //  */
        // public static transformMat4(out: vec3, a: vec3, m: mat4): vec3{
        //     let x = a[0],
        //         y = a[1],
        //         z = a[2];
        //     let w = m[3] * x + m[7] * y + m[11] * z + m[15];
        //     w = w || 1.0;
        //     out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        //     out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        //     out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        //     return out;
        // }
    
        
    
        /**
         * Transforms the vec3 with a quat
         *
         * @param out the receiving vector
         * @param a the vector to transform
         * @param q quaternion to transform with
         * @returns out
         */
        public static transformQuat(out: vec3, a: vec3, q: quat): vec3{
            // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
    
            let x = a[0],
                y = a[1],
                z = a[2];
            let qx = q[0],
                qy = q[1],
                qz = q[2],
                qw = q[3];
            
            // calculate quat * vec
            let ix = qw * x + qy * z - qz * y;
            let iy = qw * y + qz * x - qx * z;
            let iz = qw * z + qx * y - qy * x;
            let iw = -qx * x - qy * y - qz * z;
            
            // calculate result * inverse quat
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return out;
        }
    
    
        /**
         * Rotate a 3D vector around the x-axis
         * @param out The receiving vec3
         * @param a The vec3 point to rotate
         * @param b The origin of the rotation
         * @param c The angle of rotation
         * @returns out
         */
        public static rotateX(out: vec3, a: vec3, b: vec3, c: number): vec3{
            let p = [],
            r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            
            //perform rotation
            r[0] = p[0];
            r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
            r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
            
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            
            return out;
        }
    
        /**
         * Rotate a 3D vector around the y-axis
         * @param out The receiving vec3
         * @param a The vec3 point to rotate
         * @param b The origin of the rotation
         * @param c The angle of rotation
         * @returns out
         */
        public static rotateY(out: vec3, a: vec3, b: vec3, c: number): vec3{
            let p = [],
            r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            
            //perform rotation
            r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
            r[1] = p[1];
            r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
            
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            
            return out;
        }
    
        /**
         * Rotate a 3D vector around the z-axis
         * @param out The receiving vec3
         * @param a The vec3 point to rotate
         * @param b The origin of the rotation
         * @param c The angle of rotation
         * @returns out
         */
        public static rotateZ(out: vec3, a: vec3, b: vec3, c: number): vec3{
            let p = [],
            r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            
            //perform rotation
            r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
            r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
            r[2] = p[2];
            
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            
            return out;
        }
    
        // /**
        //  * Perform some operation over an array of vec3s.
        //  *
        //  * @param a the array of vectors to iterate over
        //  * @param stride Number of elements between the start of each vec3. If 0 assumes tightly packed
        //  * @param offset Number of elements to skip at the beginning of the array
        //  * @param count Number of vec3s to iterate over. If 0 iterates over entire array
        //  * @param fn Function to call for each vector in the array
        //  * @param arg additional argument to pass to fn
        //  * @returns a
        //  * @function
        //  */
        // public static forEach(a: Float32Array, stride: number, offset: number, count: number,
        //                       fn: (a: vec3, b: vec3, arg: any) => void, arg: any): Float32Array;
    
        // /**
        //  * Perform some operation over an array of vec3s.
        //  *
        //  * @param a the array of vectors to iterate over
        //  * @param stride Number of elements between the start of each vec3. If 0 assumes tightly packed
        //  * @param offset Number of elements to skip at the beginning of the array
        //  * @param count Number of vec3s to iterate over. If 0 iterates over entire array
        //  * @param fn Function to call for each vector in the array
        //  * @returns a
        //  * @function
        //  */
        // public static forEach(a: Float32Array, stride: number, offset: number, count: number,
        //                       fn: (a: vec3, b: vec3) => void): Float32Array;
    
        /**
         * Get the angle between two 3D vectors
         * @param a The first operand
         * @param b The second operand
         * @returns The angle in radians
         */
        public static angle(a: vec3, b: vec3): number{
            let tempA=vec3.clone(a);
            let tempB=vec3.clone(b);
            // let tempA = vec3.fromValues(a[0], a[1], a[2]);
            // let tempB = vec3.fromValues(b[0], b[1], b[2]);
            
            vec3.normalize(tempA, tempA);
            vec3.normalize(tempB, tempB);
            
            let cosine = vec3.dot(tempA, tempB);
            
            if (cosine > 1.0) {
                return 0;
            } else if (cosine < -1.0) {
                return Math.PI;
            } else {
                return Math.acos(cosine);
            }
        }
    
        /**
         * Returns a string representation of a vector
         *
         * @param a vector to represent as a string
         * @returns string representation of the vector
         */
        public static str(a: vec3): string{
            return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
        }
    
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         *
         * @param {vec3} a The first vector.
         * @param {vec3} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static exactEquals (a: vec3, b: vec3): boolean{
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        }
    
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         *
         * @param {vec3} a The first vector.
         * @param {vec3} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static equals (a: vec3, b: vec3): boolean{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2];
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2];
            return Math.abs(a0 - b0) <= EPSILON && Math.abs(a1 - b1) <= EPSILON&& Math.abs(a2 - b2) <= EPSILON;
        }
    
    }
    
}

