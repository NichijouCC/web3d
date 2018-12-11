namespace MathD
{
    export class mat4 extends Float32Array {
        
        private static Recycle:mat4[]=[];
        public static create()
        {
            if(mat4.Recycle&&mat4.Recycle.length>0)
            {
                let item=mat4.Recycle.pop();
                mat4.identity(item);
                return item;
            }else
            {
                let item=new Float32Array(16);
                this[0] = 1;
                this[5] = 1;
                this[10] = 1;
                this[15] = 1;
                return item;
            }
        }
        public static clone(from: mat4): mat4
        {
            if(mat4.Recycle.length>0)
            {
                let item=mat4.Recycle.pop();
                mat4.copy(from,item);
                return item;
            }else
            {
                let out = new Float32Array(16);
                out[0] = from[0];
                out[1] = from[1];
                out[2] = from[2];
                out[3] = from[3];
                out[4] = from[4];
                out[5] = from[5];
                out[6] = from[6];
                out[7] = from[7];
                out[8] = from[8];
                out[9] = from[9];
                out[10] = from[10];
                out[11] = from[11];
                out[12] = from[12];
                out[13] = from[13];
                out[14] = from[14];
                out[15] = from[15];
                return out;
            }
        }
        public static recycle(item:mat4)
        {
            mat4.Recycle.push(item);
        }
        public static disposeRecycledItems()
        {
            mat4.Recycle.length=0;
        }
        // private  constructor()
        // {
        //     super(16);
        //     this[0] = 1;
        //     // this[1] = 0;
        //     // this[2] = 0;
        //     // this[3] = 0;
        //     // this[4] = 0;
        //     this[5] = 1;
        //     // this[6] = 0;
        //     // this[7] = 0;
        //     // this[8] = 0;
        //     // this[9] = 0;
        //     this[10] = 1;
        //     // this[11] = 0;
        //     // this[12] = 0;
        //     // this[13] = 0;
        //     // this[14] = 0;
        //     this[15] = 1;
        // }
    
    
        /**
         * Copy the values from one mat4 to another
         *
         * @param out the receiving matrix
         * @param src the source matrix
         * @returns out
         */
        public static copy( src: mat4,out: mat4): mat4{
            out[0] = src[0];
            out[1] = src[1];
            out[2] = src[2];
            out[3] = src[3];
            out[4] = src[4];
            out[5] = src[5];
            out[6] = src[6];
            out[7] = src[7];
            out[8] = src[8];
            out[9] = src[9];
            out[10] = src[10];
            out[11] = src[11];
            out[12] = src[12];
            out[13] = src[13];
            out[14] = src[14];
            out[15] = src[15];
            return out;
        }
        static Identity=mat4.create();
        /**
         * Set a mat4 to the identity matrix
         *
         * @param out the receiving matrix
         * @returns out
         */
        public static identity(out: mat4): mat4{
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
    
        /**
         * Transpose the values of a mat4
         *
         * @param out the receiving matrix
         * @param a the source matrix
         * @returns out
         */
        public static transpose(a: mat4,out: mat4): mat4 {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                let a01 = a[1],
                    a02 = a[2],
                    a03 = a[3];
                let a12 = a[6],
                    a13 = a[7];
                let a23 = a[11];
            
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            } else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }
            
            return out;
            }
    
        /**
         * Inverts a mat4
         *
         * @param out the receiving matrix
         * @param a the source matrix
         * @returns out
         */
        public static invert(a: mat4,out: mat4,): mat4 | null {
            let a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3];
            let a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7];
            let a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11];
            let a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15];
            
            let b00 = a00 * a11 - a01 * a10;
            let b01 = a00 * a12 - a02 * a10;
            let b02 = a00 * a13 - a03 * a10;
            let b03 = a01 * a12 - a02 * a11;
            let b04 = a01 * a13 - a03 * a11;
            let b05 = a02 * a13 - a03 * a12;
            let b06 = a20 * a31 - a21 * a30;
            let b07 = a20 * a32 - a22 * a30;
            let b08 = a20 * a33 - a23 * a30;
            let b09 = a21 * a32 - a22 * a31;
            let b10 = a21 * a33 - a23 * a31;
            let b11 = a22 * a33 - a23 * a32;
            
            // Calculate the determinant
            let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            
            return out;
            }
    
        /**
         * Calculates the adjugate of a mat4
         *
         * @param out the receiving matrix
         * @param a the source matrix
         * @returns out
         */
        public static adjoint(a: mat4,out: mat4): mat4{
            let a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3];
            let a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7];
            let a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11];
            let a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15];
            
            out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
            out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
            out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
            out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
            out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
            out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
            out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
            out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
            out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
            out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
            out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
            out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
            out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
            out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
            out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
            out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
            return out;
            }
    
        /**
         * Calculates the determinant of a mat4
         *
         * @param a the source matrix
         * @returns determinant of a
         */
        public static determinant(a: mat4): number{
            let a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3];
            let a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7];
            let a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11];
            let a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15];
            
            let b00 = a00 * a11 - a01 * a10;
            let b01 = a00 * a12 - a02 * a10;
            let b02 = a00 * a13 - a03 * a10;
            let b03 = a01 * a12 - a02 * a11;
            let b04 = a01 * a13 - a03 * a11;
            let b05 = a02 * a13 - a03 * a12;
            let b06 = a20 * a31 - a21 * a30;
            let b07 = a20 * a32 - a22 * a30;
            let b08 = a20 * a33 - a23 * a30;
            let b09 = a21 * a32 - a22 * a31;
            let b10 = a21 * a33 - a23 * a31;
            let b11 = a22 * a33 - a23 * a32;
            
            // Calculate the determinant
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            }
    
        /**
         * Multiplies two mat4's
         *
         * @param out the receiving matrix
         * @param lhs the first operand
         * @param rhs the second operand
         * @returns out
         */
        public static multiply(lhs: mat4, rhs: mat4,out: mat4): mat4{
            let a00 = lhs[0],
                a01 = lhs[1],
                a02 = lhs[2],
                a03 = lhs[3];
            let a10 = lhs[4],
                a11 = lhs[5],
                a12 = lhs[6],
                a13 = lhs[7];
            let a20 = lhs[8],
                a21 = lhs[9],
                a22 = lhs[10],
                a23 = lhs[11];
            let a30 = lhs[12],
                a31 = lhs[13],
                a32 = lhs[14],
                a33 = lhs[15];
            
            // Cache only the current line of the second matrix
            let b0 = rhs[0],
                b1 = rhs[1],
                b2 = rhs[2],
                b3 = rhs[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            
            b0 = rhs[4];b1 = rhs[5];b2 = rhs[6];b3 = rhs[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            
            b0 = rhs[8];b1 = rhs[9];b2 = rhs[10];b3 = rhs[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            
            b0 = rhs[12];b1 = rhs[13];b2 = rhs[14];b3 = rhs[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
            }
    
    
        /**
         * Translate a mat4 by the given vector
         *
         * @param out the receiving matrix
         * @param a the matrix to translate
         * @param v vector to translate by
         * @returns out
         */
        public static translate(a: mat4, v: vec3,out: mat4): mat4{
            
                let x = v[0],
                    y = v[1],
                    z = v[2];
                let a00 = void 0,
                    a01 = void 0,
                    a02 = void 0,
                    a03 = void 0;
                let a10 = void 0,
                    a11 = void 0,
                    a12 = void 0,
                    a13 = void 0;
                let a20 = void 0,
                    a21 = void 0,
                    a22 = void 0,
                    a23 = void 0;
                
                if (a === out) {
                    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
                } else {
                    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
                    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
                    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];
                
                    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
                    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
                    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;
                
                    out[12] = a00 * x + a10 * y + a20 * z + a[12];
                    out[13] = a01 * x + a11 * y + a21 * z + a[13];
                    out[14] = a02 * x + a12 * y + a22 * z + a[14];
                    out[15] = a03 * x + a13 * y + a23 * z + a[15];
                }
                
                return out;
                }
        
    
        /**
         * Scales the mat4 by the dimensions in the given vec3
         *
         * @param out the receiving matrix
         * @param a the matrix to scale
         * @param v the vec3 to scale the matrix by
         * @returns out
         **/
        public static scale(a: mat4, v: vec3,out: mat4): mat4{
            let x = v[0],
                y = v[1],
                z = v[2];
            
            out[0] = a[0] * x;
            out[1] = a[1] * x;
            out[2] = a[2] * x;
            out[3] = a[3] * x;
            out[4] = a[4] * y;
            out[5] = a[5] * y;
            out[6] = a[6] * y;
            out[7] = a[7] * y;
            out[8] = a[8] * z;
            out[9] = a[9] * z;
            out[10] = a[10] * z;
            out[11] = a[11] * z;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
            }
    
        /**
         * Rotates a mat4 by the given angle
         *
         * @param out the receiving matrix
         * @param a the matrix to rotate
         * @param rad the angle to rotate the matrix by
         * @param axis the axis to rotate around
         * @returns out
         */
        public static rotate(a: mat4, rad: number, axis: vec3,out: mat4): mat4{
            let x = axis[0],
                y = axis[1],
                z = axis[2];
            let len = Math.sqrt(x * x + y * y + z * z);
            let s = void 0,
                c = void 0,
                t = void 0;
            let a00 = void 0,
                a01 = void 0,
                a02 = void 0,
                a03 = void 0;
            let a10 = void 0,
                a11 = void 0,
                a12 = void 0,
                a13 = void 0;
            let a20 = void 0,
                a21 = void 0,
                a22 = void 0,
                a23 = void 0;
            let b00 = void 0,
                b01 = void 0,
                b02 = void 0;
            let b10 = void 0,
                b11 = void 0,
                b12 = void 0;
            let b20 = void 0,
                b21 = void 0,
                b22 = void 0;
            
            if (Math.abs(len) < 0.000001) {
                return null;
            }
            
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            
            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;
            
            a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
            a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
            a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];
            
            // Construct the elements of the rotation matrix
            b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;
            
            // Perform rotation-specific matrix multiplication
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;
            
            if (a !== out) {
                // If the source and destination differ, copy the unchanged last row
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            return out;
            }
    
        /**
         * Rotates a matrix by the given angle around the X axis
         *
         * @param out the receiving matrix
         * @param a the matrix to rotate
         * @param rad the angle to rotate the matrix by
         * @returns out
         */
        public static rotateX(a: mat4, rad: number,out: mat4): mat4{
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a10 = a[4];
            let a11 = a[5];
            let a12 = a[6];
            let a13 = a[7];
            let a20 = a[8];
            let a21 = a[9];
            let a22 = a[10];
            let a23 = a[11];
            
            if (a !== out) {
                // If the source and destination differ, copy the unchanged rows
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            
            // Perform axis-specific matrix multiplication
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
            }
    
        /**
         * Rotates a matrix by the given angle around the Y axis
         *
         * @param out the receiving matrix
         * @param a the matrix to rotate
         * @param rad the angle to rotate the matrix by
         * @returns out
         */
        public static rotateY(a: mat4, rad: number,out: mat4): mat4{
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a00 = a[0];
            let a01 = a[1];
            let a02 = a[2];
            let a03 = a[3];
            let a20 = a[8];
            let a21 = a[9];
            let a22 = a[10];
            let a23 = a[11];
            
            if (a !== out) {
                // If the source and destination differ, copy the unchanged rows
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            
            // Perform axis-specific matrix multiplication
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
            }
    
        /**
         * Rotates a matrix by the given angle around the Z axis
         *
         * @param out the receiving matrix
         * @param a the matrix to rotate
         * @param rad the angle to rotate the matrix by
         * @returns out
         */
        public static rotateZ(a: mat4, rad: number,out: mat4): mat4{
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a00 = a[0];
            let a01 = a[1];
            let a02 = a[2];
            let a03 = a[3];
            let a10 = a[4];
            let a11 = a[5];
            let a12 = a[6];
            let a13 = a[7];
            
            if (a !== out) {
                // If the source and destination differ, copy the unchanged last row
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            
            // Perform axis-specific matrix multiplication
            out[0] = a00 * c + a10 * s;
            out[1] = a01 * c + a11 * s;
            out[2] = a02 * c + a12 * s;
            out[3] = a03 * c + a13 * s;
            out[4] = a10 * c - a00 * s;
            out[5] = a11 * c - a01 * s;
            out[6] = a12 * c - a02 * s;
            out[7] = a13 * c - a03 * s;
            return out;
            }
    
        /**
         * Creates a matrix from a vector translation
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, dest, vec);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {vec3} v Translation vector
         * @returns {mat4} out
         */
        public static fromTranslation(v: vec3,out: mat4): mat4{
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
            }
    
        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.scale(dest, dest, vec);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {vec3} v Scaling vector
         * @returns {mat4} out
         */
        public static fromScaling(v: vec3,out: mat4): mat4
        {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = v[1];
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = v[2];
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
    
        /**
         * Creates a matrix from a given angle around a given axis
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.rotate(dest, dest, rad, axis);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {number} rad the angle to rotate the matrix by
         * @param {vec3} axis the axis to rotate around
         * @returns {mat4} out
         */
        public static fromRotation(rad: number, axis: vec3,out: mat4): mat4{
            let x = axis[0],
                y = axis[1],
                z = axis[2];
            let len = Math.sqrt(x * x + y * y + z * z);
            let s = void 0,
                c = void 0,
                t = void 0;
            
            if (Math.abs(len) < 0.000001) {
                return null;
            }
            
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            
            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;
            
            // Perform rotation-specific matrix multiplication
            out[0] = x * x * t + c;
            out[1] = y * x * t + z * s;
            out[2] = z * x * t - y * s;
            out[3] = 0;
            out[4] = x * y * t - z * s;
            out[5] = y * y * t + c;
            out[6] = z * y * t + x * s;
            out[7] = 0;
            out[8] = x * z * t + y * s;
            out[9] = y * z * t - x * s;
            out[10] = z * z * t + c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
            }
    
        /**
         * Creates a matrix from the given angle around the X axis
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.rotateX(dest, dest, rad);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        public static fromXRotation(rad: number,out: mat4): mat4{
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = c;
            out[6] = s;
            out[7] = 0;
            out[8] = 0;
            out[9] = -s;
            out[10] = c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
            }
    
        /**
         * Creates a matrix from the given angle around the Y axis
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.rotateY(dest, dest, rad);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        public static fromYRotation(rad: number,out: mat4): mat4 {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            out[0] = c;
            out[1] = 0;
            out[2] = -s;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = s;
            out[9] = 0;
            out[10] = c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
            }
    
    
        /**
         * Creates a matrix from the given angle around the Z axis
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.rotateZ(dest, dest, rad);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        public static fromZRotation(rad: number,out: mat4): mat4{
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            
            // Perform axis-specific matrix multiplication
            out[0] = c;
            out[1] = s;
            out[2] = 0;
            out[3] = 0;
            out[4] = -s;
            out[5] = c;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
            }
    
    
    
        /**
         * Returns the translation vector component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslation,
         *  the returned vector will be the same as the translation vector
         *  originally supplied.
         * @param  {vec3} out Vector to receive translation component
         * @param  {mat4} mat Matrix to be decomposed (input)
         * @return {vec3} out
         */
        public static getTranslationing(mat: mat4,out: vec3): vec3{
            out[0] = mat[12];
            out[1] = mat[13];
            out[2] = mat[14];
            
            return out;
            }
    
        /**
         * Returns the scaling factor component of a transformation matrix. 
         * If a matrix is built with fromRotationTranslationScale with a 
         * normalized Quaternion parameter, the returned vector will be 
         * the same as the scaling vector originally supplied.
         * @param {vec3} out Vector to receive scaling factor component
         * @param {mat4} mat Matrix to be decomposed (input)
         * @return {vec3} out
         */
        public static getScaling(mat: mat4,out: vec3): vec3{
            let m11 = mat[0];
            let m12 = mat[1];
            let m13 = mat[2];
            let m21 = mat[4];
            let m22 = mat[5];
            let m23 = mat[6];
            let m31 = mat[8];
            let m32 = mat[9];
            let m33 = mat[10];
            
            out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
            out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
            out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
            
            return out;
            }
    
        /**
         * Returns a quaternion representing the rotational component
         *  of a transformation matrix. If a matrix is built with
         *  fromRotationTranslation, the returned quaternion will be the
         *  same as the quaternion originally supplied.
         * @param {quat} out Quaternion to receive the rotation component
         * @param {mat4} mat Matrix to be decomposed (input)
         * @return {quat} out
         */
        public static getRotation(mat: mat4,out: quat): quat{
            // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            let trace = mat[0] + mat[5] + mat[10];
            let S = 0;
            
            if (trace > 0) {
                S = Math.sqrt(trace + 1.0) * 2;
                out[3] = 0.25 * S;
                out[0] = (mat[6] - mat[9]) / S;
                out[1] = (mat[8] - mat[2]) / S;
                out[2] = (mat[1] - mat[4]) / S;
            } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
                S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
                out[3] = (mat[6] - mat[9]) / S;
                out[0] = 0.25 * S;
                out[1] = (mat[1] + mat[4]) / S;
                out[2] = (mat[8] + mat[2]) / S;
            } else if (mat[5] > mat[10]) {
                S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
                out[3] = (mat[8] - mat[2]) / S;
                out[0] = (mat[1] + mat[4]) / S;
                out[1] = 0.25 * S;
                out[2] = (mat[6] + mat[9]) / S;
            } else {
                S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
                out[3] = (mat[1] - mat[4]) / S;
                out[0] = (mat[8] + mat[2]) / S;
                out[1] = (mat[6] + mat[9]) / S;
                out[2] = 0.25 * S;
            }
            
            return out;
            }
    
    
    
        /**
         * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     mat4.translate(dest, origin);
         *     let quatMat = mat4.create();
         *     quat4.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *     mat4.scale(dest, scale)
         *     mat4.translate(dest, negativeOrigin);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {quat} q Rotation quaternion
         * @param {vec3} v Translation vector
         * @param {vec3} s Scaling vector
         * @param {vec3} o The origin vector around which to scale and rotate
         * @returns {mat4} out
         */
        public static fromRotationTranslationScaleOrigin(q: quat, v: vec3, s: vec3, o: vec3,out: mat4): mat4{
            // Quaternion math
            let x = q[0],
                y = q[1],
                z = q[2],
                w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            
            let sx = s[0];
            let sy = s[1];
            let sz = s[2];
            
            let ox = o[0];
            let oy = o[1];
            let oz = o[2];
            
            out[0] = (1 - (yy + zz)) * sx;
            out[1] = (xy + wz) * sx;
            out[2] = (xz - wy) * sx;
            out[3] = 0;
            out[4] = (xy - wz) * sy;
            out[5] = (1 - (xx + zz)) * sy;
            out[6] = (yz + wx) * sy;
            out[7] = 0;
            out[8] = (xz + wy) * sz;
            out[9] = (yz - wx) * sz;
            out[10] = (1 - (xx + yy)) * sz;
            out[11] = 0;
            out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
            out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
            out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
            out[15] = 1;
            
            return out;
            }
    
        /**
         * Calculates a 4x4 matrix from the given quaternion
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {quat} q Quaternion to create matrix from
         *
         * @returns {mat4} out
         */
        public static fromQuat(q: quat,out: mat4): mat4 {
            let x = q[0],
                y = q[1],
                z = q[2],
                w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            
            let xx = x * x2;
            let yx = y * x2;
            let yy = y * y2;
            let zx = z * x2;
            let zy = z * y2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            
            out[0] = 1 - yy - zz;
            out[1] = yx + wz;
            out[2] = zx - wy;
            out[3] = 0;
            
            out[4] = yx - wz;
            out[5] = 1 - xx - zz;
            out[6] = zy + wx;
            out[7] = 0;
            
            out[8] = zx + wy;
            out[9] = zy - wx;
            out[10] = 1 - xx - yy;
            out[11] = 0;
            
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            
            return out;
            }
    
        /**
         * Generates a frustum matrix with the given bounds
         *
         * @param out mat4 frustum matrix will be written into
         * @param left Left bound of the frustum
         * @param right Right bound of the frustum
         * @param bottom Bottom bound of the frustum
         * @param top Top bound of the frustum
         * @param near Near bound of the frustum
         * @param far Far bound of the frustum
         * @returns out
         */
        public static frustum(left: number, right: number,
                                bottom: number, top: number, near: number, far: number,out: mat4): mat4{
                                let rl = 1 / (right - left);
                                let tb = 1 / (top - bottom);
                                let nf = 1 / (near - far);
                                out[0] = near * 2 * rl;
                                out[1] = 0;
                                out[2] = 0;
                                out[3] = 0;
                                out[4] = 0;
                                out[5] = near * 2 * tb;
                                out[6] = 0;
                                out[7] = 0;
                                out[8] = (right + left) * rl;
                                out[9] = (top + bottom) * tb;
                                out[10] = (far + near) * nf;
                                out[11] = -1;
                                out[12] = 0;
                                out[13] = 0;
                                out[14] = far * near * 2 * nf;
                                out[15] = 0;
                                return out;
                                }
    
    
    
    
    
    
                                
    
        /**
         * Generates a look-at matrix with the given eye position, focal point, and up axis
         *
         * @param out mat4 frustum matrix will be written into
         * @param eye Position of the viewer
         * @param center Point the viewer is looking at
         * @param up vec3 pointing up
         * @returns out
         */
        public static lookAt(eye: vec3, center: vec3, up: vec3,out: mat4): mat4{
            let x0 = void 0,
                x1 = void 0,
                x2 = void 0,
                y0 = void 0,
                y1 = void 0,
                y2 = void 0,
                z0 = void 0,
                z1 = void 0,
                z2 = void 0,
                len = void 0;
            let eyex = eye[0];
            let eyey = eye[1];
            let eyez = eye[2];
            let upx = up[0];
            let upy = up[1];
            let upz = up[2];
            let centerx = center[0];
            let centery = center[1];
            let centerz = center[2];
            
            if (Math.abs(eyex - centerx) < 0.000001 && Math.abs(eyey - centery) < 0.000001 && Math.abs(eyez - centerz) < 0.000001) {
                return mat4.identity(out);
            }
            
            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;
            
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;
            
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }
            
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            
            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }
            
            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            out[15] = 1;
            
            return out;
            }
    
    
    
    /**
     * Generates a matrix that makes something look at something else.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */
    public static targetTo(eye, target, up,out) {
        let eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2];
        
        let z0 = eyex - target[0],
            z1 = eyey - target[1],
            z2 = eyez - target[2];
        
        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        }
        
        let x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;
        
        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
        };
    
    
    
        /**
         * Returns a string representation of a mat4
         *
         * @param mat matrix to represent as a string
         * @returns string representation of the matrix
         */
        public static str(a: mat4): string {
            return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
            }
    
        /**
         * Returns Frobenius norm of a mat4
         *
         * @param a the matrix to calculate Frobenius norm of
         * @returns Frobenius norm
         */
        public static frob(a: mat4): number{
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
            }
    
        /**
         * Adds two mat4's
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the first operand
         * @param {mat4} b the second operand
         * @returns {mat4} out
         */
        public static add(a: mat4, b: mat4,out: mat4): mat4{
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            out[9] = a[9] + b[9];
            out[10] = a[10] + b[10];
            out[11] = a[11] + b[11];
            out[12] = a[12] + b[12];
            out[13] = a[13] + b[13];
            out[14] = a[14] + b[14];
            out[15] = a[15] + b[15];
            return out;
            }
    
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} lhs the first operand
         * @param {mat4} rhs the second operand
         * @returns {mat4} out
         */
        public static subtract(lhs: mat4, rhs: mat4,out: mat4): mat4{
            out[0] = lhs[0] - rhs[0];
            out[1] = lhs[1] - rhs[1];
            out[2] = lhs[2] - rhs[2];
            out[3] = lhs[3] - rhs[3];
            out[4] = lhs[4] - rhs[4];
            out[5] = lhs[5] - rhs[5];
            out[6] = lhs[6] - rhs[6];
            out[7] = lhs[7] - rhs[7];
            out[8] = lhs[8] - rhs[8];
            out[9] = lhs[9] - rhs[9];
            out[10] = lhs[10] - rhs[10];
            out[11] = lhs[11] - rhs[11];
            out[12] = lhs[12] - rhs[12];
            out[13] = lhs[13] - rhs[13];
            out[14] = lhs[14] - rhs[14];
            out[15] = lhs[15] - rhs[15];
            return out;
            }
    
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the first operand
         * @param {mat4} b the second operand
         * @returns {mat4} out
         */
        //public static sub(out: mat4, a: mat4, b: mat4): mat4;
    
        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to scale
         * @param {number} b amount to scale the matrix's elements by
         * @returns {mat4} out
         */
        public static multiplyScalar(a: mat4, b: number,out: mat4): mat4{
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            out[6] = a[6] * b;
            out[7] = a[7] * b;
            out[8] = a[8] * b;
            out[9] = a[9] * b;
            out[10] = a[10] * b;
            out[11] = a[11] * b;
            out[12] = a[12] * b;
            out[13] = a[13] * b;
            out[14] = a[14] * b;
            out[15] = a[15] * b;
            return out;
            }
            
    
        /**
         * Adds two mat4's after multiplying each element of the second operand by a scalar value.
         *
         * @param {mat4} out the receiving vector
         * @param {mat4} a the first operand
         * @param {mat4} b the second operand
         * @param {number} scale the amount to scale b's elements by before adding
         * @returns {mat4} out
         */
        public static multiplyScalarAndAdd (a: mat4, b: mat4, scale: number,out: mat4): mat4 {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            out[4] = a[4] + b[4] * scale;
            out[5] = a[5] + b[5] * scale;
            out[6] = a[6] + b[6] * scale;
            out[7] = a[7] + b[7] * scale;
            out[8] = a[8] + b[8] * scale;
            out[9] = a[9] + b[9] * scale;
            out[10] = a[10] + b[10] * scale;
            out[11] = a[11] + b[11] * scale;
            out[12] = a[12] + b[12] * scale;
            out[13] = a[13] + b[13] * scale;
            out[14] = a[14] + b[14] * scale;
            out[15] = a[15] + b[15] * scale;
            return out;
            }
    
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {mat4} a The first matrix.
         * @param {mat4} b The second matrix.
         * @returns {boolean} True if the matrices are equal, false otherwise.
         */
        public static exactEquals (a: mat4, b: mat4): boolean{
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
            }
    
        /**
         * Returns whether or not the matrices have approximately the same elements in the same position.
         *
         * @param {mat4} a The first matrix.
         * @param {mat4} b The second matrix.
         * @returns {boolean} True if the matrices are equal, false otherwise.
         */
        public static equals (a: mat4, b: mat4): boolean{
            let a0 = a[0],
                a1 = a[1],
                a2 = a[2],
                a3 = a[3];
            let a4 = a[4],
                a5 = a[5],
                a6 = a[6],
                a7 = a[7];
            let a8 = a[8],
                a9 = a[9],
                a10 = a[10],
                a11 = a[11];
            let a12 = a[12],
                a13 = a[13],
                a14 = a[14],
                a15 = a[15];
            
            let b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3];
            let b4 = b[4],
                b5 = b[5],
                b6 = b[6],
                b7 = b[7];
            let b8 = b[8],
                b9 = b[9],
                b10 = b[10],
                b11 = b[11];
            let b12 = b[12],
                b13 = b[13],
                b14 = b[14],
                b15 = b[15];
            
            return Math.abs(a0 - b0) <= EPSILON && Math.abs(a1 - b1) <= EPSILON && Math.abs(a2 - b2) <= EPSILON && Math.abs(a3 - b3) <= EPSILON && Math.abs(a4 - b4) <=EPSILON && Math.abs(a5 - b5) <= EPSILON && Math.abs(a6 - b6) <= EPSILON && Math.abs(a7 - b7) <= EPSILON && Math.abs(a8 - b8) <= EPSILON && Math.abs(a9 - b9) <= EPSILON && Math.abs(a10 - b10) <= EPSILON && Math.abs(a11 - b11) <= EPSILON && Math.abs(a12 - b12) <= EPSILON && Math.abs(a13 - b13) <= EPSILON && Math.abs(a14 - b14) <= EPSILON && Math.abs(a15 - b15) <= EPSILON;
            }
    
            
        /**
         * 变换顶点
         * Transforms the point with a mat4.
         * 4th vector component is implicitly '1'
         *
         * @param out the receiving vector
         * @param a the vector to transform
         * @param m matrix to transform with
         * @returns out
         */
        static transformPoint(vector: vec3, mat: mat4,out: vec3):vec3
        {
            let x = vector[0],
                y = vector[1],
                z = vector[2];
            let w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
            w = w || 1.0;
            out[0] = (mat[0] * x + mat[4] * y + mat[8] * z + mat[12]) / w;
            out[1] = (mat[1] * x + mat[5] * y + mat[9] * z + mat[13]) / w;
            out[2] = (mat[2] * x + mat[6] * y + mat[10] * z + mat[14]) / w;
            return out;
        }
    
        /**
         * 变换向量
         * Transforms the vec3 with a mat4.
         * 4th vector component is implicitly '1'
         *
         * @param out the receiving vector
         * @param a the vector to transform
         * @param m matrix to transform with
         * @returns out
         */
        static transformVector3(vector: vec3, mat: mat4,out: vec3):vec3
        {
            let x = vector[0],
                y = vector[1],
                z = vector[2];
            out[0] = mat[0] * x + mat[4] * y + mat[8] * z;
            out[1] = mat[1] * x + mat[5] * y + mat[9] * z;
            out[2] = mat[2] * x + mat[6] * y + mat[10] * z;
            return out;
        }  
    
        // /**
        //  * Generates a perspective projection matrix with the given bounds
        //  *
        //  * @param out mat4 frustum matrix will be written into
        //  * @param fovy Vertical field of view in radians
        //  * @param aspect Aspect rat typically viewport width/height
        //  * @param near Near bound of the frustum
        //  * @param far Far bound of the frustum
        //  * @returns out
        //  */
        public static project_PerspectiveLH(fovy: number, aspect: number,
            near: number, far: number,out: mat4): mat4{
              let f = 1.0 / Math.tan(fovy / 2);
              let nf = 1 / (near - far);
              out[0] = f / aspect;
              out[1] = 0;
              out[2] = 0;
              out[3] = 0;
              out[4] = 0;
              out[5] = f;
              out[6] = 0;
              out[7] = 0;
              out[8] = 0;
              out[9] = 0;
              out[10] = (far + near) * nf;
              out[11] = -1;
              out[12] = 0;
              out[13] = 0;
              out[14] = 2 * far * near * nf;
              out[15] = 0;
              return out;
            }
        /**
         * Generates a perspective projection matrix with the given bounds
         * @param fov 上下夹角
         * @param aspect 左右夹角
         * @param znear 近视点距离
         * @param zfar 远视点距离
         * @returns {mat4} out
         */
        // static project_PerspectiveLH(fov: number, aspect: number, znear: number, zfar: number, out: mat4)
        // {
        //     let tan = 1.0 / (Math.tan(fov * 0.5));
        //     let nf=zfar / (znear - zfar);
        //     out[0] = tan / aspect;
        //     out[1] = out[2] = out[3] =out[4]=0;
        //     out[5] = tan;
        //     out[6] = out[7] = out[8] = out[9]=0;
        //     out[10] = -nf;
        //     out[11] = 1.0;
        //     out[12] = out[13] = out[15] = 0.0;
        //     out[14] = znear * nf;
        // }
        // /**
        //  * Generates a orthogonal projection matrix with the given bounds
        //  *
        //  * @param out mat4 frustum matrix will be written into
        //  * @param left Left bound of the frustum
        //  * @param right Right bound of the frustum
        //  * @param bottom Bottom bound of the frustum
        //  * @param top Top bound of the frustum
        //  * @param near Near bound of the frustum
        //  * @param far Far bound of the frustum
        //  * @returns out
        //  */
        // public static ortho(out: mat4, left: number, right: number,
        //     bottom: number, top: number, near: number, far: number): mat4{
        //         let lr = 1 / (left - right);
        //         let bt = 1 / (bottom - top);
        //         let nf = 1 / (near - far);
        //         out[0] = -2 * lr;
        //         out[1] = 0;
        //         out[2] = 0;
        //         out[3] = 0;
        //         out[4] = 0;
        //         out[5] = -2 * bt;
        //         out[6] = 0;
        //         out[7] = 0;
        //         out[8] = 0;
        //         out[9] = 0;
        //         out[10] = 2 * nf;
        //         out[11] = 0;
        //         out[12] = (left + right) * lr;
        //         out[13] = (top + bottom) * bt;
        //         out[14] = (far + near) * nf;
        //         out[15] = 1;
        //         return out;
        //       }
        public static  project_OrthoLH(width: number, height: number, near: number, far: number, out: mat4): mat4{
            let lr = -1 / width;
            let bt = -1 / height;
            let nf = 1 / (near - far);
            out[0] = -2 * lr;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = -2 * bt;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = (far + near) * nf;
            out[15] = 1;
            return out;
            }
        /**
         * Generates a orthogonal projection matrix with the given bounds
         * @param width 宽
         * @param height 高
         * @param znear 近视点
         * @param zfar 远视点
         * @param out 
         */
        // static project_OrthoLH(width: number, height: number, znear: number, zfar: number, out: mat4)
        // {
        //     let hw = 2.0 / width;
        //     let hh = 2.0 / height;
        //     let id = 1.0 / (zfar - znear);
        //     let nid = znear / (znear - zfar);
        //     out[0]=hw;
        //     out[5]=hh;
        //     out[10]=id;
        //     out[11]=nid;
        //     out[15]=1;
        //     out[1]=out[2]=out[3]=out[4]=out[6]=out[7]=out[8]=out[8]=out[12]=out[13]=out[14]=0;
        // }
    
    
        /** ----------copy glmatrix
         * Creates a matrix from a quaternion rotation, vector translation and vector scale
         *  This is equivalent to (but much faster than):
         * mat4.identity(dest);
         * mat4.translate(dest, vec);
         * let quatMat = mat4.create();
         * quat4.toMat4(quat, quatMat);
         * mat4.multiply(dest, quatMat);
         * mat4.scale(dest, scale)
         *  
         * @param pos Translation vector
         * @param scale Scaling vector
         * @param rot Rotation quaternion
         * @param out 
         */
        static RTS(pos: vec3, scale: vec3, rot: quat, out: mat4):mat4
        {
            let x = rot[0],
                y = rot[1],
                z = rot[2],
                w = rot[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
        
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            let sx = scale[0];
            let sy = scale[1];
            let sz = scale[2];
        
            out[0] = (1 - (yy + zz)) * sx;
            out[1] = (xy + wz) * sx;
            out[2] = (xz - wy) * sx;
            out[3] = 0;
            out[4] = (xy - wz) * sy;
            out[5] = (1 - (xx + zz)) * sy;
            out[6] = (yz + wx) * sy;
            out[7] = 0;
            out[8] = (xz + wy) * sz;
            out[9] = (yz - wx) * sz;
            out[10] = (1 - (xx + yy)) * sz;
            out[11] = 0;
            out[12] = pos[0];
            out[13] = pos[1];
            out[14] = pos[2];
            out[15] = 1;
    
            return out;
        }
        /**----copy glmatrix
         * Creates a matrix from a quaternion rotation and vector translation
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     let quatMat = mat4.create();
         *     quat4.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *
         * @param out mat4 receiving operation result
         * @param q Rotation quaternion
         * @param v Translation vector
         * @returns out
         */
        public static RT(q: quat, v: vec3,out: mat4): mat4{
            // Quaternion math
            let x = q[0],
                y = q[1],
                z = q[2],
                w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            
            return out;
        }
        /**use glmatrix separate function
         * Returns the translation、scale、rotation  component  of a transformation
         * 
         * @param src 
         * @param scale 
         * @param rotation 
         * @param translation 
         */
        static decompose(src: mat4, scale: vec3, rotation: quat, translation: vec3)
        {
            mat4.getTranslationing(src,translation);
            mat4.getScaling(src,scale);
            mat4.getRotationing(src,rotation,scale);
        }
    
        /**
         * get normalize quaternion with the given rotation matrix values
         * @param matrix defines the source matrix
         * @param result defines the target quaternion
         */
        public static getRotationing(matrix: mat4, result: quat,scale:vec3=null)
        {
            let scalex=1,
                scaley=1,
                scalez=1;
            if(scale==null)
            {
                scalex = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1] + matrix[2] * matrix[2]);
                scaley = Math.sqrt(matrix[4] * matrix[4] + matrix[5] * matrix[5] + matrix[6] * matrix[6]);
                scalez = Math.sqrt(matrix[8] * matrix[8] + matrix[9] * matrix[9] + matrix[10] * matrix[10]);
            }else
            {
                scalex=scale[0];
                scaley=scale[1];
                scalez=scale[2];
            }
            if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
                result[0] = 0;
                result[1] = 0;
                result[2] = 0;
                result[3] = 1;
                return;
            }
            // var data = matrix.m;
            let m11 = matrix[0]/scalex, m12 = matrix[4]/scaley, m13 = matrix[8]/scalez;
            let m21 = matrix[1]/scalex, m22 = matrix[5]/scaley, m23 = matrix[9]/scalez;
            let m31 = matrix[2]/scalex, m32 = matrix[6]/scaley, m33 = matrix[10]/scalez;
            let trace = m11 + m22 + m33;
            let s;
    
            if (trace > 0) {
    
                s = 0.5 / Math.sqrt(trace + 1.0);
    
                result[3] = 0.25 / s;
                result[0] = (m32 - m23) * s;
                result[1] = (m13 - m31) * s;
                result[2] = (m21 - m12) * s;
            } else if (m11 > m22 && m11 > m33) {
    
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
    
                result[3] = (m32 - m23) / s;
                result[0] = 0.25 * s;
                result[1] = (m12 + m21) / s;
                result[2] = (m13 + m31) / s;
            } else if (m22 > m33) {
    
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
    
                result[3] = (m13 - m31) / s;
                result[0] = (m12 + m21) / s;
                result[1] = 0.25 * s;
                result[2] = (m23 + m32) / s;
            } else {
    
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
    
                result[3] = (m21 - m12) / s;
                result[0] = (m13 + m31) / s;
                result[1] = (m23 + m32) / s;
                result[2] = 0.25 * s;
            }
        }
    
    
    }
}
