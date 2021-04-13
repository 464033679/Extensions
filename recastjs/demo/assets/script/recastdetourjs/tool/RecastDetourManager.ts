/**
@class RecastDetourManager
@author YI ZHANG
@date 2021/3/19
@desc
**/
import * as cc from "cc";

import {Vec3} from "cc";
import {RecastConfig, RecastJSCrowd, RecastJSPlugin} from "cocos-recast";
import {INavMeshParameters, IObstacle, OffMeshLinkConfig} from "cocos-recast/dist/INavigationEngine";

const {ccclass, property} = cc._decorator;
let CON_LINK_ID = 1000;
@ccclass("RecastDetourManager")
export default class RecastDetourManager{

    currentMillisecond = 0;
    millisecondsBetweenFrames = 40; //40ms between frames, or 25fps
    currentTick = 0;
    navmeshdebug!: cc.Node;
    crowd ?: RecastJSCrowd ;
    navigationPlugin!: RecastJSPlugin;
    private dt: number = 0;
    private debugMaterial!: cc.Material;
    private debugLayer: number = 1;
    private static instance: RecastDetourManager;
    private obstacleList: {node : cc.Node,obstacle : IObstacle}[] = [];
    private linkList !: OffMeshLinkConfig&{node : cc.Node[]};
    private config!: INavMeshParameters;
    private meshes!: cc.MeshRenderer[];
    private root: cc.Node | undefined;

    constructor() {
        this.linkList = <any>{
            offMeshConVerts : [],//float[]
            //link 弧度  暂未搞清楚是干嘛的
            offMeshConRad: [],//float[]
            //link标志
            offMeshConFlags: [],//char[]
            //AreaTypeList char 区域类型
            offMeshConAreas: [],//char[]
            //是否双向 0 否 1是
            offMeshConDir: [],//int[]
            //link id
            offMeshConUserID: [],//int[]
            //link 数量
            offMeshConCount: 0//int[]
        }
    }

    /**
     * 添加连线，联通两个区域
     * @param startPos
     * @param endPos
     * @param conRad
     * @param conFlag
     * @param conArea
     * @param conDir
     */
    addLink(startPos : cc.Vec3,endPos : cc.Vec3,conRad = 0.6,conFlag = 1,conArea = 5,conDir = 1){
        startPos.multiplyScalar(1 / RecastConfig.RATIO);
        endPos.multiplyScalar(1 / RecastConfig.RATIO);
        this.navigationPlugin.getClosestPoint(startPos);
        this.navigationPlugin.getClosestPoint(endPos);
        this.linkList.offMeshConVerts.push(startPos.x,startPos.y,startPos.z,endPos.x,endPos.y,endPos.z);
        this.linkList.offMeshConRad.push(conRad);
        this.linkList.offMeshConFlags.push(conFlag);
        this.linkList.offMeshConAreas.push(conArea);
        this.linkList.offMeshConDir.push(conDir);
        this.linkList.offMeshConCount++;
        let id = CON_LINK_ID++;
        this.linkList.offMeshConUserID.push(id);
        this.reBuild();
        let node = new cc.Node();
        let comp = node.addComponent(cc.Line);
        comp.worldSpace = true;
        comp.width.constant = 0.1;
        comp.color.color = cc.Color.BLUE;
        // @ts-ignore
        comp.positions.push(startPos,endPos);
        this.root!.addChild(node);
        return id;
    }

    removeAllLink(){
        for(let i = 0;i < this.linkList.node.length;++i){
            this.linkList.node[i].destroy();
        }
        this.linkList = <any>{
            offMeshConVerts : [],//float[]
            //link 弧度  暂未搞清楚是干嘛的
            offMeshConRad: [],//float[]
            //link标志
            offMeshConFlags: [],//char[]
            //AreaTypeList char 区域类型
            offMeshConAreas: [],//char[]
            //是否双向 0 否 1是
            offMeshConDir: [],//int[]
            //link id
            offMeshConUserID: [],//int[]
            //link 数量
            offMeshConCount: 0//int[]
        }
    }

    /**
     * 重新构建
     */
    reBuild(){
        this.config.offMeshLinkConfig = this.linkList;
        this.navigationPlugin.createNavMesh(this.meshes, this.config);
        this.init();
    }

    static async getInstanceByNode(node : cc.Node,debugMaterial : cc.Material,debugLayer : number,root : cc.Node){
        let comps = node.getComponentsInChildren(cc.MeshRenderer);
        let instance = await this.getInstance(debugMaterial,debugLayer,root);
        let navmeshParameters = {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 45,
            walkableHeight:15,
            walkableClimb: 2.0,
            walkableRadius: 0.6,
            maxEdgeLen: 12.,
            maxSimplificationError: 0.5,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            offMeshLinkConfig : instance.linkList,
            tileSize : 24
        };
        instance.config = navmeshParameters;
        instance.meshes = comps;
        instance.navigationPlugin.createNavMesh(comps, navmeshParameters);
        instance.init();
        return instance;
    }





