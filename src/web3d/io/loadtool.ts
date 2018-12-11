namespace web3d
{
    export class DownloadInfo
    {
        loaded:number;
        total:number;
    }
    
    export enum LoadStateEnum
    {
        Loading,
        Finish,
        Failed
    }
    
    export enum ResponseTypeEnum
    {
        text="text",
        json="json",
        blob="blob",
        arraybuffer="arraybuffer"
    }
    
    /** 
     * Load a script (identified by an url). When the url returns, the 
     * content of this file is added into a new script element, attached to the DOM (body element)
     */
    export function LoadScript(scriptUrl: string, onFinish: (_err: Error|null) => void) 
    {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
    
        script.onload = () => {
            if (onFinish) {
                onFinish(null);
            }
        };
    
        script.onerror = (e) => {
            if (onFinish) {
                onFinish(new Error("Unable to load script:"+scriptUrl));
            }
        };
    
        head.appendChild(script);
    }
    
    function httpRequeset(url: string, type:ResponseTypeEnum,onFinish: (_txt: any, _err: Error|null) => void,onProgress: (info:DownloadInfo) => void=null): DownloadInfo
    {
        let info=new DownloadInfo();
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = type;
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    onFinish(null, new Error("got a 404:" + url));
                    return;
                }
                onFinish(req.response, null);
            }
        };
        req.onprogress = (e) =>
        {
            if (onProgress)
            {
                info.loaded=e.loaded;
                info.total=e.total;
                onProgress(info);
            }
        }
        req.onerror = () =>
        {
            onFinish(null, new Error("onerr in req:"));
        };
        req.send();
        return info;
    }
    export function loadJson(url: string, onFinish: (_json: JSON|null, _err: Error|null) => void,onProgress: (info:DownloadInfo) => void=null): DownloadInfo
    {
       return httpRequeset(url,ResponseTypeEnum.json,onFinish,onProgress);
    }
    export function loadText(url: string, onFinish: (_txt: string|null, _err: Error|null) => void,onProgress: (info:DownloadInfo) => void=null): DownloadInfo
    {
       return httpRequeset(url,ResponseTypeEnum.text,onFinish,onProgress);
    }
    export function loadArrayBuffer(url: string, onFinish: (_bin: ArrayBuffer|null, _err: Error|null) => void,onProgress: (info:DownloadInfo) => void=null):DownloadInfo
    {
        return httpRequeset(url,ResponseTypeEnum.arraybuffer,onFinish,onProgress);
    }
    
    export function loadBlob(url: string, onFinish: (_blob: Blob|null, _err: Error|null) => void,onProgress: (info:DownloadInfo) => void=null):DownloadInfo
    {
        return httpRequeset(url,ResponseTypeEnum.arraybuffer,onFinish,onProgress);
    }
    
    export function loadImg(input: string|ArrayBuffer|Blob, fun: (_tex: HTMLImageElement|null, _err: Error|null) => void, onProgress: (info:DownloadInfo) => void=null): DownloadInfo
    {
        let info=new DownloadInfo();
    
        let url: string;
        if (input instanceof ArrayBuffer) {
            url = URL.createObjectURL(new Blob([input]));
        }
        else if (input instanceof Blob) {
            url = URL.createObjectURL(input);
        }
        else {
            url=input;
        }

        let img = new Image();
        img.src = url;
        img.onerror = (error) =>
        {
            if (error != null)
            {
                fun(null, new Error(error.message));
            }
        }
        img.onprogress = (e) =>
        {
            if (onProgress)
            {
                info.loaded=e.loaded;
                info.total=e.total;
                onProgress(info);
            }
        }
        img.onload = () =>
        {
            URL.revokeObjectURL(img.src);
            fun(img, null);
        }
        return info;
    }
}
