System.register(["cce:/internal/code-quality/cr.mjs", "cc", "./recastJsPlugin"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, cc, RecastConfig, RecastJSPlugin, _dec, _class, _class2, _temp, _crd, _cc$_decorator, ccclass, property, CON_LINK_ID, RecastDetourManager;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _reportPossibleCrUseOfRecastConfig(extras) {
    _reporterNs.report("RecastConfig", "./recastJsPlugin", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRecastJSCrowd(extras) {
    _reporterNs.report("RecastJSCrowd", "./recastJsPlugin", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRecastJSPlugin(extras) {
    _reporterNs.report("RecastJSPlugin", "./recastJsPlugin", _context.meta, extras);
  }

  function _reportPossibleCrUseOfINavMeshParameters(extras) {
    _reporterNs.report("INavMeshParameters", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIObstacle(extras) {
    _reporterNs.report("IObstacle", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOffMeshLinkConfig(extras) {
    _reporterNs.report("OffMeshLinkConfig", "./INavigationEngine", _context.meta, extras);
  }

  return {
    setters: [function (_cceInternalCodeQualityCrMjs) {
      _reporterNs = _cceInternalCodeQualityCrMjs;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      cc = _cc;
    }, function (_recastJsPlugin) {
      RecastConfig = _recastJsPlugin.RecastConfig;
      RecastJSPlugin = _recastJsPlugin.RecastJSPlugin;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "549afRrwgxKSoezdljXnHlA", "RecastDetourManager", undefined);

      _cc$_decorator = cc._decorator;
      ccclass = _cc$_decorator.ccclass;
      property = _cc$_decorator.property;
      CON_LINK_ID = 1000;

      _export("default", RecastDetourManager = (_dec = ccclass("RecastDetourManager"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        //40ms between frames, or 25fps
        function RecastDetourManager() {
          _defineProperty(this, "currentMillisecond", 0);

          _defineProperty(this, "millisecondsBetweenFrames", 40);

          _defineProperty(this, "currentTick", 0);

          _defineProperty(this, "crowd", void 0);

          _defineProperty(this, "dt", 0);

          _defineProperty(this, "debugLayer", 1);

          _defineProperty(this, "obstacleList", []);

          _defineProperty(this, "root", void 0);

          this.linkList = {
            offMeshConVerts: [],
            //float[]
            //link 弧度  暂未搞清楚是干嘛的
            offMeshConRad: [],
            //float[]
            //link标志
            offMeshConFlags: [],
            //char[]
            //AreaTypeList char 区域类型
            offMeshConAreas: [],
            //char[]
            //是否双向 0 否 1是
            offMeshConDir: [],
            //int[]
            //link id
            offMeshConUserID: [],
            //int[]
            //link 数量
            offMeshConCount: 0 //int[]

          };
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


        var _proto = RecastDetourManager.prototype;

        _proto.addLink = function addLink(startPos, endPos, conRad, conFlag, conArea, conDir) {
          if (conRad === void 0) {
            conRad = 0.6;
          }

          if (conFlag === void 0) {
            conFlag = 1;
          }

          if (conArea === void 0) {
            conArea = 5;
          }

          if (conDir === void 0) {
            conDir = 1;
          }

          startPos.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          endPos.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          this.navigationPlugin.getClosestPoint(startPos);
          this.navigationPlugin.getClosestPoint(endPos);
          this.linkList.offMeshConVerts.push(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z);
          this.linkList.offMeshConRad.push(conRad);
          this.linkList.offMeshConFlags.push(conFlag);
          this.linkList.offMeshConAreas.push(conArea);
          this.linkList.offMeshConDir.push(conDir);
          this.linkList.offMeshConCount++;
          var id = CON_LINK_ID++;
          this.linkList.offMeshConUserID.push(id);
          this.reBuild();
          var node = new cc.Node();
          var comp = node.addComponent(cc.Line);
          comp.worldSpace = true;
          comp.width.constant = 0.1;
          comp.color.color = cc.Color.BLUE; // @ts-ignore

          comp.positions.push(startPos, endPos);
          this.root.addChild(node);
          return id;
        };

        _proto.removeAllLink = function removeAllLink() {
          for (var i = 0; i < this.linkList.node.length; ++i) {
            this.linkList.node[i].destroy();
          }

          this.linkList = {
            offMeshConVerts: [],
            //float[]
            //link 弧度  暂未搞清楚是干嘛的
            offMeshConRad: [],
            //float[]
            //link标志
            offMeshConFlags: [],
            //char[]
            //AreaTypeList char 区域类型
            offMeshConAreas: [],
            //char[]
            //是否双向 0 否 1是
            offMeshConDir: [],
            //int[]
            //link id
            offMeshConUserID: [],
            //int[]
            //link 数量
            offMeshConCount: 0 //int[]

          };
        }
        /**
         * 重新构建
         */
        ;

        _proto.reBuild = function reBuild() {
          this.config.offMeshLinkConfig = this.linkList;
          this.navigationPlugin.createNavMesh(this.meshes, this.config);
          this.init();
        };

        RecastDetourManager.getInstanceByNode = function getInstanceByNode(node, debugMaterial, debugLayer, root) {
          var comps = node.getComponentsInChildren(cc.MeshRenderer);
          var instance = this.getInstance(debugMaterial, debugLayer, root);
          var navmeshParameters = {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 45,
            walkableHeight: 15,
            walkableClimb: 2.0,
            walkableRadius: 0.6,
            maxEdgeLen: 12.,
            maxSimplificationError: 0.5,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            offMeshLinkConfig: instance.linkList,
            tileSize: 24
          };
          instance.config = navmeshParameters;
          instance.meshes = comps;
          instance.navigationPlugin.createNavMesh(comps, navmeshParameters);
          instance.init();
          return instance;
        };

        RecastDetourManager.getInstance = function getInstance(debugMaterial, debugLayer, root) {
          if (this.instance) {
            return this.instance;
          }

          var instance = new RecastDetourManager();
          this.instance = instance;
          instance.root = root;
          instance.debugMaterial = debugMaterial;
          instance.debugLayer = debugLayer;
          var navigationPlugin = new (_crd && RecastJSPlugin === void 0 ? (_reportPossibleCrUseOfRecastJSPlugin({
            error: Error()
          }), RecastJSPlugin) : RecastJSPlugin)();
          instance.navigationPlugin = navigationPlugin;
          return instance;
        };

        RecastDetourManager.getInstanceByBin = function getInstanceByBin(asset, debugMaterial, debugLayer) {
          var instance = this.getInstance(debugMaterial, debugLayer);
          instance.navigationPlugin.buildFromNavmeshData(new Uint8Array(asset));
          instance.init();
          return instance;
        };

        _proto.init = function init() {
          if (this.crowd) {
            this.removeAllAgents();
          }

          var scene = cc.director.getScene();
          var crowd = this.navigationPlugin.createCrowd(10, 0.1, scene);
          this.crowd = crowd;
          this.updateNavMeshDebug();
        };

        _proto.updateNavMeshDebug = function updateNavMeshDebug() {
          if (cc.isValid(this.navmeshdebug)) {
            this.navmeshdebug.destroy();
          }

          this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.root);
          this.navmeshdebug.getComponent(cc.MeshRenderer).setMaterial(this.debugMaterial, 0);
          this.navmeshdebug.layer = this.debugLayer;
          this.navmeshdebug.addComponent(cc.UIMeshRenderer);
        }
        /**
         * 角色导航至position
         * @param position
         */
        ;

        _proto.agentGoto = function agentGoto(position) {
          var out = position.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          out = this.navigationPlugin.getClosestPoint(out);
          console.log("goto", out);
          var agents = this.crowd.getAgents();

          for (var i = 0; i < agents.length; ++i) {
            this.crowd.agentGoto(agents[i], out);
          }
        }
        /**
         * 添加角色
         * @param startPos
         * @param node
         */
        ;

        _proto.addAgents = function addAgents(startPos, node) {
          startPos.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          this.navigationPlugin.getClosestPoint(startPos);
          var agentParams = {
            radius: 0.5,
            height: 2,
            maxAcceleration: 20.0,
            maxSpeed: 6.0,
            collisionQueryRange: 0,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0
          };
          var agentIndex = this.crowd.addAgent(startPos, agentParams, node);
        }
        /**
         * 移除所有角色
         */
        ;

        _proto.removeAllAgents = function removeAllAgents() {
          while (this.crowd.agents.length) {
            this.crowd.removeAgent(0);
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
        ;

        _proto.addCylinderObstacle = function addCylinderObstacle(node, position, radius, height) {
          var _this = this;

          node.worldPosition = position;
          position.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          setTimeout(function () {
            _this.updateNavMeshDebug();
          }, 100);
          var obstacle = this.navigationPlugin.addCylinderObstacle(position, radius, height);
          this.obstacleList.push({
            node: node,
            obstacle: obstacle
          });
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
        ;

        _proto.addBoxObstacle = function addBoxObstacle(node, position, extent, angle) {
          var _this2 = this;

          node.worldPosition = position;
          position.multiplyScalar(1 / (_crd && RecastConfig === void 0 ? (_reportPossibleCrUseOfRecastConfig({
            error: Error()
          }), RecastConfig) : RecastConfig).RATIO);
          setTimeout(function () {
            _this2.updateNavMeshDebug();
          }, 100);
          var obstacle = this.navigationPlugin.addBoxObstacle(position, extent, angle);
          this.obstacleList.push({
            node: node,
            obstacle: obstacle
          });
          return obstacle;
        }
        /**
         * 移除所有障碍物
         */
        ;

        _proto.removeAllObstacle = function removeAllObstacle() {
          var _this3 = this;

          for (var i = 0; i < this.obstacleList.length; ++i) {
            this.obstacleList[i].node.destroy();
            this.navigationPlugin.removeObstacle(this.obstacleList[i].obstacle);
          }

          setTimeout(function () {
            _this3.updateNavMeshDebug();
          }, 100);
          this.obstacleList = [];
        }
        /**
         * 随机位置添加角色
         * @param node
         */
        ;

        _proto.addRandomAgents = function addRandomAgents(node) {
          var randomPos = this.navigationPlugin.getRandomPointAround(cc.v3(0, 0, 0), 2);
          console.log(randomPos);
          this.addAgents(randomPos, node);
        };

        _proto.update = function update(dt) {
          if (this.crowd) {
            this.crowd.update(dt);
          }
        };

        return RecastDetourManager;
      }(), _defineProperty(_class2, "instance", void 0), _temp)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=RecastDetourManager.js.map