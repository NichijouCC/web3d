namespace web3d.io
{
    export class binBuffer
    {
        public _buf: Uint8Array[]//bufs 循环buf，用完的buf 转着圈用
        private _seekWritePos: number;//buf位置
        private _seekWriteIndex: number;//buf 索引
        private _seekReadPos: number;
        // private _seekReadIndex: number;//不需要，总是在读零号buf
        private _bufSize: number;
        getLength(): number
        {
            return (this._seekWriteIndex * this._bufSize + this._seekWritePos) - (this._seekReadPos);
        }
        getBufLength(): number
        {
            return this._buf.length * this._bufSize;
        }

        /**
         * 剩余有效可读字节
         */
        getBytesAvailable(): number
        {
            return this.getLength();
        }

        constructor(bufSize: number = 65536)
        {
            //限制buf 最小容量,和最大容量
            if (bufSize < 1024)
                bufSize = 1024;
            if (bufSize > 1024 * 256)
                bufSize = 1024 * 256;
            this._bufSize = bufSize;
            this._buf = [];
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._buf[0] = new Uint8Array(bufSize);

            this._seekReadPos = 0;
            // this._seekReadIndex = 0;
        }
        reset()
        {
            this._buf = [];
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._buf[0] = new Uint8Array(this._bufSize);
            this._seekReadPos = 0;
        }
        dispose()
        {
            this._buf.splice(0);
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._seekReadPos = 0;
        }
        read(target: Uint8Array | number[], offset: number = 0, length: number = -1)
        {
            if (length < 0) length = target.length;
            for (let i = offset; i < offset + length; i++)
            {
                if (this._seekReadPos >= this._seekWritePos && 0 == this._seekWriteIndex)
                {
                    this.reset();
                    throw new Error("no data to read.");
                }
                target[i] = this._buf[0][this._seekReadPos];

                this._seekReadPos++;
                if (this._seekReadPos >= this._bufSize)//要滚buf了
                {
                    this._seekWriteIndex--;
                    this._seekReadPos = 0;
                    let freebuf = this._buf.shift();
                    this._buf.push(freebuf);
                }
            }
        }
        write(array: Uint8Array | number[], offset: number = 0, length: number = -1)
        {
            if (length < 0) length = array.length;
            for (let i = offset; i < offset + length; i++)
            {
                this._buf[this._seekWriteIndex][this._seekWritePos] = array[i];
                this._seekWritePos++;
                if (this._seekWritePos >= this._bufSize)//要加新buf
                {
                    this._seekWriteIndex++;
                    this._seekWritePos = 0;
                    if (this._buf.length <= this._seekWriteIndex)
                    {
                        this._buf.push(new Uint8Array(this._bufSize));
                    }
                }
            }
        }
        getBuffer(): Uint8Array
        {
            let length = 0;
            if (this._seekWriteIndex > 0)
            {
                length = this._bufSize * (this._seekWriteIndex - 1) + this._seekWritePos;
            } else
            {
                length = this._seekWritePos;
            }
            let array = new Uint8Array(length);
            for (let i = 0; i < this._seekWriteIndex - 1; i++)
            {
                array.set(this._buf[i], i * this._bufSize);
            }
            for (let i = 0; i < this._seekWritePos; i++)
            {
                array[length - this._seekWritePos + i] = this._buf[this._seekWriteIndex][i];
            }
            return array;
        }

        getUint8Array(): Uint8Array
        {
            return new Uint8Array(this.getBuffer());
        }

    }
    export class converter
    {
        static getApplyFun(value: any): any
        {
            return Array.prototype.concat.apply([], value);
        }
        private static dataView: DataView = new DataView(new ArrayBuffer(8), 0, 8);//八字节临时空间
        static ULongToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            //这里注意不能直接用dataView.setFloat64，因为float64是float类型
            let uint1: number = value % 0x100000000;
            let uint2: number = (value / 0x100000000) | 0;
            converter.dataView.setUint32(0, uint1, true);
            converter.dataView.setUint32(4, uint2, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else
            {
                for (let i = 0; i < 8; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static LongToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            //这里注意不能直接用dataView.setFloat64，因为float64是float类型
            let uint1: number = value % 0x100000000;
            let uint2: number = (value / 0x100000000) | 0;
            converter.dataView.setInt32(0, uint1, true);
            converter.dataView.setInt32(4, uint2, true);
            let _array = new Int8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else
            {
                for (let i = 0; i < 8; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }

        static Float64ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setFloat64(0, value, false);
            if (target == null)
            {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else
            {
                for (let i = 0; i < 8; i++)
                {
                    target[offset + i] = converter.dataView.buffer[i];
                }
            }
            return target;
        }
        static Float32ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setFloat32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 4);
            } else
            {
                for (let i = 0; i < 4; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int32ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 4);
            } else
            {
                for (let i = 0; i < 4; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int16ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setInt16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 2);
            } else
            {
                for (let i = 0; i < 2; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int8ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setInt8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 1);
            } else
            {
                for (let i = 0; i < 1; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint32toArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 4);
            } else
            {
                for (let i = 0; i < 4; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint16ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setUint16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 2);
            } else
            {
                for (let i = 0; i < 2; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint8ToArray(value: number, target: Uint8Array | number[] = null, offset: number = 0): Uint8Array | number[]
        {
            converter.dataView.setUint8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null)
            {
                target = converter.getApplyFun(_array).slice(0, 1);
            }
            else
            {
                for (let i = 0; i < 1; i++)
                {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static StringToUtf8Array(str: string): Uint8Array | number[]
        {
            let bstr: number[] = [];
            for (let i = 0; i < str.length; i++)
            {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF)
                {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80)
                {
                    if (cc < 0x07FF)
                    {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else
                    {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else
                {
                    bstr.push(cc);
                }
            }
            return new Uint8Array(bstr);
        }
        static ArrayToLong(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 4; i++)
            {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getInt32(0, true);
            for (let i = 4; i < 8; i++)
            {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getInt32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }
        static ArrayToULong(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 4; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getUint32(0, true);
            for (let i = 4; i < 8; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getUint32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }

        static ArrayToFloat64(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 8; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getFloat64(0, true);
        }
        static ArrayToFloat32(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 4; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getFloat32(0, true);
        }
        static ArrayToInt32(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 4; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getInt32(0, true);
        }

        static ArrayToInt16(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 2; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt16(0, true);
        }
        static ArrayToInt8(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 1; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getInt8(0);
        }
        static ArraytoUint32(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 4; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getUint32(0, true);
        }
        static ArrayToUint16(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 2; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getUint16(0, true);
        }
        static ArrayToUint8(buf: Uint8Array, offset: number = 0): number
        {
            for (let i = 0; i < 1; i++)
            {
                converter.dataView.setUint8(i, buf[offset + i]);

                //converter.dataView.buffer[i] = buf[offset + i];
            }
            return converter.dataView.getUint8(0);
        }
        static ArrayToString(buf: Uint8Array, offset: number = 0): string
        {
            let ret: string[] = [];
            for (let i = 0; i < buf.length; i++)
            {
                let cc = buf[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0)
                {
                    ct = (cc & 0x0F) << 12;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = buf[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0)
                {
                    ct = (cc & 0x1F) << 6;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80)
                {
                    throw new Error("InvalidCharacterError");
                }
                else
                {
                    ret.push(String.fromCharCode(buf[i]));
                }
            }
            return ret.join('');
        }
    }
    export class binTool extends binBuffer
    {
        readSingle(): number
        {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToFloat32(array);
        }
        readLong(): number
        {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToLong(array);
        }
        readULong(): number
        {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToULong(array);
        }
        readDouble(): number
        {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToFloat64(array);
        }
        readInt8(): number
        {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToInt8(array);
        }
        readUInt8(): number
        {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToUint8(array);
        }
        readInt16(): number
        {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToInt16(array);
        }
        readUInt16(): number
        {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToUint16(array);
        }
        readInt32(): number
        {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToInt32(array);
        }
        readUInt32(): number
        {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArraytoUint32(array);
        }
        readBoolean(): boolean
        {
            return this.readUInt8() > 0;
        }
        readByte(): number
        {
            return this.readUInt8();
        }
        readUnsignedShort(): number
        {
            return this.readUInt16();
        }
        readUnsignedInt(): number
        {
            return this.readUInt32();
        }
        readFloat(): number
        {
            return this.readSingle();
        }
        /// <summary>
        /// 有符号 Byte
        /// </summary>
        readSymbolByte(): number
        {
            return this.readInt8();
        }
        readShort(): number
        {
            return this.readInt16();
        }
        readInt(): number
        {
            return this.readInt32();
        }
        readBytes(length: number): Uint8Array
        {
            let array = new Uint8Array(length);
            this.read(array);
            return array;
        }
        readStringUtf8(): string
        {
            let length = this.readInt8();
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringUtf8FixLength(length: number): string
        {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readUTFBytes(length: number): string
        {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringAnsi(): string
        {
            let slen = this.readUInt8();
            let bs: string = "";
            for (let i = 0; i < slen; i++)
            {
                bs += String.fromCharCode(this.readByte());
            }
            return bs;
        }

        get length(): number
        {
            return this.getLength();
        }

        writeInt8(num: number): void
        {
            this.write(converter.Int8ToArray(num));
        }
        writeUInt8(num: number): void
        {
            this.write(converter.Uint8ToArray(num));
        }
        writeInt16(num: number): void
        {
            this.write(converter.Int16ToArray(num));
        }
        writeUInt16(num: number): void
        {
            this.write(converter.Uint16ToArray(num));
        }
        writeInt32(num: number): void
        {
            this.write(converter.Int32ToArray(num));
        }
        writeUInt32(num: number): void
        {
            this.write(converter.Uint32toArray(num));
        }
        writeSingle(num: number): void
        {
            this.write(converter.Float32ToArray(num));
        }

        writeLong(num: number): void
        {
            this.write(converter.LongToArray(num));
        }
        writeULong(num: number): void
        {
            this.write(converter.ULongToArray(num));
        }
        writeDouble(num: number): void
        {
            this.write(converter.Float64ToArray(num));
        }
        writeStringAnsi(str: string): void
        {
            let slen = str.length;
            this.writeUInt8(slen);
            for (let i = 0; i < slen; i++)
            {
                this.writeUInt8(str.charCodeAt(i));
                //this._data.setUint8(this._seek, str.charCodeAt(i));
            }
        }
        writeStringUtf8(str: string)
        {
            let bstr = converter.StringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.write(bstr);
        }
        writeStringUtf8DataOnly(str: string)
        {
            let bstr = converter.StringToUtf8Array(str);
            this.write(bstr);
        }
        writeByte(num: number): void
        {
            this.write(converter.Uint8ToArray(num));
        }

        writeBytes(array: Uint8Array | number[], offset: number = 0, length: number = -1)
        {
            this.write(array, offset, length);
        }

        writeUint8Array(array: Uint8Array | number[], offset: number = 0, length: number = -1)
        {
            this.write(array, offset, length);
        }

        writeUnsignedShort(num: number): void
        {
            this.write(converter.Uint16ToArray(num));
        }

        writeUnsignedInt(num: number): void
        {
            this.write(converter.Uint32toArray(num));
        }

        writeFloat(num: number): void
        {
            this.write(converter.Float32ToArray(num));
        }

        writeUTFBytes(str: string): void
        {
            this.write(converter.StringToUtf8Array(str));
        }

        /// <summary>
        /// 写入有符号 Byte
        /// </summary>
        writeSymbolByte(num: number): void
        {
            this.write(converter.Int8ToArray(num));
        }

        writeShort(num: number): void
        {
            this.write(converter.Int16ToArray(num));
        }

        writeInt(num: number): void
        {
            this.write(converter.Int32ToArray(num));
        }
    }
}