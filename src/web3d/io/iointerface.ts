namespace web3d
{
    export function stringToBlob(content:string)
    {
        let u8 = new Uint8Array(stringToUtf8Array(content));
        let blob = new Blob([u8]);
        return blob;
    }
    
    export function stringToUtf8Array(str: string): number[]
    {
        let bstr: number[] = [];
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
}

