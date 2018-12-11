namespace web3d
{
    export class NumberData
    {
        isRandom:boolean = false;
        _value:number = 0;
        _valueLimitMin:number = 0;
        _valueLimitMax = 0;
        beInited:boolean = false;
        key:number;//random值（0--1）
        public setValue(value:number)
        {
            this._value = value;
        }
        public setRandomValue(max:number,min:number)
        {
            this._valueLimitMax = max;
            this._valueLimitMin = min;
            this.isRandom = true;
        }
        /**
         * 针对随机类型，只要随机过一次就返回值不变（rerandom=false），返回新的随机值（rerandom=true）
         */
        public getValue(reRandom:boolean = false):number
        {
            if (this.isRandom)
            {
                if (reRandom || !this.beInited)
                {
                    this.key=Math.random();
                    this._value = this.key * (this._valueLimitMax - this._valueLimitMin) + this._valueLimitMin;
                    this.beInited = true;
                }
            }
            return this._value;
        }
    
        public constructor(value:number = 0)
        {
            this._value = value;
        }
    
        public static copyto(from:NumberData,to:NumberData)
        {
            to.isRandom = from.isRandom;
            to._value = from._value;
            to._valueLimitMin = from._valueLimitMin;
            to._valueLimitMax = from._valueLimitMax;
        }

        public static FormJson(json:string,data:NumberData)
        {
            if(json.indexOf("~")<0)
            {
                data.setValue(Number(json));
            }else
            {
                let arr=json.split("~");
                data.setRandomValue(Number(arr[1]),Number(arr[0]));             
            }
        }
    }

    export class Vector3Data
    {
        x = new NumberData();
        y = new NumberData();
        z = new NumberData();
    
        public constructor(x = 0,y = 0,z = 0)
        {
            this.x.setValue(x);
            this.y.setValue(y);
            this.z.setValue(z);
        }
        public getValue(reRandom = false):MathD.vec3
        {
            let _out =MathD.vec3.create();
            _out.x = this.x.getValue(reRandom);
            _out.y = this.y.getValue(reRandom);
            _out.z = this.z.getValue(reRandom);
            return _out;
        }
    
        public static copyto(from:Vector3Data,to:Vector3Data)
        {
            NumberData.copyto(from.x, to.x);
            NumberData.copyto(from.y, to.y);
            NumberData.copyto(from.z, to.z);
        }

        public static FormJson(json:string,data:Vector3Data)
        {
            let arr=json.split(",");
            NumberData.FormJson(arr[0],data.x);
            NumberData.FormJson(arr[1],data.y);
            NumberData.FormJson(arr[2],data.z);
        }
    }
    
    export class NumberKey
    {
        public key:number;
        public value:number;
        public constructor(_key:number,_value:number)
        {
            this.key = _key;
            this.value = _value;
        }
    }
    
    export class Vector3Key
    {
        public key:number;
        public value:MathD.vec3;
        public constructor(_key:number,_value:MathD.vec3)
        {
            this.key = _key;
            this.value = _value;
        }
    }

    export class Vector2Key
    {
        public key:number;
        public value:MathD.vec2;
        public constructor(_key:number,_value:MathD.vec2)
        {
            this.key = _key;
            this.value = _value;
        }
    }
}