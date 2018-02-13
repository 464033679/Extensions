# Grading Scene Optimizer

The new gradingSceneOptimizer will replace the current sceneOptimizer.

Be careful, it's an alpha test version.

## Description :
GradingSceneOptimizer allows you to create some grades with different renders to optimize your scenes and performances.

For example, you will be able to set a render for specifics devices.

GradingSceneOptimizer is based on responsive and accessibility that are important for web.

## Purpose :
* Get the best quality / performance for all devices.
* Regroup all optimizations tricks in one comprehensive class.

## Quick example :

```javascript
/**
 * Create new GradingSceneOptimizer
 * 'engine' : BABYLON.Engine
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine),

    /**
     * Create new grade
     * 'minimum' : grade name
     * 'BABYLON.PresetGradeOptimization.minimum()' : optimization options
     */
    minGrade = GSO.createGrade('minimum', BABYLON.PresetGradeOptimization.minimum()),

    lowGrade = GSO.createGrade('low', BABYLON.PresetGradeOptimization.low()),

    standardGrade = GSO.createGrade('standard', BABYLON.PresetGradeOptimization.standard()),

    mediumGrade = GSO.createGrade('medium', BABYLON.PresetGradeOptimization.medium()),

    highGrade = GSO.createGrade('high', BABYLON.PresetGradeOptimization.high()),

    ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra());


/**
 * Run GradingSceneOptimizer
 * 'scene' : BABYLON.Scene
 * 'minGrade' : on which grade GradingSceneOptimizer start.
 * 'function' : callback when GradingSceneOptimizer is ready.
 */
GSO.run(scene, minGrade, function() {

    // callback when ready
    engine.runRenderLoop( function() {
        scene.render();
    });

});
```

## How it works ? :
GradingSceneOptimizer tries to get the best grade for all devices.
It's based on two steps :
* First : upgrading. The GradingSceneOptimizer try to reach "x" FPS with your starter grade. If it's ok, it upgrade render again until when it can't reach "x" FPS.
* Second : downgrading. If the last try (or the first try with your starter grade ) not reach FPS, the GradingSceneOptimizer downgrade until when it can reach FPS. If the GradingSceneOptimizer reach "x" FPS, it stop.

For the Future, It will be able to detect your benchmark to know automatically on which grade it need to start.





## GradingSceneOptimizer class :

### properties :

```javascript
/**
    Create new GradingSceneOptimizer :
    1. BABYLON.Engine
    2. FPS to reach
    3. duration for fps evaluation in ms
    4. active auto evaluation
 */
var GSO = new BABYLON.GradingSceneOptimizer(engine, 48, 1000, true);

// Run again FPS evaluation every 30 seconds
GSO.autoRunInterval = 30000;

// TODO : FUTURE FEATURE : Active occlusion culling to get more performance
GSO.occlusionCullingEnabled = true;

// TODO : FUTURE FEATURE : Try to minimize the number of draw call of CPU to get more performance
//    * based on distance of view in optimizations parameters
//    * add a radius detection around the meshes (useful for big meshes)
//    * add a perimeter to preserve CPU performance to set visible to true on a group and not one by one ...
//    
//    CAMERA === distance ===> (--- perimeter ---(<- radius detection -> MESH <- radius detection ->)--- perimeter ---)
GSO.minimizeDrawCall = true;

// TODO : FUTURE FEATURE : optimize picking, collision and rendering selection for big scene.
GSO.useOctree = true;

```

### methods :

```javascript

/**
    Create new grade :
    1. grade name
    2. optimization parameters (here is a preset. see below to custom parameters);
    3. upgrading task
    4. downgrading task
 */
var ultraGrade = GSO.createGrade('ultra', BABYLON.PresetGradeOptimization.ultra(),
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


/**
    add existing grade :
    1. grade

    (created with new BABYLON.Grade() and not with GSO.createGrade())
 */
GSO.addGrade(gradeCreatedBefore);


/**
    Update scene by grade :
    1. BABYLON.Scene
    2. grade
    3. onSuccess

    (stop auto run and evaluation)
 */
GSO.updateSceneByGrade(scene, ultraGrade,
    function(){
      // on success
    });


/**
    Upgrade by one :
    1. BABYLON.Scene
    2. onSuccess

    (stop auto run and evaluation)
 */
GSO.upgrade(scene,
    function(){
      // on success
    });


/**
    Downgrade by one :
    1. BABYLON.Scene
    2. onSuccess

    (stop auto run and evaluation)
 */
GSO.downgrade(scene,
    function(){
      // on success
    });


// stop auto run and evaluation
GSO.stopAutoEval();


/**
    start auto run and evaluation :
    1. BABYLON.Scene
    2. onSuccess
 */
GSO.startAutoEval(scene,
    function(){
      // on success
    });

```





## Grades class :

### Create grade :
```javascript

/**
    Create new grade :
    1. grade name
    2. optimization parameters (here, it's a preset. see below to custom parameters);
    3. upgrading task
    4. downgrading task

    (Don't forget to add it to GSO with GSO.addGrade())
 */
var ultraGrade = new BABYLON.Grade('ultra', BABYLON.PresetGradeOptimization.ultra(),
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


```

### Custom optimization parameters :

