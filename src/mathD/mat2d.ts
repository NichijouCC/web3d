namespace MathD
{
    export class mat2d extends Float32Array 
    {
        private static Recycle:mat2d[]=[];
        public static create()
        {
            if(mat2d.Recycle&&mat2d.Recycle.length>0)
            {
                let item=mat2d.Recycle.pop();
                mat2d.identity(item);
                return item;
            }else
            {
                let item=new Float32Array(6);
                this[0]=1;
                this[3]=1;
                return item;
            }
        }
        public static clone(from: mat2d): mat2d
        {
            if(mat2d.Recycle.length>0)
            {
                let item=mat2d.Recycle.pop();
                mat2d.copy(from,item);
                return item;
            }else
            {
                let out = new Float32Array(9);
                out[0] = from[0];
                out[1] = from[1];
                out[2] = from[2];
                out[3] = from[3];
                out[4] = from[4];
                out[5] = from[5];
                return out;
            }
        }
        public static recycle(item:mat2d)
        {
            mat2d.Recycle.push(item);
        }
        public static disposeRecycledItems()
        {
            mat2d.Recycle.length=0;
        }
        // private constructor()
        // {
        //     super(6);
        //     this[0]=1;
        //     this[3]=1;
        // }
    
        /**
         * Copy the values from one mat2d to another
         *
         * @param out the receiving matrix
         * @param a the source matrix
         * @returns out
         */
        public static copy(a: mat2d,out: mat2d): mat2d{
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        }
    
        /**
         * Set a mat2d to the identity matrix
         *
         * @param out the receiving matrix
         * @returns out
         */
        public static identity(out: mat2d): mat2d{
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
    
    
        /**
         * Inverts a mat2d
         *
         * @param out the receiving matrix
         * @param a the source matrix
         * @returns out
         */
        public static invert(out: mat2d, a: mat2d): mat2d | null{
            let aa = a[0],
                ab = a[1],
                ac = a[2],
                ad = a[3];
            let atx = a[4],
                aty = a[5];
            
            let det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            
            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        }
    
        /**
         * Calculates the determinant of a mat2d
         *
         * @param a the source matrix
         * @returns determinant of a
         */
        public static determinant(a: mat2d): number{
            return a[0] * a[3] - a[1] * a[2];
        }
    
        /**
         * Multiplies two mat2d's
         *
         * @param out the receiving matrix
         * @param a the first operand
         * @param b the second operand
         * @returns out
         */
        public static multiply(a: mat2d, b: mat2d,out: mat2d): mat2d{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3],
                a4 = a[4],
                a5 = a[5];
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3],
                b4 = b[4],
                b5 = b[5];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            out[4] = a0 * b4 + a2 * b5 + a4;
            out[5] = a1 * b4 + a3 * b5 + a5;
            return out;
        }
    
        /**
         * Rotates a mat2d by the given angle
         *
         * @param out the receiving matrix
         * @param a the matrix to rotate
         * @param rad the angle to rotate the matrix by
         * @returns out
         */
        public static rotate(out: mat2d, a: mat2d, rad: number): mat2d{
            let a0 = a[0],
            a1 = a[1],
            a2 = a[2],
            a3 = a[3],
            a4 = a[4],
            a5 = a[5];
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
    
        /**
         * Scales the mat2d by the dimensions in the given vec2
         *
         * @param out the receiving matrix
         * @param a the matrix to translate
         * @param v the vec2 to scale the matrix by
         * @returns out
         **/
        public static scale(out: mat2d, a: mat2d, v: vec2): mat2d{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3],
                a4 = a[4],
                a5 = a[5];
            let v0 = v[0],
                v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
    
        /**
         * Translates the mat2d by the dimensions in the given vec2
         *
         * @param out the receiving matrix
         * @param a the matrix to translate
         * @param v the vec2 to translate the matrix by
         * @returns out
         **/
        public static translate(out: mat2d, a: mat2d, v: vec2): mat2d{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3],
                a4 = a[4],
                a5 = a[5];
            let v0 = v[0],
                v1 = v[1];
            out[0] = a0;
            out[1] = a1;
            out[2] = a2;
            out[3] = a3;
            out[4] = a0 * v0 + a2 * v1 + a4;
            out[5] = a1 * v0 + a3 * v1 + a5;
            return out;
        }
    
        /**
         * Creates a matrix from a given angle
         * This is equivalent to (but much faster than):
         *
         *     mat2d.identity(dest);
         *     mat2d.rotate(dest, dest, rad);
         *
         * @param {mat2d} out mat2d receiving operation result
         * @param {number} rad the angle(弧度) to rotate the matrix by
         * @returns {mat2d} out
         */
        public static fromRotation (rad: number,out: mat2d): mat2d{
            let s = Math.sin(rad),
            c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = -s;
            out[3] = c;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
    
        public static getRotationing(mat: mat2d,out:refNumber,scale:vec2=null): refNumber
        {
            let outscale:vec2=scale;
            if(outscale==null)
            {
                outscale=vec2.create();
                this.getScaling(mat,outscale);
            }
            let cosa=mat[0]/outscale[0];
            let sina=mat[1]/outscale[1];
    
            if(cosa>=0)
            {
                out.value=Math.asin(sina);
            }else
            {
                out.value=Math.asin(-sina)+Math.PI;
            }
            return out;
        }
        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     mat2d.identity(dest);
         *     mat2d.scale(dest, dest, vec);
         *
         * @param {mat2d} out mat2d receiving operation result
         * @param {vec2} v Scaling vector
         * @returns {mat2d} out
         */
        public static fromScaling (v: vec2,out: mat2d): mat2d{
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = v[1];
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        public static getScaling(mat: mat2d,out: vec2): vec2
        {
            let m11 = mat[0];
            let m12 = mat[1];
            let m21 = mat[2];
            let m22 = mat[3];
            
            out[0] = Math.sqrt(m11 * m11 + m12 * m12);
            out[1] = Math.sqrt(m21 * m21 + m22 * m22);
            return out;
        }
    
        /**
         * Creates a matrix from a vector translation
         * This is equivalent to (but much faster than):
         *
         *     mat2d.identity(dest);
         *     mat2d.translate(dest, dest, vec);
         *
         * @param {mat2d} out mat2d receiving operation result
         * @param {vec2} v Translation vector
         * @returns {mat2d} out
         */
        public static fromTranslation (v: vec2,out: mat2d): mat2d{
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = v[0];
            out[5] = v[1];
            return out;
        }
    
        public static getTranslationing(mat: mat2d,out: vec2): vec2
        {
            out[0] = mat[4];
            out[1] = mat[5];
            return out;
        }
    
        public static RTS(pos: vec2, scale: vec2, rot: number, out: mat2d)
        {
            var matS = mat2d.create();
            this.fromScaling(scale, matS);
            var matR =mat2d.create();
            this.fromRotation(rot, matR);
            this.multiply(matR, matS, out);
    
            out[4] = pos[0];
            out[5] = pos[1];
    
            mat2d.recycle(matS);
            mat2d.recycle(matR);
        }
    
        public static decompose(src:mat2d,pos:vec2,scale:vec2,rot:refNumber)
        {
            this.getTranslationing(src,pos);
            this.getScaling(src,scale);
            this.getRotationing(src,rot,scale);
        }
        /**
         * Returns a string representation of a mat2d
         *
         * @param a matrix to represent as a string
         * @returns string representation of the matrix
         */
        public static str(a: mat2d): string{
            return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
        }
    
        /**
         * Returns Frobenius norm of a mat2d
         *
         * @param a the matrix to calculate Frobenius norm of
         * @returns Frobenius norm
         */
        public static frob(a: mat2d): number {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
            }
    
        /**
         * Adds two mat2d's
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the first operand
         * @param {mat2d} b the second operand
         * @returns {mat2d} out
         */
        public static add (out: mat2d, a: mat2d, b: mat2d): mat2d {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            return out;
            }
    
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the first operand
         * @param {mat2d} b the second operand
         * @returns {mat2d} out
         */
        public static subtract(out: mat2d, a: mat2d, b: mat2d): mat2d{
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            return out;
            }
    
    
        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the matrix to scale
         * @param {number} b amount to scale the matrix's elements by
         * @returns {mat2d} out
         */
        public static multiplyScalar (out: mat2d, a: mat2d, b: number): mat2d {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            return out;
            }
    
        /**
         * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
         *
         * @param {mat2d} out the receiving vector
         * @param {mat2d} a the first operand
         * @param {mat2d} b the second operand
         * @param {number} scale the amount to scale b's elements by before adding
         * @returns {mat2d} out
         */
        public static multiplyScalarAndAdd (out: mat2d, a: mat2d, b: mat2d, scale: number): mat2d{
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            out[4] = a[4] + b[4] * scale;
            out[5] = a[5] + b[5] * scale;
            return out;
            }
    
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {mat2d} a The first matrix.
         * @param {mat2d} b The second matrix.
         * @returns {boolean} True if the matrices are equal, false otherwise.
         */
        public static exactEquals (a: mat2d, b: mat2d): boolean{
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
            }
    
        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         *
         * @param {mat2d} a The first matrix.
         * @param {mat2d} b The second matrix.
         * @returns {boolean} True if the matrices are equal, false otherwise.
         */
        public static equals (a: mat2d, b: mat2d): boolean {
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3],
                a4 = a[4],
                a5 = a[5];
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3],
                b4 = b[4],
                b5 = b[5];
            return Math.abs(a0 - b0) <= EPSILON && Math.abs(a1 - b1) <= EPSILON && Math.abs(a2 - b2) <= EPSILON && Math.abs(a3 - b3) <= EPSILON && Math.abs(a4 - b4) <= EPSILON && Math.abs(a5 - b5) <= EPSILON;
          }
    }
}
