
///<reference path="../lib/web3d.d.ts" />
///<reference path="./jsloader.ts" />

window.onload=()=>
{
    //web3d.Jsloader.ins.addScripte("lib/Reflect.js");
    //web3d.Jsloader.ins.addScripte("lib/gl-matrix.js");    
    game.Jsloader.ins.addScripte("lib/web3d.js");
    game.Jsloader.ins.addScripte("lib/code.js");
    

    let onComplete=()=>{
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.backgroundColor = "#555";
        div.style.width = "100%";
        div.style.height = "100%";
        //div.style.zIndex = "10000";
        document.body.appendChild(div);
        
        let gdapp = new web3d.application();
        //let div = document.getElementById("drawarea") as HTMLDivElement;
        gdapp.start(div);
        web3d.StateMgr.showFps();
        //gdapp.bePlay = true;
        gdapp.addUserCode("main");
    };
    game.Jsloader.ins.preload(onComplete);
}