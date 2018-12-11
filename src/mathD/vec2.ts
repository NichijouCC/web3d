namespace MathD
{
    export class vec2 extends Float32Array
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
    
        private static Recycle:vec2[]=[];
        public static create(x: number=0, y: number=0)
        {
            if(vec2.Recycle&&vec2.Recycle.length>0)
            {
                let item=vec2.Recycle.pop() as vec2;
                item[0]=x;
                item[1]=y;
                return item;
            }else
            {
                let item=new vec2(x,y);
                // item[0]=x;
                // item[1]=y;
                return item;
            }
        }
        public static clone(from: vec2): vec2
        {
            if(vec2.Recycle.length>0)
            {
                let item=vec2.Recycle.pop() as vec2;
                vec2.copy(from,item);
                return item;
            }else
            {
                let item=new vec2(from[0],from[1]);
                // item[0]=from[0];
                // item[1]=from[1];
                return item;
            }
        }
        public static recycle(item:vec2)
        {
            vec2.Recycle.push(item);
        }
        public static disposeRecycledItems()
        {
            vec2.Recycle.length=0;
        }
        private constructor(x: number=0, y: number=0)
        {
            super(2);
            this[0]=x;
            this[1]=y;
        }
        /**
         * Copy the values from one vec2 to another
         *
         * @param out the receiving vector
         * @param a the source vector
         * @returns out
         */
        public static copy(a: vec2|number[],out: vec2): vec2
        {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }
    
        /**
         * Adds two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static add(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        }
    
        /**
         * Subtracts vector b from vector a
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static subtract(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        }
    
        /**
         * Multiplies two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static multiply(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }
    
        /**
         * Multiplies two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        //public static mul(a: vec2, b: vec2,out: vec2): vec2 { return; }
    
        /**
         * Divides two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static divide(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        }
    
        /**
         * Divides two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        //public static div(a: vec2, b: vec2,out: vec2): vec2 { return; }
    
        /**
         * Math.ceil the components of a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to ceil
         * @returns {vec2} out
         */
        public static ceil(a: vec2,out: vec2): vec2
        {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            return out;
        }
    
        /**
         * Math.floor the components of a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to floor
         * @returns {vec2} out
         */
        public static floor(a: vec2,out: vec2): vec2
        {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            return out;
        }
    
        /**
         * Returns the minimum of two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static min(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        }
    
        /**
         * Returns the maximum of two vec2's
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static max(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            return out;
        }
    
        /**
         * Math.round the components of a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to round
         * @returns {vec2} out
         */
        public static round(a: vec2,out: vec2): vec2
        {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            return out;
        }
    
    
        /**
         * Scales a vec2 by a scalar number
         *
         * @param out the receiving vector
         * @param a the vector to scale
         * @param b amount to scale the vector by
         * @returns out
         */
        public static scale(a: vec2, b: number,out: vec2): vec2
        {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            return out;
        }
    
        public static scaleByVec2(a: vec2, b: vec2,out: vec2): vec2
        {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }
        /**
         * Adds two vec2's after scaling the second operand by a scalar value
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @param scale the amount to scale b by before adding
         * @returns out
         */
        public static scaleAndAdd(a: vec2, b: vec2, scale: number,out: vec2): vec2
        {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            return out;
        }
    
        /**
         * Calculates the euclidian distance between two vec2's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns distance between a and b
         */
        public static distance(a: vec2, b: vec2): number
        {
            let x = b[0] - a[0],
                y = b[1] - a[1];
            return Math.sqrt(x * x + y * y);
        }
    
        /**
         * Calculates the euclidian distance between two vec2's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns distance between a and b
         */
        //public static dist(a: vec2, b: vec2): number { return; }
    
        /**
         * Calculates the squared euclidian distance between two vec2's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns squared distance between a and b
         */
        public static squaredDistance(a: vec2, b: vec2): number
        {
            let x = b[0] - a[0],
                y = b[1] - a[1];
            return x * x + y * y;
        }
    
        /**
         * Calculates the squared euclidian distance between two vec2's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns squared distance between a and b
         */
        //public static sqrDist(a: vec2, b: vec2): number { return; }
    
        /**
         * Calculates the length of a vec2
         *
         * @param a vector to calculate length of
         * @returns length of a
         */
        public static length_(a: vec2): number
        {
            let x = a[0],
                y = a[1];
            return Math.sqrt(x * x + y * y);
        }
    
        /**
         * Calculates the length of a vec2
         *
         * @param a vector to calculate length of
         * @returns length of a
         */
        //public static len(a: vec2): number { return; }
    
        /**
         * Calculates the squared length of a vec2
         *
         * @param a vector to calculate squared length of
         * @returns squared length of a
         */
        public static squaredLength(a: vec2): number
        {
            let x = a[0],
                y = a[1];
            return x * x + y * y;
        }
    
        /**
         * Calculates the squared length of a vec2
         *
         * @param a vector to calculate squared length of
         * @returns squared length of a
         */
        //public static sqrLen(a: vec2): number { return; }
    
        /**
         * Negates the components of a vec2
         *
         * @param out the receiving vector
         * @param a vector to negate
         * @returns out
         */
        public static negate(a: vec2,out: vec2): vec2
        {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        }
    
        /**
         * Returns the inverse of the components of a vec2
         *
         * @param out the receiving vector
         * @param a vector to invert
         * @returns out
         */
        public static inverse(a: vec2,out: vec2): vec2
        {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            return out;
        }
    
        /**
         * Normalize a vec2
         *
         * @param out the receiving vector
         * @param a vector to normalize
         * @returns out
         */
        public static normalize(a: vec2,out: vec2): vec2
        {
            let x = a[0],
                y = a[1];
            let len = x * x + y * y;
            if (len > 0)
            {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        }
    
        /**
         * Calculates the dot product of two vec2's
         *
         * @param a the first operand
         * @param b the second operand
         * @returns dot product of a and b
         */
        public static dot(a: vec2, b: vec2): number {
            return a[0] * b[0] + a[1] * b[1];
        }
    
        /**
         * Computes the cross product of two vec2's
         * Note that the cross product must by definition produce a 3D vector
         *
         * @param out the receiving vector
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static cross(a: vec2, b: vec2,out: vec3): vec2 {
            let z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        }
    
        /**
         * Performs a linear interpolation between two vec2's
         *
         * @param out the receiving vector
         * @param from the first operand
         * @param to the second operand
         * @param lerp interpolation amount between the two inputs
         * @returns out
         */
        public static lerp(from: vec2, to: vec2, lerp: number,out: vec2): vec2 {
            let ax = from[0],
            ay = from[1];
            out[0] = ax + lerp * (to[0] - ax);
            out[1] = ay + lerp * (to[1] - ay);
            return out;
        }
    
    
        /**
         * Generates a random vector with the given scale
         *
         * @param out the receiving vector
         * @param scale Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns out
         */
        public static random(scale: number=1,out: vec2): vec2 {
            scale = scale || 1.0;
            let r = Math.random() * 2.0 * Math.PI;
            out[0] = Math.cos(r) * scale;
            out[1] = Math.sin(r) * scale;
            return out;
        }
    
        // /**
        //  * Transforms the vec2 with a mat2
        //  *
        //  * @param out the receiving vector
        //  * @param a the vector to transform
        //  * @param m matrix to transform with
        //  * @returns out
        //  */
        // public static transformMat2(out: vec2, a: vec2, m: mat2): vec2 {
        //     let x = a[0],
        //     y = a[1];
        //     out[0] = m[0] * x + m[2] * y;
        //     out[1] = m[1] * x + m[3] * y;
        //     return out;
        // }
    
        /**
         * Transforms the vec2 with a mat2d
         *
         * @param out the receiving vector
         * @param a the vector to transform
         * @param m matrix to transform with
         * @returns out
         */
        public static transformMat2d(a: vec2, m: mat2d,out: vec2): vec2 {
            let x = a[0],
            y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        }
    
        // /**
        //  * Transforms the vec2 with a mat3
        //  * 3rd vector component is implicitly '1'
        //  *
        //  * @param out the receiving vector
        //  * @param a the vector to transform
        //  * @param m matrix to transform with
        //  * @returns out
        //  */
        // public static transformMat3(out: vec2, a: vec2, m: mat3): vec2 {
        //     let x = a[0],
        //     y = a[1];
        //     out[0] = m[0] * x + m[3] * y + m[6];
        //     out[1] = m[1] * x + m[4] * y + m[7];
        //     return out;
        // }
    
        /**
         * Transforms the vec2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         *
         * @param out the receiving vector
         * @param a the vector to transform
         * @param m matrix to transform with
         * @returns out
         */
        public static transformMat4(a: vec2, m: mat4,out: vec2): vec2 {
            let x = a[0];
            let y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        }
    
        // /**
        //  * Perform some operation over an array of vec2s.
        //  *
        //  * @param a the array of vectors to iterate over
        //  * @param stride Number of elements between the start of each vec2. If 0 assumes tightly packed
        //  * @param offset Number of elements to skip at the beginning of the array
        //  * @param count Number of vec2s to iterate over. If 0 iterates over entire array
        //  * @param fn Function to call for each vector in the array
        //  * @param arg additional argument to pass to fn
        //  * @returns a
        //  */
        // public static forEach(a: Float32Array, stride: number, offset: number, count: number,
        //     fn: (a: vec2, b: vec2, arg: any) => void, arg: any): Float32Array { return; }
    
        // /**
        //  * Perform some operation over an array of vec2s.
        //  *
        //  * @param a the array of vectors to iterate over
        //  * @param stride Number of elements between the start of each vec2. If 0 assumes tightly packed
        //  * @param offset Number of elements to skip at the beginning of the array
        //  * @param count Number of vec2s to iterate over. If 0 iterates over entire array
        //  * @param fn Function to call for each vector in the array
        //  * @returns a
        //  */
        // public static forEach(a: Float32Array, stride: number, offset: number, count: number,
        //     fn: (a: vec2, b: vec2) => void): Float32Array {    
        // }
    
        /**
         * Returns a string representation of a vector
         *
         * @param a vector to represent as a string
         * @returns string representation of the vector
         */
        public static str(a: vec2): string { 
            return 'vec2(' + a[0] + ', ' + a[1] + ')';
        }
    
        /**
         * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
         *
         * @param {vec2} a The first vector.
         * @param {vec2} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static exactEquals(a: vec2, b: vec2): boolean {
             return a[0] === b[0] && a[1] === b[1]; }
    
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         *
         * @param {vec2} a The first vector.
         * @param {vec2} b The second vector.
         * @returns {boolean} True if the vectors are equal, false otherwise.
         */
        public static equals(a: vec2, b: vec2): boolean {
            let a0 = a[0],
                a1 = a[1];
            let b0 = b[0],
                b1 = b[1];
            return Math.abs(a0 - b0) <= EPSILON&& Math.abs(a1 - b1) <= EPSILON;
      
        }
    
    
    }
    
}

