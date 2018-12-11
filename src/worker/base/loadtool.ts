namespace web3d.io
{

    export function loadText(url: string, fun: (_txt: string, _err: Error) => void): void
    {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "text";
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.responseText, null);
            }
        };

        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }


    export function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void
    {
        let req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "arraybuffer";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                //console.log("got bin:" + typeof (req.response) + req.responseType);
                fun(req.response, null);
            }
        };
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

    export function loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void): void
    {
        let req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "blob";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                //console.log("got _blob:" + typeof (req.response) + req.responseType);
                fun(req.response, null);
            }
        };
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

    export function loadImg(url: string, fun: (_tex: HTMLImageElement, _err: Error) => void, progress: (progre: number) => void): void
    {
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
            if (progress)
            {
                let val = e.loaded / e.total * 100;
                progress(val);
            }
        }
        img.onload = () =>
        {
            fun(img, null);
        }
    }
}