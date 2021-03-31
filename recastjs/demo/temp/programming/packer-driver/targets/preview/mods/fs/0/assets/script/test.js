System.register(["cce:/internal/code-quality/cr.mjs", "cc", "./recastdetourjs/tool/RecastDetourManager", "./recastdetourjs/tool/recastJsPlugin"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, cc, _decorator, Component, geometry, math, RecastDetourManager, RecastJSPlugin, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp, _crd, ccclass, property, Test;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRecastDetourManager(extras) {
    _reporterNs.report("RecastDetourManager", "./recastdetourjs/tool/RecastDetourManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRecastJSPlugin(extras) {
    _reporterNs.report("RecastJSPlugin", "./recastdetourjs/tool/recastJsPlugin", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIObstacle(extras) {
    _reporterNs.report("IObstacle", "./recastdetourjs/tool/INavigationEngine", _context.meta, extras);
  }

  return {
    setters: [function (_cceInternalCodeQualityCrMjs) {
      _reporterNs = _cceInternalCodeQualityCrMjs;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      cc = _cc;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      geometry = _cc.geometry;
      math = _cc.math;
    }, function (_recastdetourjsToolRecastDetourManager) {
      RecastDetourManager = _recastdetourjsToolRecastDetourManager.default;
    }, function (_recastdetourjsToolRecastJsPlugin) {
      RecastJSPlugin = _recastdetourjsToolRecastJsPlugin.RecastJSPlugin;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d436e1KSFDvKG14XdvEUXo", "test", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("Test", Test = (_dec = ccclass('Test'), _dec2 = property(cc.Node), _dec3 = property(cc.Node), _dec4 = property(cc.Node), _dec5 = property(cc.Camera), _dec6 = property(cc.Material), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
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

          return _this;
        }

        var _proto = Test.prototype;

        _proto.start = function start() {
          this.pool = new cc.NodePool();
          this.roleNodeRoot = this.roleNode.parent;
          this.roleNode.removeFromParent();
          this.cylinderObstacleNode.removeFromParent();
          this.boxObstacleNode.removeFromParent();
          this.moveDis = 0;
          this.recastDetourManager = (_crd && RecastDetourManager === void 0 ? (_reportPossibleCrUseOfRecastDetourManager({
            error: Error()
          }), RecastDetourManager) : RecastDetourManager).getInstanceByNode(this.node, this.debugMaterial, 1, this.node);
          this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
          this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMove, this); // @ts-ignore

          cc.systemEvent.on(cc.SystemEventType.KEY_DOWN, this.onKeyDown, this); // @ts-ignore

          cc.systemEvent.on(cc.SystemEventType.KEY_UP, this.onKeyUp, this);
          this.cylinderObstaclePool = new cc.NodePool();
          this.boxObstaclePool = new cc.NodePool(); //this.node.children[0].active = false;
        };

        _proto.onKeyDown = function onKeyDown(event) {
          switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.s:
              this.yKey = event.keyCode;
              break;

            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
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

          cc.resources.load("solo_navmesh", cc.Asset, function (err, asset) {
            _this2.recastDetourManager = (_crd && RecastDetourManager === void 0 ? (_reportPossibleCrUseOfRecastDetourManager({
              error: Error()
            }), RecastDetourManager) : RecastDetourManager).getInstanceByBin(asset._file, _this2.debugMaterial, 1);
          });
        };

        _proto.saveBin = function saveBin() {
          this.saveFile("solo_navmesh.bin", this.recastDetourManager.navigationPlugin.getNavmeshData());
        };

        _proto.exportObj = function exportObj() {
          var comps = this.node.getComponentsInChildren(cc.MeshRenderer);
          var str = (_crd && RecastJSPlugin === void 0 ? (_reportPossibleCrUseOfRecastJSPlugin({
            error: Error()
          }), RecastJSPlugin) : RecastJSPlugin).exportObj(comps);
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
          if (this.moveDis > 50) {
            this.moveDis = 0;
            return;
          }

          var ray = this.camera.screenPointToRay(touch.getLocationX(), touch.getLocationY());
          var comps = this.node.getComponentsInChildren(cc.MeshRenderer);
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

          var out = cc.v3();
          ray.computeHit(out, distance);

          switch (this.type) {
            case 1:
              this.recastDetourManager.addAgents(out, this.get(this.pool, this.roleNode));
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
              this.recastDetourManager.addBoxObstacle(node1, out, cc.v3(1, 1, 1), 0);
              break;

            case 5:
              if (!this.startLinkPos) {
                this.startLinkPos = out;
                break;
              }

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
          var item = pool.get() || cc.instantiate(node);
          item.parent = this.roleNodeRoot;
          return item;
        };

        _proto.put = function put(node) {
          this.pool.put(node);
        };

        _proto.update = function update(deltaTime) {
          this.recastDetourManager.update(deltaTime);
          var ySpeed = this.yKey ? this.yKey == cc.macro.KEY.w ? 1 : -1 : 0;
          var xSpeed = this.xKey ? this.xKey == cc.macro.KEY.d ? 1 : -1 : 0;

          if (ySpeed && xSpeed) {
            xSpeed *= 0.7;
            ySpeed *= 0.7;
          }

          var speed = cc.v3();

          if (ySpeed) {
            speed.add(this.camera.node.forward.multiplyScalar(ySpeed));
          }

          if (xSpeed) {
            var worldRotation = this.camera.node.getWorldRotation();
            math.Quat.rotateY(worldRotation, worldRotation, Math.PI / 2);
            speed.add(cc.Vec3.transformQuat(new cc.Vec3(), cc.Vec3.FORWARD, worldRotation).multiplyScalar(-xSpeed));
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

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=test.js.map