```javascript

// Custom grade optimization parameters :
var customOptimization = {

    maxRenderFPS : 60, // TODO : FUTURE FEATURE : minimize max fps to get more performance.
    fpsToReach : 48, // TODO : fps to reach by grade

    shadowsEnabled : true,
    particlesEnabled : true,
    postProcessesEnabled : true,
    lensFlaresEnabled : true,
    renderTargetsEnabled : true,

    textures : {
        scale : 0.5, // original texture size * 0.5.
        maxSize : 1024, // if (original texture size * scale) > maxSize, texture size = maxSize.
        minSize : 512 // if (original texture size * scale) < minSize, texture size = minSize.
    },

    particles : {
        ratio : 0.5, // original emitRate * 0.5.
        maxEmitRate : 10000, // if (original emitRate * scale) > maxEmitRate, emitRate = maxEmitRate.
        minEmitRate : 100 // if (original emitRate * scale) < minEmitRate, emitRate = minEmitRate.
    },

    materials : {
        diffuseTextureEnabled : true;
        opacityTextureEnabled : true;
        reflectionTextureEnabled : true;
        emissiveTextureEnabled : true;
        specularTextureEnabled : true;
        ambientTextureEnabled : true;
        bumpTextureEnabled : true;
        lightmapTextureEnabled : true;
        refractionTextureEnabled : true;
        colorGradingTextureEnabled : true;
        fresnelEnabled? : true;
    },

    shadows : {
        size : 512
    },

    renderSize : {
        maxWidth : 2560,
        maxHeight : 2560,
        hardwareScaling : 0.5 // screen with 200% pixel density
    },

    userInfos : { // enable or disable grade on specifics devices and hardware.
        smartPhoneAllowed : false,
        tabletAllowed : false,
        noteBookAllowed : false,
        computerAllowed : true,
        consoleAllowed : true,
        tvAllowed : false
        exceptionsAllowed : ['xbox'], // if xbox found in userAgent, this grade is enabled.
        software : string, // browser name : firefox, chrome, safari, opera, ie, edge.
        softwareVersion : number, // browser version
        os : string, // operating system name : windows, chromium, ios, mac, android, linux, BlackBerry, firefox
        osVersion : number, // browser version
        engine : string, // layout engine : EdgeHTML, Presto, WebKit, Trident, Blink, Gecko, Goanna, Khtml, Netfront
        engineVersion : number // layout engine version
    },

    // TODO : NEXT FEATURE :
    assets : { // assets to load with grade | introduce a smart load
      static : [], // all asset will freeze
      dynamic : []
    }

    view : {
        distance : 200 // distance of camera
        fog : 150 // distance of fog
    },

};

// Create new grade :
var ultraGrade = new BABYLON.Grade('medium', customOptimization,
                    function () {
                      // task to do on upgrading step
                      // ex : add meshes
                    },
                    function () {
                      // task to do on downgrading step
                      // ex : remove meshes
                    });


```





## Future Features :

### Occlusion culling and / or minimizeDrawCalls Features :
Purpose : automatically minimize draw calls to increase performance.

[Interesting article on Unity](https://docs.unity3d.com/2017.3/Documentation/Manual/OcclusionCulling.html)

[Example by Tarek Sherif with webgl 2](https://tsherif.github.io/webgl2examples/occlusion.html)

[Done on BabylonJs 3.1](http://doc.babylonjs.com/overviews/occlusionquery)


### Smart loading – What you need to start ? :
Add a smart loading based on grade and distance.
Purpose : optimize the time loading.


### Benchmark Score, CPU and GPU recommended Features :
Purpose : Increase the accuracy of devices and hardwares detection to know which grade is the most optimized for your device.
At the moment, it's you who must to indicate which grade is the most optimized to start.

We need to create a "background benchmark scene" to calculate the score. ( Or get a json list of benchMark reference for gpu and cpu models)

* Scene for CPU side :
  - Increase nbr of particules (instances & animations)
  - Increase nbr of spheres (cloned & transform animations)
  - Rotate camera around scene.

```javascript

if (average_Fps < 30) { // 30 will be the ref for benchmark

  // 1. stop the CPU benchmark scene
  // 2. return benchmark result : nbr of particules + nbr of sphere
  return nbr_Particules + nbr_Sphere;

}

```


* Scene for GPU side :
  - Increase nbr of particules. (instances & animations)
  - Increase nbr of spheres (instanced, animated skeletons & animated shaders).
  - Add postProcesses to scene. (FXAA level + DEPTH)
  - Rotate camera around scene.

```javascript

if (average_Fps < 30) { // 30 will be the ref for benchmark

  // 1. stop the GPU benchmark scene
  // 2. return benchmark result : nbr of particules + nbr of sphere
  return (nbr_Particules + nbr_Sphere);

}

```

* Result :
```javascript

return benchMark = {
  'CPUScore' : CPUResult,
  'GPUScore' : GPUResult,
  'HardwareScore' : average between CPUResult & GPUResult
}

```

* Save it in localStorage
  - To decrease render time.
  - To share it with all Babylon project ?



### Complete optimization parameters :
Purpose : Propose more parameters to get more performance.

## Roadmap :
  - Finish the alpha version and test it on Playground
  - Merge it with Babylon and deprecated the older optimizer
  - Finish all TODO in "Custom optimization parameters" section.
  - Talk about benchMark feature and create it.

## Version :
alpha 0.0.1
