var io;
(function (io) {
    onmessage = function (msg) {
        console.log("webworker receive msg: url: " + msg.data.url);
        io.loadTool.ins.load(msg);
    };
    function postMsg(msg, transferList = null) {
        if (transferList == null) {
            postMessage(msg);
        }
        else {
            postMessage(msg, transferList);
        }
    }
    class loadTool {
        static get ins() {
            if (this._ins == null) {
                this._ins = new loadTool();
            }
            return this._ins;
        }
        load(msg) {
            let taskid = msg.data.id;
            switch (msg.data.type) {
                case "loadMeshData":
                    io.loadArrayBuffer("../" + msg.data.url, (_buffer, err) => {
                        if (err != null) {
                            postMsg({
                                id: taskid,
                                iserror: true,
                                errorcontent: err.message
                            });
                        }
                        else {
                        }
                    });
                    break;
                case "LoadAniclip":
                    io.loadArrayBuffer("../" + msg.data.url, (_buffer, err) => {
                        if (err) {
                            postMsg({
                                id: taskid,
                                iserror: true,
                                errorcontent: err.message
                            });
                        }
                        else {
                        }
                    });
            }
        }
        ;
    }
    io.loadTool = loadTool;
})(io || (io = {}));
var io;
(function (io) {
    class loadWorkerMgr {
        constructor(scripteSrc) {
            this.loadworker = new Worker(scripteSrc);
            this.loadworker.onmessage = (msg) => {
                console.log("mgr receive msg!");
                let data = msg.data;
            };
        }
        postMessage(data) {
            console.log("mgr post msg!");
            this.loadworker.postMessage(data);
        }
        stopworker() {
            this.loadworker.terminate();
        }
    }
    io.loadWorkerMgr = loadWorkerMgr;
})(io || (io = {}));
var io;
(function (io) {
    class binBuffer {
        constructor(bufSize = 65536) {
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
        }
        getLength() {
            return (this._seekWriteIndex * this._bufSize + this._seekWritePos) - (this._seekReadPos);
        }
        getBufLength() {
            return this._buf.length * this._bufSize;
        }
        getBytesAvailable() {
            return this.getLength();
        }
        reset() {
            this._buf = [];
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._buf[0] = new Uint8Array(this._bufSize);
            this._seekReadPos = 0;
        }
        dispose() {
            this._buf.splice(0);
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._seekReadPos = 0;
        }
        read(target, offset = 0, length = -1) {
            if (length < 0)
                length = target.length;
            for (let i = offset; i < offset + length; i++) {
                if (this._seekReadPos >= this._seekWritePos && 0 == this._seekWriteIndex) {
                    this.reset();
                    throw new Error("no data to read.");
                }
                target[i] = this._buf[0][this._seekReadPos];
                this._seekReadPos++;
                if (this._seekReadPos >= this._bufSize) {
                    this._seekWriteIndex--;
                    this._seekReadPos = 0;
                    let freebuf = this._buf.shift();
                    this._buf.push(freebuf);
                }
            }
        }
        write(array, offset = 0, length = -1) {
            if (length < 0)
                length = array.length;
            for (let i = offset; i < offset + length; i++) {
                this._buf[this._seekWriteIndex][this._seekWritePos] = array[i];
                this._seekWritePos++;
                if (this._seekWritePos >= this._bufSize) {
                    this._seekWriteIndex++;
                    this._seekWritePos = 0;
                    if (this._buf.length <= this._seekWriteIndex) {
                        this._buf.push(new Uint8Array(this._bufSize));
                    }
                }
            }
        }
        getBuffer() {
            let length = 0;
            if (this._seekWriteIndex > 0) {
                length = this._bufSize * (this._seekWriteIndex - 1) + this._seekWritePos;
            }
            else {
                length = this._seekWritePos;
            }
            let array = new Uint8Array(length);
            for (let i = 0; i < this._seekWriteIndex - 1; i++) {
                array.set(this._buf[i], i * this._bufSize);
            }
            for (let i = 0; i < this._seekWritePos; i++) {
                array[length - this._seekWritePos + i] = this._buf[this._seekWriteIndex][i];
            }
            return array;
        }
        getUint8Array() {
            return new Uint8Array(this.getBuffer());
        }
    }
    io.binBuffer = binBuffer;
    class converter {
        static getApplyFun(value) {
            return Array.prototype.concat.apply([], value);
        }
        static ULongToArray(value, target = null, offset = 0) {
            let uint1 = value % 0x100000000;
            let uint2 = (value / 0x100000000) | 0;
            converter.dataView.setUint32(0, uint1, true);
            converter.dataView.setUint32(4, uint2, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static LongToArray(value, target = null, offset = 0) {
            let uint1 = value % 0x100000000;
            let uint2 = (value / 0x100000000) | 0;
            converter.dataView.setInt32(0, uint1, true);
            converter.dataView.setInt32(4, uint2, true);
            let _array = new Int8Array(converter.dataView.buffer);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Float64ToArray(value, target = null, offset = 0) {
            converter.dataView.setFloat64(0, value, false);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = converter.dataView.buffer[i];
                }
            }
            return target;
        }
        static Float32ToArray(value, target = null, offset = 0) {
            converter.dataView.setFloat32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int32ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int16ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 2);
            }
            else {
                for (let i = 0; i < 2; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int8ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 1);
            }
            else {
                for (let i = 0; i < 1; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint32toArray(value, target = null, offset = 0) {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint16ToArray(value, target = null, offset = 0) {
            converter.dataView.setUint16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 2);
            }
            else {
                for (let i = 0; i < 2; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint8ToArray(value, target = null, offset = 0) {
            converter.dataView.setUint8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 1);
            }
            else {
                for (let i = 0; i < 1; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static StringToUtf8Array(str) {
            let bstr = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return new Uint8Array(bstr);
        }
        static ArrayToLong(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getInt32(0, true);
            for (let i = 4; i < 8; i++) {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getInt32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }
        static ArrayToULong(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getUint32(0, true);
            for (let i = 4; i < 8; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getUint32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }
        static ArrayToFloat64(buf, offset = 0) {
            for (let i = 0; i < 8; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getFloat64(0, true);
        }
        static ArrayToFloat32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getFloat32(0, true);
        }
        static ArrayToInt32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt32(0, true);
        }
        static ArrayToInt16(buf, offset = 0) {
            for (let i = 0; i < 2; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt16(0, true);
        }
        static ArrayToInt8(buf, offset = 0) {
            for (let i = 0; i < 1; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt8(0);
        }
        static ArraytoUint32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint32(0, true);
        }
        static ArrayToUint16(buf, offset = 0) {
            for (let i = 0; i < 2; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint16(0, true);
        }
        static ArrayToUint8(buf, offset = 0) {
            for (let i = 0; i < 1; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint8(0);
        }
        static ArrayToString(buf, offset = 0) {
            let ret = [];
            for (let i = 0; i < buf.length; i++) {
                let cc = buf[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = buf[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                }
                else {
                    ret.push(String.fromCharCode(buf[i]));
                }
            }
            return ret.join('');
        }
    }
    converter.dataView = new DataView(new ArrayBuffer(8), 0, 8);
    io.converter = converter;
    class binTool extends binBuffer {
        readSingle() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToFloat32(array);
        }
        readLong() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToLong(array);
        }
        readULong() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToULong(array);
        }
        readDouble() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToFloat64(array);
        }
        readInt8() {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToInt8(array);
        }
        readUInt8() {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToUint8(array);
        }
        readInt16() {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToInt16(array);
        }
        readUInt16() {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToUint16(array);
        }
        readInt32() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToInt32(array);
        }
        readUInt32() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArraytoUint32(array);
        }
        readBoolean() {
            return this.readUInt8() > 0;
        }
        readByte() {
            return this.readUInt8();
        }
        readUnsignedShort() {
            return this.readUInt16();
        }
        readUnsignedInt() {
            return this.readUInt32();
        }
        readFloat() {
            return this.readSingle();
        }
        readSymbolByte() {
            return this.readInt8();
        }
        readShort() {
            return this.readInt16();
        }
        readInt() {
            return this.readInt32();
        }
        readBytes(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return array;
        }
        readStringUtf8() {
            let length = this.readInt8();
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringUtf8FixLength(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readUTFBytes(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringAnsi() {
            let slen = this.readUInt8();
            let bs = "";
            for (let i = 0; i < slen; i++) {
                bs += String.fromCharCode(this.readByte());
            }
            return bs;
        }
        get length() {
            return this.getLength();
        }
        writeInt8(num) {
            this.write(converter.Int8ToArray(num));
        }
        writeUInt8(num) {
            this.write(converter.Uint8ToArray(num));
        }
        writeInt16(num) {
            this.write(converter.Int16ToArray(num));
        }
        writeUInt16(num) {
            this.write(converter.Uint16ToArray(num));
        }
        writeInt32(num) {
            this.write(converter.Int32ToArray(num));
        }
        writeUInt32(num) {
            this.write(converter.Uint32toArray(num));
        }
        writeSingle(num) {
            this.write(converter.Float32ToArray(num));
        }
        writeLong(num) {
            this.write(converter.LongToArray(num));
        }
        writeULong(num) {
            this.write(converter.ULongToArray(num));
        }
        writeDouble(num) {
            this.write(converter.Float64ToArray(num));
        }
        writeStringAnsi(str) {
            let slen = str.length;
            this.writeUInt8(slen);
            for (let i = 0; i < slen; i++) {
                this.writeUInt8(str.charCodeAt(i));
            }
        }
        writeStringUtf8(str) {
            let bstr = converter.StringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.write(bstr);
        }
        writeStringUtf8DataOnly(str) {
            let bstr = converter.StringToUtf8Array(str);
            this.write(bstr);
        }
        writeByte(num) {
            this.write(converter.Uint8ToArray(num));
        }
        writeBytes(array, offset = 0, length = -1) {
            this.write(array, offset, length);
        }
        writeUint8Array(array, offset = 0, length = -1) {
            this.write(array, offset, length);
        }
        writeUnsignedShort(num) {
            this.write(converter.Uint16ToArray(num));
        }
        writeUnsignedInt(num) {
            this.write(converter.Uint32toArray(num));
        }
        writeFloat(num) {
            this.write(converter.Float32ToArray(num));
        }
        writeUTFBytes(str) {
            this.write(converter.StringToUtf8Array(str));
        }
        writeSymbolByte(num) {
            this.write(converter.Int8ToArray(num));
        }
        writeShort(num) {
            this.write(converter.Int16ToArray(num));
        }
        writeInt(num) {
            this.write(converter.Int32ToArray(num));
        }
    }
    io.binTool = binTool;
})(io || (io = {}));
var io;
(function (io) {
    function stringToBlob(content) {
        let u8 = new Uint8Array(stringToUtf8Array(content));
        let blob = new Blob([u8]);
        return blob;
    }
    io.stringToBlob = stringToBlob;
    function stringToUtf8Array(str) {
        let bstr = [];
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            let cc = c.charCodeAt(0);
            if (cc > 0xFFFF) {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80) {
                if (cc < 0x07FF) {
                    let c1 = (cc >>> 6) | 0xC0;
                    let c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else {
                    let c1 = (cc >>> 12) | 0xE0;
                    let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    let c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else {
                bstr.push(cc);
            }
        }
        return bstr;
    }
    io.stringToUtf8Array = stringToUtf8Array;
})(io || (io = {}));
var io;
(function (io) {
    function loadText(url, fun) {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "text";
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.responseText, null);
            }
        };
        req.onerror = () => {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }
    io.loadText = loadText;
    function loadArrayBuffer(url, fun) {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "arraybuffer";
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.response, null);
            }
        };
        req.onerror = () => {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }
    io.loadArrayBuffer = loadArrayBuffer;
    function loadBlob(url, fun) {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "blob";
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.response, null);
            }
        };
        req.onerror = () => {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }
    io.loadBlob = loadBlob;
    function loadImg(url, fun, progress) {
        let img = new Image();
        img.src = url;
        img.onerror = (error) => {
            if (error != null) {
                fun(null, new Error(error.message));
            }
        };
        img.onprogress = (e) => {
            if (progress) {
                let val = e.loaded / e.total * 100;
                progress(val);
            }
        };
        img.onload = () => {
            fun(img, null);
        };
    }
    io.loadImg = loadImg;
})(io || (io = {}));
var io;
(function (io) {
    class binReader {
        constructor(buf, seek = 0) {
            this._seek = seek;
            this._data = new DataView(buf, seek);
        }
        seek(seek) {
            this._seek = seek;
        }
        peek() {
            return this._seek;
        }
        length() {
            return this._data.byteLength;
        }
        canread() {
            return this._data.byteLength - this._seek;
        }
        readStringAnsi() {
            let slen = this._data.getUint8(this._seek);
            this._seek++;
            let bs = "";
            for (let i = 0; i < slen; i++) {
                bs += String.fromCharCode(this._data.getUint8(this._seek));
                this._seek++;
            }
            return bs;
        }
        static utf8ArrayToString(array) {
            let ret = [];
            for (let i = 0; i < array.length; i++) {
                let cc = array[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = array[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                }
                else {
                    ret.push(String.fromCharCode(array[i]));
                }
            }
            return ret.join('');
        }
        readStringUtf8() {
            let length = this._data.getInt8(this._seek);
            this._seek++;
            let arr = new Uint8Array(length);
            this.readUint8Array(arr);
            return binReader.utf8ArrayToString(arr);
        }
        readStringUtf8FixLength(length) {
            let arr = new Uint8Array(length);
            this.readUint8Array(arr);
            return binReader.utf8ArrayToString(arr);
        }
        readSingle() {
            let num = this._data.getFloat32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readDouble() {
            let num = this._data.getFloat64(this._seek, true);
            this._seek += 8;
            return num;
        }
        readInt8() {
            let num = this._data.getInt8(this._seek);
            this._seek += 1;
            return num;
        }
        readUInt8() {
            let num = this._data.getUint8(this._seek);
            this._seek += 1;
            return num;
        }
        readInt16() {
            let num = this._data.getInt16(this._seek, true);
            this._seek += 2;
            return num;
        }
        readUInt16() {
            let num = this._data.getUint16(this._seek, true);
            this._seek += 2;
            return num;
        }
        readInt32() {
            let num = this._data.getInt32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUInt32() {
            let num = this._data.getUint32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUint8Array(target = null, offset = 0, length = -1) {
            if (length < 0)
                length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this._data.getUint8(this._seek);
                this._seek++;
            }
            return target;
        }
        readUint8ArrayByOffset(target, offset, length = 0) {
            if (length < 0)
                length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this._data.getUint8(offset);
                offset++;
            }
            return target;
        }
        set position(value) {
            this.seek(value);
        }
        get position() {
            return this.peek();
        }
        readBoolean() {
            return this.readUInt8() > 0;
        }
        readByte() {
            return this.readUInt8();
        }
        readBytes(target = null, offset = 0, length = -1) {
            return this.readUint8Array(target, offset, length);
        }
        readUnsignedShort() {
            return this.readUInt16();
        }
        readUnsignedInt() {
            return this.readUInt32();
        }
        readFloat() {
            return this.readSingle();
        }
        readUTFBytes(length) {
            let arry = new Uint8Array(length);
            return binReader.utf8ArrayToString(this.readUint8Array(arry));
        }
        readSymbolByte() {
            return this.readInt8();
        }
        readShort() {
            return this.readInt16();
        }
        readInt() {
            return this.readInt32();
        }
    }
    io.binReader = binReader;
    class binWriter {
        constructor() {
            let buf = new ArrayBuffer(1024);
            this._length = 0;
            this._buf = new Uint8Array(buf);
            this._data = new DataView(this._buf.buffer);
            this._seek = 0;
        }
        sureData(addlen) {
            let nextlen = this._buf.byteLength;
            while (nextlen < (this._length + addlen)) {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength) {
                let newbuf = new Uint8Array(nextlen);
                for (let i = 0; i < this._length; i++) {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
                this._data = new DataView(this._buf.buffer);
            }
            this._length += addlen;
        }
        getLength() {
            return length;
        }
        getBuffer() {
            return this._buf.buffer.slice(0, this._length);
        }
        seek(seek) {
            this._seek = seek;
        }
        peek() {
            return this._seek;
        }
        writeInt8(num) {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;
        }
        writeUInt8(num) {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        }
        writeInt16(num) {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        }
        writeUInt16(num) {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        }
        writeInt32(num) {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        }
        writeUInt32(num) {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        }
        writeSingle(num) {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        }
        writeDouble(num) {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        }
        writeStringAnsi(str) {
            let slen = str.length;
            this.sureData(slen + 1);
            this._data.setUint8(this._seek, slen);
            this._seek++;
            for (let i = 0; i < slen; i++) {
                this._data.setUint8(this._seek, str.charCodeAt(i));
                this._seek++;
            }
        }
        writeStringUtf8(str) {
            let bstr = binWriter.stringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.writeUint8Array(bstr);
        }
        static stringToUtf8Array(str) {
            let bstr = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return bstr;
        }
        writeStringUtf8DataOnly(str) {
            let bstr = binWriter.stringToUtf8Array(str);
            this.writeUint8Array(bstr);
        }
        writeUint8Array(array, offset = 0, length = -1) {
            if (length < 0)
                length = array.length;
            this.sureData(length);
            for (let i = offset; i < offset + length; i++) {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        }
        get length() {
            return this._seek;
        }
        writeByte(num) {
            this.writeUInt8(num);
        }
        writeBytes(array, offset = 0, length = 0) {
            this.writeUint8Array(array, offset, length);
        }
        writeUnsignedShort(num) {
            this.writeUInt16(num);
        }
        writeUnsignedInt(num) {
            this.writeUInt32(num);
        }
        writeFloat(num) {
            this.writeSingle(num);
        }
        writeUTFBytes(str) {
            let strArray = binWriter.stringToUtf8Array(str);
            this.writeUint8Array(strArray);
        }
        writeSymbolByte(num) {
            this.writeInt8(num);
        }
        writeShort(num) {
            this.writeInt16(num);
        }
        writeInt(num) {
            this.writeInt32(num);
        }
    }
    io.binWriter = binWriter;
})(io || (io = {}));
//# sourceMappingURL=loadworker.js.map