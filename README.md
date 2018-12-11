
###  **web3d是 unity3d like 风格的 webgl 3d游戏引擎；** 


### 代码结构：
    web3d/code 为样例目录；
    src 为源码目录；
    lib 为编译的lib目录；

### 项目当前情况简介：

    1.支持加载.gltf格式资源（之前的资源结构舍弃），可以自行拓展资源格式。
    2.数学库包含有glmatrix和自行添加的部分，支持mat4，mat2d、vec4、vec3等 。
    3.gameobject、transform、scene 概念可类比unity3d。
    4.gameoject 、componets 类比unity3d采用ecs结构，可自行拓展component
    5.基础组件有meshfilter、meshrender。
    6.完成骨骼动画播放、融合。
    7.ui含有基础render框架，包含2d组件仅有rawiamge。
    8.font支持动态图集，以及基于html的hud lable。
    

### 研究内容简介：

    1.transform的脏标识，减少每帧必须的matrix计算。
    2.骨骼动画的高效实现，bone 对应的matrix通过uniform直接穿过去。这种方案 空间换时间，不利于骨骼融合。
    3.render流程优化。
        包含有：1.state cache，例如ztest、blend等
                2.program cahce.
                3.vbo、ebo cache.
                4.uniform cache.
    4.使用webgl拓展，例如1.使用vao减少 省略 vbo/ebo/vertexattributepointer的调用。2.使用gpu instance。实现多物体的高效渲染
    5.研究pbr材质。
    6.动态图集实现，即在context2d上写字，并组成font图集。
    6.碰撞相关，例如射线检测
    7.实现webworker（多线程）加载并解析游戏资源。

      
        
    
