var web3d;
(function (web3d) {
    class Jsloader {
        constructor() {
            this.LoadList = [];
        }
        static get ins() {
            if (this.instance == null) {
                this.instance = new Jsloader();
            }
            return this.instance;
        }
        addScripte(src) {
            this.LoadList.push(src);
        }
        preload(onComplete, onState = null) {
            this.onComplete = onComplete;
            this.onState = onState;
            let perFinish = () => {
                if (this.LoadList.length <= 0) {
                    this.onComplete();
                }
                else {
                    let s = this.LoadList.shift();
                    this.loadJsFile(s, perFinish);
                }
            };
            if (this.LoadList.length > 0) {
                let s = this.LoadList.shift();
                this.loadJsFile(s, perFinish);
            }
        }
        loadJsFile(src, onComplete) {
            let script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                if (onComplete) {
                    onComplete();
                }
            };
            script.onerror = (ev) => {
                let error = "load Script Error \r\n no file:" + ev.srcElement.baseURI;
                alert(error);
            };
            document.head.appendChild(script);
        }
    }
    web3d.Jsloader = Jsloader;
})(web3d || (web3d = {}));
//# sourceMappingURL=jsloader.js.map