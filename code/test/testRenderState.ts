namespace dome
{
    export class testRenderState implements IState
    {
        start() 
        {
            let gl=web3d.webgl;
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            let srccolor=gl.SRC_ALPHA;
            gl.blendFunc(srccolor, gl.DST_COLOR);
            let src=gl.getParameter(gl.BLEND_SRC_RGB);
            gl.flush();
            
            gl.disable(gl.BLEND);
            gl.flush();
            
            gl.enable(gl.BLEND);
            let src1=gl.getParameter(gl.BLEND_SRC_RGB);
            gl.flush();

            console.log("srccolor:"+srccolor+"  //src0:"+src+"  //src1:"+src1);
            
        }

        update(delta: number) {

        }
        
    }
}