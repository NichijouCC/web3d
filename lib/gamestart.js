var game;
(function (game) {
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
    game.Jsloader = Jsloader;
})(game || (game = {}));
window.onload = () => {
    game.Jsloader.ins.addScripte("lib/web3d.js");
    game.Jsloader.ins.addScripte("lib/code.js");
    let onComplete = () => {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.backgroundColor = "#555";
        div.style.width = "100%";
        div.style.height = "100%";
        document.body.appendChild(div);
        let gdapp = new web3d.application();
        gdapp.start(div);
        web3d.StateMgr.showFps();
        gdapp.addUserCode("main");
    };
    game.Jsloader.ins.preload(onComplete);
};
//# sourceMappingURL=gamestart.js.map