    protected static async getInstance(debugMaterial ?: cc.Material,debugLayer ?: number,root ?: cc.Node){
        if(this.instance){
            return  this.instance;
        }
        let instance = new RecastDetourManager();
        this.instance = instance;
        instance.root = root;
        instance.debugMaterial = debugMaterial!;
        instance.debugLayer = debugLayer!;
        let navigationPlugin : RecastJSPlugin;
        await new Promise(resolve => {
            navigationPlugin = new RecastJSPlugin(()=>{
                resolve();
            });
        })
        instance.navigationPlugin = navigationPlugin!;
        return instance;
    }

    static async getInstanceByBin(asset : ArrayBuffer,debugMaterial : cc.Material,debugLayer : number){
        let instance = await this.getInstance(debugMaterial,debugLayer);
        instance.navigationPlugin.buildFromNavmeshData(new Uint8Array(asset));
        instance.init();
        return instance;
    }

    init(){
        if(this.crowd){
            this.removeAllAgents();
        }
        let scene = cc.director.getScene()!;
        let crowd = this.navigationPlugin.createCrowd(10, 0.1, scene);
        this.crowd = crowd as RecastJSCrowd;
        this.updateNavMeshDebug();
    }

    updateNavMeshDebug(){
        if(cc.isValid(this.navmeshdebug)){
            this.navmeshdebug.destroy();
        }
        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.root!);
        this.navmeshdebug.getComponent(cc.MeshRenderer)!.setMaterial(this.debugMaterial,0);
        this.navmeshdebug.layer = this.debugLayer;
        this.navmeshdebug.addComponent(cc.UIMeshRenderer);
    }

    /**
     * 角色导航至position
     * @param position
     */
    agentGoto(position : cc.Vec3){
        let out = position.multiplyScalar(1 / RecastConfig.RATIO);
        out = this.navigationPlugin.getClosestPoint(out);
        console.log("goto",out);
        let agents = this.crowd!.getAgents();
        for(let i = 0;i < agents.length;++i){
            this.crowd!.agentGoto(agents[i],out);
        }
    }

    /**
     * 添加角色
     * @param startPos
     * @param node
     */
    addAgents(startPos : cc.Vec3,node : cc.Node){
        startPos.multiplyScalar(1 / RecastConfig.RATIO);
        this.navigationPlugin.getClosestPoint(startPos);
        let agentParams = {
            radius: 0.5,
            height: 2,
            maxAcceleration: 20.0,
            maxSpeed: 6.0,
            collisionQueryRange: 0,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0};
        let agentIndex = this.crowd!.addAgent(startPos, agentParams, node);
    }

    /**
     * 移除所有角色
     */
    removeAllAgents(){
        while (this.crowd!.agents.length){
            this.crowd!.removeAgent(0);
        }
    }


    /**
     * Creates a cylinder obstacle and add it to the navigation
     * @param node
     * @param position world position
     * @param radius cylinder radius
     * @param height cylinder height
     * @returns the obstacle freshly created
     */
    addCylinderObstacle(node : cc.Node,position: Vec3, radius: number, height: number): IObstacle
    {
        node.worldPosition = position;
        position.multiplyScalar(1 / RecastConfig.RATIO);
        setTimeout(()=>{
            this.updateNavMeshDebug();
        },100);
        let obstacle = this.navigationPlugin.addCylinderObstacle(position,radius,height);
        this.obstacleList.push({node : node,obstacle : obstacle});
        return obstacle;
    }

    /**
     * Creates an oriented box obstacle and add it to the navigation
     * @param node
     * @param position world position
     * @param extent box size
     * @param angle angle in radians of the box orientation on Y axis
     * @returns the obstacle freshly created
     */
    addBoxObstacle(node : cc.Node,position: Vec3, extent: Vec3, angle: number): IObstacle
    {
        node.worldPosition = position;
        position.multiplyScalar(1 / RecastConfig.RATIO);
        setTimeout(()=>{
            this.updateNavMeshDebug();
        },100);
        let obstacle = this.navigationPlugin.addBoxObstacle(position, extent, angle);
        this.obstacleList.push({node : node,obstacle : obstacle});
        return obstacle;
    }

    /**
     * 移除所有障碍物
     */
    removeAllObstacle(){
        for(let i = 0;i < this.obstacleList.length;++i){
            this.obstacleList[i].node.destroy();
            this.navigationPlugin.removeObstacle(this.obstacleList[i].obstacle);
        }
        setTimeout(()=>{
            this.updateNavMeshDebug();
        },100);
        this.obstacleList = [];
    }


    /**
     * 随机位置添加角色
     * @param node
     */
    addRandomAgents(node : cc.Node){
        let randomPos = this.navigationPlugin.getRandomPointAround(cc.v3(0,0,0), 2);
        console.log(randomPos);
        this.addAgents(randomPos,node);
    }

    update(dt : number) {
        if(this.crowd){
            this.crowd.update(dt);
        }
    }
}

