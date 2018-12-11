namespace web3d
{
    export class RenderContext2d
    {
        matrixReshape:MathD.mat2d;
        matrixToMatchCanvas: MathD.mat2d;
        matrixMatchCanvasToRealCanvas:MathD.mat2d=MathD.mat2d.create();
        matrixProject:MathD.mat2d=MathD.mat2d.create();
        private mat_ui:MathD.mat2d=MathD.mat2d.create();
        matrix_UI:MathD.mat3=MathD.mat3.create();
    
        updateModel(transform2d:Transform2D)
        {
            this.matrixToMatchCanvas=transform2d.worldMatrix;
            this.matrixReshape=transform2d.reshapeMatrix;
    
            MathD.mat2d.multiply(this.matrixToMatchCanvas,this.matrixReshape,this.mat_ui);
            MathD.mat2d.multiply(this.matrixMatchCanvasToRealCanvas,this.mat_ui,this.mat_ui);
            MathD.mat2d.multiply(this.matrixProject,this.mat_ui,this.mat_ui);
            MathD.mat3.fromMat2d(this.mat_ui,this.matrix_UI);
        }
    
        updateCamera(canvas:Canvas)
        {
            webGraph.render.viewPort(0,0,GameScreen.Width,GameScreen.Height);
            this.canvasMatchMatrix(canvas,this.matrixMatchCanvasToRealCanvas);
            this.canvasProjectMatrix(this.matrixProject);
    
        }
        private canvasProjectMatrix(mat:MathD.mat2d)
        {
            mat[0]=2/GameScreen.Width;
            mat[3]=2/GameScreen.Height;
        }
        private canvasMatchMatrix(canvas:Canvas,mat:MathD.mat2d)
        {
            mat[0]=canvas.matchScale;
            mat[3]=canvas.matchScale;
        }
    
    
    }
}
