System.register("chunks:///_virtual/RecastDetourManager.ts", ['cc', './recastJsPlugin.js'], function (exports) {
  'use strict';

  var cclegacy, _decorator, Node, Line, Color, director, isValid, MeshRenderer, UIMeshRenderer, v3, RecastConfig, RecastJSPlugin;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Line = module.Line;
      Color = module.Color;
      director = module.director;
      isValid = module.isValid;
      MeshRenderer = module.MeshRenderer;
      UIMeshRenderer = module.UIMeshRenderer;
      v3 = module.v3;
    }, function (module) {
      RecastConfig = module.RecastConfig;
      RecastJSPlugin = module.RecastJSPlugin;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _asyncToGenerator(fn) {
        return function () {
          var self = this,
              args = arguments;
          return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }

            _next(undefined);
          });
        };
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      cclegacy._RF.push({}, "549afRrwgxKSoezdljXnHlA", "RecastDetourManager", undefined);

      var _cc$_decorator = _decorator,
          ccclass = _cc$_decorator.ccclass,
          property = _cc$_decorator.property;
      var CON_LINK_ID = 1000;
      var RecastDetourManager = exports('default', (_dec = ccclass("RecastDetourManager"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
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

          startPos.multiplyScalar(1 / RecastConfig.RATIO);
          endPos.multiplyScalar(1 / RecastConfig.RATIO);
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
          var node = new Node();
          var comp = node.addComponent(Line);
          comp.worldSpace = true;
          comp.width.constant = 0.1;
          comp.color.color = Color.BLUE; // @ts-ignore

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

        RecastDetourManager.getInstanceByNode = /*#__PURE__*/function () {
          var _getInstanceByNode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(node, debugMaterial, debugLayer, root) {
            var comps, instance, navmeshParameters;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    comps = node.getComponentsInChildren(MeshRenderer);
                    _context.next = 3;
                    return this.getInstance(debugMaterial, debugLayer, root);

                  case 3:
                    instance = _context.sent;
                    navmeshParameters = {
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
                      maxVertsPerPoly: 3,
                      detailSampleDist: 6,
                      detailSampleMaxError: 1,
                      offMeshLinkConfig: instance.linkList,
                      tileSize: 16
                    };
                    instance.config = navmeshParameters;
                    instance.meshes = comps;
                    instance.navigationPlugin.createNavMesh(comps, navmeshParameters);
                    instance.init();
                    return _context.abrupt("return", instance);

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function getInstanceByNode(_x, _x2, _x3, _x4) {
            return _getInstanceByNode.apply(this, arguments);
          }

          return getInstanceByNode;
        }();

        RecastDetourManager.getInstance = /*#__PURE__*/function () {
          var _getInstance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(debugMaterial, debugLayer, root) {
            var instance, navigationPlugin;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!this.instance) {
                      _context2.next = 2;
                      break;
                    }

                    return _context2.abrupt("return", this.instance);

                  case 2:
                    instance = new RecastDetourManager();
                    this.instance = instance;
                    instance.root = root;
                    instance.debugMaterial = debugMaterial;
                    instance.debugLayer = debugLayer;
                    _context2.next = 9;
                    return new Promise(function (resolve) {
                      navigationPlugin = new RecastJSPlugin(function () {
                        resolve();
                      });
                    });

                  case 9:
                    instance.navigationPlugin = navigationPlugin;
                    return _context2.abrupt("return", instance);

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function getInstance(_x5, _x6, _x7) {
            return _getInstance.apply(this, arguments);
          }

          return getInstance;
        }();

        RecastDetourManager.getInstanceByBin = /*#__PURE__*/function () {
          var _getInstanceByBin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(asset, debugMaterial, debugLayer) {
            var instance;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return this.getInstance(debugMaterial, debugLayer);

                  case 2:
                    instance = _context3.sent;
                    instance.navigationPlugin.buildFromNavmeshData(new Uint8Array(asset));
                    instance.init();
                    return _context3.abrupt("return", instance);

                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function getInstanceByBin(_x8, _x9, _x10) {
            return _getInstanceByBin.apply(this, arguments);
          }

          return getInstanceByBin;
        }();

        _proto.init = function init() {
          if (this.crowd) {
            this.removeAllAgents();
          }

          var scene = director.getScene();
          var crowd = this.navigationPlugin.createCrowd(100, 1, scene);
          this.crowd = crowd;
          this.updateNavMeshDebug();
        };

        _proto.updateNavMeshDebug = function updateNavMeshDebug() {
          if (isValid(this.navmeshdebug)) {
            this.navmeshdebug.destroy();
          }

          this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.root);
          this.navmeshdebug.getComponent(MeshRenderer).setMaterial(this.debugMaterial, 0);
          this.navmeshdebug.layer = this.debugLayer;
          this.navmeshdebug.addComponent(UIMeshRenderer);
        }
        /**
         * 角色导航至position
         * @param position
         */
        ;

        _proto.agentGoto = function agentGoto(position) {
          var out = position.multiplyScalar(1 / RecastConfig.RATIO);
          out = this.navigationPlugin.getClosestPoint(out);
          console.log("goto", out);
          var agents = this.crowd.getAgents();

          for (var i = 0; i < agents.length; ++i) {
            this.crowd.agentGoto(agents[i], out);
          }
        }
        /**
         * 角色导航至position
         * @param position
         */
        ;

        _proto.agentGotoByIndex = function agentGotoByIndex(index, position) {
          var out = position.multiplyScalar(1 / RecastConfig.RATIO);
          out = this.navigationPlugin.getClosestPoint(out);
          console.log("goto", out);
          this.crowd.agentGoto(index, out);
        };

        _proto.agentTeleportByIndex = function agentTeleportByIndex(index, position) {
          var out = position.multiplyScalar(1 / RecastConfig.RATIO);
          out = this.navigationPlugin.getClosestPoint(out);
          console.log("goto", out);
          this.crowd.agentTeleport(index, out);
        }
        /**
         * 添加角色
         * @param startPos
         */
        ;

        _proto.addAgents = function addAgents(startPos) {
          startPos.multiplyScalar(1 / RecastConfig.RATIO);
          this.navigationPlugin.getClosestPoint(startPos);
          var agentParams = {
            radius: 1,
            height: 2,
            maxAcceleration: 20.0,
            maxSpeed: 6.0,
            collisionQueryRange: 2,
            pathOptimizationRange: 2 * 30,
            separationWeight: 1.0
          };
          var agentIndex = this.crowd.addAgent(startPos, agentParams);
          return agentIndex;
        }
        /**
         * 移除所有角色
         */
        ;

        _proto.removeAllAgents = function removeAllAgents() {
          while (this.crowd.agents.length) {
            this.crowd.removeAgent(this.crowd.agents[0]);
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
          position.multiplyScalar(1 / RecastConfig.RATIO);
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
          position.multiplyScalar(1 / RecastConfig.RATIO);
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
          var randomPos = this.navigationPlugin.getRandomPointAround(v3(0, 0, 0), 100);
          console.log(randomPos);
          return this.addAgents(randomPos);
        };

        _proto.update = function update(dt) {
          if (this.crowd) {
            this.crowd.update(dt);
          }
        };

        return RecastDetourManager;
      }(), _defineProperty(_class2, "instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/test.ts", ['cc', './recastJsPlugin.js', './RecastDetourManager.ts'], function (exports) {
  'use strict';

  var cclegacy, _decorator, Node, Camera, Material, v3, macro, resources, Asset, MeshRenderer, geometry, RenderableComponent, instantiate, math, Vec3, Component, systemEvent, SystemEventType, NodePool, RecastJSPlugin, RecastDetourManager;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Camera = module.Camera;
      Material = module.Material;
      v3 = module.v3;
      macro = module.macro;
      resources = module.resources;
      Asset = module.Asset;
      MeshRenderer = module.MeshRenderer;
      geometry = module.geometry;
      RenderableComponent = module.RenderableComponent;
      instantiate = module.instantiate;
      math = module.math;
      Vec3 = module.Vec3;
      Component = module.Component;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      NodePool = module.NodePool;
    }, function (module) {
      RecastJSPlugin = module.RecastJSPlugin;
    }, function (module) {
      RecastDetourManager = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _asyncToGenerator(fn) {
        return function () {
          var self = this,
              args = arguments;
          return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }

            _next(undefined);
          });
        };
      }

      function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          writable: descriptor.writable,
          value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
      }

      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function (key) {
          desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
          desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
          return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
          desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
          desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
          Object.defineProperty(target, property, desc);
          desc = null;
        }

        return desc;
      }

      cclegacy._RF.push({}, "8d436e1KSFDvKG14XdvEUXo", "test", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var Test = exports('Test', (_dec = ccclass('Test'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Camera), _dec6 = property(Material), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Test, _Component);

        function Test() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "roleNode", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "cylinderObstacleNode", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "boxObstacleNode", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "camera", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "debugMaterial", _descriptor5, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "type", 1);

          _defineProperty(_assertThisInitialized(_this), "obstacleList", []);

          _defineProperty(_assertThisInitialized(_this), "yKey", 0);

          _defineProperty(_assertThisInitialized(_this), "xKey", 0);

          _defineProperty(_assertThisInitialized(_this), "startLinkPos", void 0);

          _defineProperty(_assertThisInitialized(_this), "boss", 0);

          return _this;
        }

        var _proto = Test.prototype;

        _proto.start = /*#__PURE__*/function () {
          var _start = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    this.pool = new NodePool();
                    this.roleNodeRoot = this.roleNode.parent;
                    this.roleNode.removeFromParent();
                    this.cylinderObstacleNode.removeFromParent();
                    this.boxObstacleNode.removeFromParent();
                    this.moveDis = 0;
                    _context.next = 8;
                    return RecastDetourManager.getInstanceByNode(this.node, this.debugMaterial, 1, this.node);

                  case 8:
                    this.recastDetourManager = _context.sent;
                    this.node.on(Node.EventType.TOUCH_END, this.onTouch, this);
                    this.node.on(Node.EventType.TOUCH_MOVE, this.onMove, this); // @ts-ignore

                    systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this); // @ts-ignore

                    systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);
                    this.cylinderObstaclePool = new NodePool();
                    this.boxObstaclePool = new NodePool();
                  //this.node.children[0].active = false;

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function start() {
            return _start.apply(this, arguments);
          }

          return start;
        }();

        _proto.getRandomPos = function getRandomPos() {
          return v3((Math.random() - 0.5) * 100, 2, (Math.random() - 0.5) * 100).add(this.node.getWorldPosition());
        };

        _proto.onKeyDown = function onKeyDown(event) {
          switch (event.keyCode) {
            case macro.KEY.w:
            case macro.KEY.s:
              this.yKey = event.keyCode;
              break;

            case macro.KEY.a:
            case macro.KEY.d:
              this.xKey = event.keyCode;
              break;
          }
        };

        _proto.onKeyUp = function onKeyUp(event) {
          if (event.keyCode == this.yKey) {
            this.yKey = 0;
            return;
          }

          if (event.keyCode == this.xKey) {
            this.xKey = 0;
          }
        };

        _proto.toggleClick = function toggleClick(e) {
          this.type = Number(e.node.name[e.node.name.length - 1]);
        };

        _proto.loadBin = function loadBin() {
          var _this2 = this;

          resources.load("solo_navmesh", Asset, function (err, asset) {
            _this2.recastDetourManager = RecastDetourManager.getInstanceByBin(asset._file, _this2.debugMaterial, 1);
          });
        };

        _proto.saveBin = function saveBin() {
          this.saveFile("solo_navmesh.bin", this.recastDetourManager.navigationPlugin.getNavmeshData());
        };

        _proto.exportObj = function exportObj() {
          var comps = this.node.getComponentsInChildren(MeshRenderer);
          var str = RecastJSPlugin.exportObj(comps);
          this.saveFile("scene.obj", str);
        };

        _proto.saveFile = function saveFile(name, asset) {
          var blob = new Blob([asset], {
            type: 'application/octet-stream'
          });
          var a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          a.download = name;
          document.body.appendChild(a);
          a.click();
        };

        _proto.onTouch = function onTouch(touch) {
          var _this3 = this;

          if (this.moveDis > 50) {
            this.moveDis = 0;
            return;
          }

          var ray = this.camera.screenPointToRay(touch.getLocationX(), touch.getLocationY());
          var comps = this.node.getComponentsInChildren(MeshRenderer);
          var distance = Number.MAX_VALUE;

          for (var i = 0; i < comps.length; ++i) {
            var dis = geometry.intersect.rayModel(ray, comps[i].model, {
              mode: geometry.ERaycastMode.CLOSEST,
              doubleSided: false,
              distance: Number.MAX_SAFE_INTEGER
            });

            if (dis && dis < distance) {
              distance = dis;
            }
          }

          if (distance == Number.MIN_VALUE) {
            return;
          }

          var out = v3();
          ray.computeHit(out, distance);

          switch (this.type) {
            case 1:
              var id = this.recastDetourManager.addAgents(out);
              var role = this.get(this.pool, this.roleNode);
              var comp = role.getComponent(RenderableComponent);
              comp.unscheduleAllCallbacks();
              comp.schedule(function () {
                role.setWorldPosition(_this3.recastDetourManager.crowd.getAgentPosition(id));
              });
              break;

            case 2:
              this.recastDetourManager.agentGoto(out);
              break;

            case 3:
              var node = this.get(this.cylinderObstaclePool, this.cylinderObstacleNode);
              this.recastDetourManager.addCylinderObstacle(node, out, 1, 2);
              break;

            case 4:
              var node1 = this.get(this.boxObstaclePool, this.boxObstacleNode);
              this.recastDetourManager.addBoxObstacle(node1, out, v3(1, 1, 1), 0);
              break;

            case 5:
              if (!this.startLinkPos) {
                this.startLinkPos = out;
                break;
              }

              this.roleNodeRoot.removeAllChildren();
              this.recastDetourManager.addLink(this.startLinkPos, out);
              this.startLinkPos = undefined;
              break;
          }

          if (this.type != 5) {
            this.startLinkPos = undefined;
          }
        };

        _proto.onMove = function onMove(touch) {
          var movePos = touch.getLocation().subtract(touch.getPreviousLocation());
          this.moveDis += movePos.length();
          this.updateRotation(movePos);
        };

        _proto.updateRotation = function updateRotation(movePos) {
          var rotation = this.camera.node.eulerAngles;
          var y = rotation.y + -movePos.x / 5;
          var x = rotation.x + movePos.y / 5;
          this.camera.node.setRotationFromEuler(x, y, 0);
        };

        _proto.removeAllObstacle = function removeAllObstacle() {
          this.recastDetourManager.removeAllObstacle();
        };

        _proto.removeAllLink = function removeAllLink() {
          this.recastDetourManager.removeAllLink();
        };

        _proto.onEnable = function onEnable() {};

        _proto.get = function get(pool, node) {
          var item = pool.get() || instantiate(node);
          item.parent = this.roleNodeRoot;
          return item;
        };

        _proto.put = function put(node) {
          this.pool.put(node);
        };

        _proto.update = function update(deltaTime) {
          if (!this.recastDetourManager) {
            return;
          }

          this.recastDetourManager.update(deltaTime);
          var ySpeed = this.yKey ? this.yKey == macro.KEY.w ? 1 : -1 : 0;
          var xSpeed = this.xKey ? this.xKey == macro.KEY.d ? 1 : -1 : 0;

          if (ySpeed && xSpeed) {
            xSpeed *= 0.7;
            ySpeed *= 0.7;
          }

          var speed = v3();

          if (ySpeed) {
            speed.add(this.camera.node.forward.multiplyScalar(ySpeed));
          }

          if (xSpeed) {
            var worldRotation = this.camera.node.getWorldRotation();
            math.Quat.rotateY(worldRotation, worldRotation, Math.PI / 2);
            speed.add(Vec3.transformQuat(new Vec3(), Vec3.FORWARD, worldRotation).multiplyScalar(-xSpeed));
          }

          this.camera.node.getWorldRotation();
          var pos = this.camera.node.getPosition();
          this.camera.node.setPosition(pos.add(speed)); //console.log(this.recastDetourManager.CrowdSimApp.agents);
        };

        return Test;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roleNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cylinderObstacleNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boxObstacleNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "debugMaterial", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./RecastDetourManager.ts', './test.ts'], function () {
  'use strict';

  return {
    setters: [function () {}, function () {}],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});