namespace web3d
{
    @NodeComponent
    export class CameraController implements INodeComponent
    {
        static type:string="CameraController";
        Start() {
            if(this.gameObject.comps[Camera.type]!=null)
            {
                this.active();
            }
        }
        Clone() {
            throw new Error("Method not implemented.");
        }
        gameObject: GameObject;
        moveSpeed: number = 0.2;
        movemul: number = 5;
        wheelSpeed: number = 1;
        rotateSpeed: number = 0.1;
        keyMap: { [id: number]: boolean } = {};
        beRightClick: boolean = false;
    
        
        Update() {
            this.doMove(GameTimer.DeltaTime);
        }
    
        rotAngle: MathD.vec3=MathD.vec3.create();
        active() {
            MathD.quat.ToEuler(this.gameObject.transform.localRotation,this.rotAngle);
            Input.addMouseEventListener(MouseEventEnum.Move,(ev)=>{
                if(Input.getMouseDown(MouseKeyEnum.Right))
                {
                    this.doRotate(ev.movementX, ev.movementY);
                }
            });
            Input.addKeyCodeEventListener(KeyCodeEventEnum.Up,(ev)=>{
                this.moveSpeed = 0.2;
            });
            Input.addMouseEventListener(MouseEventEnum.Rotate,(ev)=>{
                this.doMouseWheel(ev);
            });
            // Input.addMouseWheelEventListener((ev)=>{
            //     this.doMouseWheel(ev);
            // })
        }
        private inverseDir:number=-1;
        private moveVector: MathD.vec3 = MathD.vec3.create();
        doMove(delta: number) {
            if (this.gameObject.getComponent(Camera.type)== null) return;
            if(Input.getMouseDown(MouseKeyEnum.Right))
            {
                if(Input.getKeyDown(KeyCodeEnum.A))
                {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getRightInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector,-1*this.moveSpeed*delta,this.moveVector);
                    // vec3.scale(this.moveVector,this.inverseDir,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                if(Input.getKeyDown(KeyCodeEnum.D))
                {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getRightInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector,this.moveSpeed*delta,this.moveVector);
                    // vec3.scale(this.moveVector,this.inverseDir,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                if(Input.getKeyDown(KeyCodeEnum.W))
                {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getForwardInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector,this.moveSpeed*delta,this.moveVector);
                    MathD.vec3.scale(this.moveVector,this.inverseDir,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                if(Input.getKeyDown(KeyCodeEnum.S))
                {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getForwardInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector,-1*this.moveSpeed*delta,this.moveVector);
                    MathD.vec3.scale(this.moveVector,this.inverseDir,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                if(Input.getKeyDown(KeyCodeEnum.E))
                {
                    this.moveSpeed += this.movemul * delta;
                    MathD.vec3.scale(MathD.vec3.UP,this.moveSpeed*delta,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                if(Input.getKeyDown(KeyCodeEnum.Q))
                {
                    this.moveSpeed += this.movemul * delta;
                    MathD.vec3.scale(MathD.vec3.DOWN,this.moveSpeed*delta,this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
                }
                this.gameObject.transform.markDirty();
            }
        }
        private camrot=MathD.quat.create();
        doRotate(rotateX: number, rotateY: number) 
        {
            // this.rotAngle[0] += rotateY * this.rotateSpeed;
            // this.rotAngle[1] += rotateX * this.rotateSpeed;
            // this.rotAngle[0] %= 360;
            // this.rotAngle[1] %= 360;
            MathD.quat.FromEuler(0,rotateX * this.rotateSpeed*this.inverseDir,0,this.camrot);
            MathD.quat.multiply(this.camrot,this.gameObject.transform.localRotation,this.gameObject.transform.localRotation);
            MathD.quat.FromEuler(rotateY * this.rotateSpeed*this.inverseDir,0,0,this.camrot);
            MathD.quat.multiply(this.gameObject.transform.localRotation,this.camrot,this.gameObject.transform.localRotation);
            this.gameObject.transform.markDirty();
        }
        private doMouseWheel(ev: ClickEvent) {
            if (this.gameObject.getComponent(Camera.type)==null) return;
            this.gameObject.transform.getForwardInWorld(this.moveVector);
            MathD.vec3.scale(this.moveVector,this.wheelSpeed * ev.rotateDelta * (-0.0001)*this.inverseDir,this.moveVector);
            MathD.vec3.add(this.gameObject.transform.localPosition,this.moveVector,this.gameObject.transform.localPosition);
            this.gameObject.transform.markDirty();
        }
        Dispose() {
    
        }
    
    } 
    
}
