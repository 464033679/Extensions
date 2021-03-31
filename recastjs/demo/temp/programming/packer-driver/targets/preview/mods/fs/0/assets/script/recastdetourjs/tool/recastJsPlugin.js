System.register(["cce:/internal/code-quality/cr.mjs", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, math, Vec3, cc, _crd, Epsilon, RecastConfig, RecastJSPlugin, RecastJSCrowd;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _reportPossibleCrUseOfINavigationEnginePlugin(extras) {
    _reporterNs.report("INavigationEnginePlugin", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfICrowd(extras) {
    _reporterNs.report("ICrowd", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIAgentParameters(extras) {
    _reporterNs.report("IAgentParameters", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfINavMeshParameters(extras) {
    _reporterNs.report("INavMeshParameters", "./INavigationEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIObstacle(extras) {
    _reporterNs.report("IObstacle", "./INavigationEngine", _context.meta, extras);
  }

  return {
    setters: [function (_cceInternalCodeQualityCrMjs) {
      _reporterNs = _cceInternalCodeQualityCrMjs;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      math = _cc.math;
      Vec3 = _cc.Vec3;
      cc = _cc;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0b50frk54dKy4k6XWhHNS1a", "recastJsPlugin", undefined);

      Epsilon = 0.1;

      _export("RecastConfig", RecastConfig = {
        RATIO: 1
      });
      /**
       * RecastJS navigation plugin
       */


      _export("RecastJSPlugin", RecastJSPlugin = /*#__PURE__*/function () {
        /**
         * Reference to the Recast library
         */

        /**
         * plugin name
         */

        /**
         * the first navmesh created. We might extend this to support multiple navmeshes
         */

        /**
         * Initializes the recastJS plugin
         * @param recastInjection can be used to inject your own recast reference
         */
        function RecastJSPlugin(recastInjection) {
          if (recastInjection === void 0) {
            recastInjection = Recast;
          }

          _defineProperty(this, "bjsRECAST", {});

          _defineProperty(this, "name", "RecastJSPlugin");

          _defineProperty(this, "navMesh", void 0);

          _defineProperty(this, "_maximumSubStepCount", 10);

          _defineProperty(this, "_timeStep", 1 / 60);

          if (typeof recastInjection === "function") {
            recastInjection(this.bjsRECAST);
          } else {
            this.bjsRECAST = recastInjection;
          }

          if (!this.isSupported()) {
            cc.error("RecastJS is not available. Please make sure you included the js file.");
            return;
          }

          this.setTimeStep();
        }
        /**
         * Set the time step of the navigation tick update.
         * Default is 1/60.
         * A value of 0 will disable fixed time update
         * @param newTimeStep the new timestep to apply to this world.
         */


        var _proto = RecastJSPlugin.prototype;

        _proto.setTimeStep = function setTimeStep(newTimeStep) {
          if (newTimeStep === void 0) {
            newTimeStep = 1 / 60;
          }

          this._timeStep = newTimeStep;
        }
        /**
         * Get the time step of the navigation tick update.
         * @returns the current time step
         */
        ;

        _proto.getTimeStep = function getTimeStep() {
          return this._timeStep;
        }
        /**
         * If delta time in navigation tick update is greater than the time step
         * a number of sub iterations are done. If more iterations are need to reach deltatime
         * they will be discarded.
         * A value of 0 will set to no maximum and update will use as many substeps as needed
         * @param newStepCount the maximum number of iterations
         */
        ;

        _proto.setMaximumSubStepCount = function setMaximumSubStepCount(newStepCount) {
          if (newStepCount === void 0) {
            newStepCount = 10;
          }

          this._maximumSubStepCount = newStepCount;
        }
        /**
         * Get the maximum number of iterations per navigation tick update
         * @returns the maximum number of iterations
         */
        ;

        _proto.getMaximumSubStepCount = function getMaximumSubStepCount() {
          return this._maximumSubStepCount;
        }
        /**
         * Creates a navigation mesh
         * @param meshes array of all the geometry used to compute the navigation mesh
         * @param parameters bunch of parameters used to filter geometry
         */
        ;

        _proto.createNavMesh = function createNavMesh(meshes, parameters) {
          var rc = new this.bjsRECAST.rcConfig();
          rc.cs = parameters.cs;
          rc.ch = parameters.ch;
          rc.borderSize = parameters.borderSize ? parameters.borderSize : 0;
          rc.tileSize = parameters.tileSize ? parameters.tileSize : 0;
          rc.walkableSlopeAngle = parameters.walkableSlopeAngle;
          rc.walkableHeight = parameters.walkableHeight;
          rc.walkableClimb = parameters.walkableClimb;
          rc.walkableRadius = parameters.walkableRadius;
          rc.maxEdgeLen = parameters.maxEdgeLen;
          rc.maxSimplificationError = parameters.maxSimplificationError;
          rc.minRegionArea = parameters.minRegionArea;
          rc.mergeRegionArea = parameters.mergeRegionArea;
          rc.maxVertsPerPoly = parameters.maxVertsPerPoly;
          rc.detailSampleDist = parameters.detailSampleDist;
          rc.detailSampleMaxError = parameters.detailSampleMaxError;
          var offMeshConfig = null;

          if (parameters.offMeshLinkConfig) {
            var config = parameters.offMeshLinkConfig;
            offMeshConfig = this.bjsRECAST.OffMeshLinkConfig.prototype.GetInstance(config.offMeshConVerts, config.offMeshConRad, config.offMeshConFlags, config.offMeshConAreas, config.offMeshConDir, config.offMeshConUserID, config.offMeshConCount);
          }

          this.navMesh = new this.bjsRECAST.NavMesh();

          var _RecastJSPlugin$getMe = RecastJSPlugin.getMeshData(meshes),
              vertexTypeArray = _RecastJSPlugin$getMe.vertexTypeArray,
              startId = _RecastJSPlugin$getMe.startId,
              facesTypeArray = _RecastJSPlugin$getMe.facesTypeArray;

          this.navMesh.build(vertexTypeArray, startId, facesTypeArray, facesTypeArray.length, rc, offMeshConfig);
        }
        /**
         * 获取网格顶点数据
         * @param meshes
         */
        ;

        RecastJSPlugin.getMeshData = function getMeshData(meshes) {
          var comps = meshes;
          var vertexPosList = [];
          var facesPositions = [];
          var vertexLength = 0;
          var facesLength = 0;
          var worldMatrix = new math.Mat4();
          var outPos = cc.v3();
          var group = [];
          var startId = 0;

          for (var i = 0; i < comps.length; ++i) {
            var model = comps[i].model;

            if (!model) {
              continue;
            }

            comps[i].node.getWorldMatrix(worldMatrix);
            var subModels = model.subModels;
            var r = 1 / RecastConfig.RATIO;

            for (var j = 0; j < subModels.length; j++) {
              group.push(startId);
              var subMesh = subModels[j].subMesh;
              var info = subMesh.geometricInfo;

              if (info && info.positions && info.indices) {
                var positions = [];
                var num = info.positions.length / 3;

                for (var n = 0; n < num; ++n) {
                  Vec3.transformMat4(outPos, cc.v3(info.positions[n * 3], info.positions[n * 3 + 1], info.positions[n * 3 + 2]), worldMatrix);
                  positions.push(outPos.x * r, outPos.y * r, outPos.z * r);
                }

                vertexPosList.push(positions);
                startId += positions.length / 3;
                facesPositions.push(info.indices);
                vertexLength += info.positions.length;
                facesLength += info.indices.length;
              }
            }
          }

          var vertexTypeArray = new Float32Array(new ArrayBuffer(4 * vertexLength));
          var facesTypeArray = new Uint16Array(new ArrayBuffer(2 * facesLength));
          startId = 0;
          var facesIndex = 0;

          for (var _i = 0; _i < vertexPosList.length; ++_i) {
            vertexTypeArray.set(vertexPosList[_i], startId * 3);
            var list = facesPositions[_i];

            for (var _j = 0; _j < list.length; ++_j) {
              facesTypeArray[facesIndex++] = startId + list[_j];
            }

            startId += vertexPosList[_i].length / 3;
          }

          return {
            vertexTypeArray: vertexTypeArray,
            startId: startId,
            facesTypeArray: facesTypeArray,
            group: group
          };
        };

        RecastJSPlugin.exportObj = function exportObj(meshes) {
          var output = [];

          var _this$getMeshData = this.getMeshData(meshes),
              vertexTypeArray = _this$getMeshData.vertexTypeArray,
              facesTypeArray = _this$getMeshData.facesTypeArray,
              group = _this$getMeshData.group;

          for (var h = 0; h < vertexTypeArray.length; h += 3) {
            output.push("v " + vertexTypeArray[h] + " " + vertexTypeArray[h + 1] + " " + vertexTypeArray[h + 2]);
          }

          for (var i = 0; i < facesTypeArray.length; i += 3) {
            if (group.indexOf(i / 3) !== -1) {
              output.push("g Cube" + group.indexOf(i / 2));
            }

            output.push("f " + (facesTypeArray[i] + 1) + " " + (facesTypeArray[i + 1] + 1) + " " + (facesTypeArray[i + 2] + 1));
          }

          var text = output.join("\n");
          return text;
        }
        /**
         * Create a navigation mesh debug mesh
         * @param scene is where the mesh will be added
         * @returns debug display mesh
         */
        ;

        _proto.createDebugNavMesh = function createDebugNavMesh(scene) {
          var debugNavMesh = this.navMesh.getDebugNavMesh();
          var triangleCount = debugNavMesh.getTriangleCount();
          var indices = [];
          var positions = [];
          var tri;
          var pt;

          for (tri = 0; tri < triangleCount * 3; tri++) {
            indices.push(tri);
          }

          for (tri = 0; tri < triangleCount; tri++) {
            for (pt = 0; pt < 3; pt++) {
              var point = debugNavMesh.getTriangle(tri).getPoint(pt);
              positions.push(point.x, point.y, point.z);
            }
          }

          return RecastJSPlugin.createMeshRenderer(scene, positions, indices);
        }
        /**
         * 根据顶点和三角面数据创建meshRenderer
         * @param scene
         * @param positions
         * @param indices
         */
        ;

        RecastJSPlugin.createMeshRenderer = function createMeshRenderer(scene, positions, indices) {
          var node = new cc.Node();
          scene.addChild(node);
          var m4 = new math.Mat4();
          math.Mat4.invert(m4, node.getWorldMatrix(m4));
          var pos = cc.v3();

          for (var i = 0; i < positions.length; i += 3) {
            pos.x = positions[i];
            pos.y = positions[i + 1];
            pos.z = positions[i + 2];
            Vec3.transformMat4(pos, pos, m4);
            positions[i] = pos.x;
            positions[i + 1] = pos.y;
            positions[i + 2] = pos.z;
          }

          var mesh = cc.utils.createMesh({
            positions: positions,
            indices: indices,
            doubleSided: true
          });
          var comp = node.addComponent(cc.MeshRenderer);
          comp.mesh = mesh;
          return node;
        }
        /**
         * Get a navigation mesh constrained position, closest to the parameter position
         * @param position world position
         * @returns the closest point to position constrained by the navigation mesh
         */
        ;

        _proto.getClosestPoint = function getClosestPoint(position) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var ret = this.navMesh.getClosestPoint(p);
          position.x = ret.x;
          position.y = ret.y;
          position.z = ret.z;
          return position;
        }
        /**
         * Get a navigation mesh constrained position, closest to the parameter position
         * @param position world position
         * @param result output the closest point to position constrained by the navigation mesh
         */
        ;

        _proto.getClosestPointToRef = function getClosestPointToRef(position, result) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var ret = this.navMesh.getClosestPoint(p);
          result.set(ret.x, ret.y, ret.z);
        }
        /**
         * Get a navigation mesh constrained position, within a particular radius
         * @param position world position
         * @param maxRadius the maximum distance to the constrained world position
         * @returns the closest point to position constrained by the navigation mesh
         */
        ;

        _proto.getRandomPointAround = function getRandomPointAround(position, maxRadius) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var ret = this.navMesh.getRandomPointAround(p, maxRadius);
          var pr = new Vec3(ret.x, ret.y, ret.z);
          return pr;
        }
        /**
         * Get a navigation mesh constrained position, within a particular radius
         * @param position world position
         * @param maxRadius the maximum distance to the constrained world position
         * @param result output the closest point to position constrained by the navigation mesh
         */
        ;

        _proto.getRandomPointAroundToRef = function getRandomPointAroundToRef(position, maxRadius, result) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var ret = this.navMesh.getRandomPointAround(p, maxRadius);
          result.set(ret.x, ret.y, ret.z);
        }
        /**
         * Compute the final position from a segment made of destination-position
         * @param position world position
         * @param destination world position
         * @returns the resulting point along the navmesh
         */
        ;

        _proto.moveAlong = function moveAlong(position, destination) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var d = new this.bjsRECAST.Vec3(destination.x, destination.y, destination.z);
          var ret = this.navMesh.moveAlong(p, d);
          var pr = new Vec3(ret.x, ret.y, ret.z);
          return pr;
        }
        /**
         * Compute the final position from a segment made of destination-position
         * @param position world position
         * @param destination world position
         * @param result output the resulting point along the navmesh
         */
        ;

        _proto.moveAlongToRef = function moveAlongToRef(position, destination, result) {
          var p = new this.bjsRECAST.Vec3(position.x, position.y, position.z);
          var d = new this.bjsRECAST.Vec3(destination.x, destination.y, destination.z);
          var ret = this.navMesh.moveAlong(p, d);
          result.set(ret.x, ret.y, ret.z);
        }
        /**
         * Compute a navigation path from start to end. Returns an empty array if no path can be computed
         * @param start world position
         * @param end world position
         * @returns array containing world position composing the path
         */
        ;

        _proto.computePath = function computePath(start, end) {
          var pt;
          var startPos = new this.bjsRECAST.Vec3(start.x, start.y, start.z);
          var endPos = new this.bjsRECAST.Vec3(end.x, end.y, end.z);
          var navPath = this.navMesh.computePath(startPos, endPos);
          var pointCount = navPath.getPointCount();
          var positions = [];

          for (pt = 0; pt < pointCount; pt++) {
            var p = navPath.getPoint(pt);
            positions.push(new Vec3(p.x, p.y, p.z));
          }

          return positions;
        }
        /**
         * Create a new Crowd so you can add agents
         * @param maxAgents the maximum agent count in the crowd
         * @param maxAgentRadius the maximum radius an agent can have
         * @param scene to attach the crowd to
         * @returns the crowd you can add agents to
         */
        ;

        _proto.createCrowd = function createCrowd(maxAgents, maxAgentRadius, scene) {
          var crowd = new RecastJSCrowd(this, maxAgents, maxAgentRadius, scene);
          return crowd;
        }
        /**
         * Set the Bounding box extent for doing spatial queries (getClosestPoint, getRandomPointAround, ...)
         * The queries will try to find a solution within those bounds
         * default is (1,1,1)
         * @param extent x,y,z value that define the extent around the queries point of reference
         */
        ;

        _proto.setDefaultQueryExtent = function setDefaultQueryExtent(extent) {
          var ext = new this.bjsRECAST.Vec3(extent.x, extent.y, extent.z);
          this.navMesh.setDefaultQueryExtent(ext);
        }
        /**
         * Get the Bounding box extent specified by setDefaultQueryExtent
         * @returns the box extent values
         */
        ;

        _proto.getDefaultQueryExtent = function getDefaultQueryExtent() {
          var p = this.navMesh.getDefaultQueryExtent();
          return new Vec3(p.x, p.y, p.z);
        }
        /**
         * build the navmesh from a previously saved state using getNavmeshData
         * @param data the Uint8Array returned by getNavmeshData
         */
        ;

        _proto.buildFromNavmeshData = function buildFromNavmeshData(data) {
          var nDataBytes = data.length * data.BYTES_PER_ELEMENT;

          var dataPtr = this.bjsRECAST._malloc(nDataBytes);

          var dataHeap = new Uint8Array(this.bjsRECAST.HEAPU8.buffer, dataPtr, nDataBytes);
          dataHeap.set(data);
          var buf = new this.bjsRECAST.NavmeshData();
          buf.dataPointer = dataHeap.byteOffset;
          buf.size = data.length;
          this.navMesh = new this.bjsRECAST.NavMesh();
          this.navMesh.buildFromNavmeshData(buf); // Free memory

          this.bjsRECAST._free(dataHeap.byteOffset);
        }
        /**
         * returns the navmesh data that can be used later. The navmesh must be built before retrieving the data
         * @returns data the Uint8Array that can be saved and reused
         */
        ;

        _proto.getNavmeshData = function getNavmeshData() {
          var navmeshData = this.navMesh.getNavmeshData();
          var arrView = new Uint8Array(this.bjsRECAST.HEAPU8.buffer, navmeshData.dataPointer, navmeshData.size);
          var ret = new Uint8Array(navmeshData.size);
          ret.set(arrView);
          this.navMesh.freeNavmeshData(navmeshData);
          return ret;
        }
        /**
         * Get the Bounding box extent result specified by setDefaultQueryExtent
         * @param result output the box extent values
         */
        ;

        _proto.getDefaultQueryExtentToRef = function getDefaultQueryExtentToRef(result) {
          var p = this.navMesh.getDefaultQueryExtent();
          result.set(p.x, p.y, p.z);
        }
        /**
         * Disposes
         */
        ;

        _proto.dispose = function dispose() {}
        /**
         * Creates a cylinder obstacle and add it to the navigation
         * @param position world position
         * @param radius cylinder radius
         * @param height cylinder height
         * @returns the obstacle freshly created
         */
        ;

        _proto.addCylinderObstacle = function addCylinderObstacle(position, radius, height) {
          return this.navMesh.addCylinderObstacle(new this.bjsRECAST.Vec3(position.x, position.y, position.z), radius, height);
        }
        /**
         * Creates an oriented box obstacle and add it to the navigation
         * @param position world position
         * @param extent box size
         * @param angle angle in radians of the box orientation on Y axis
         * @returns the obstacle freshly created
         */
        ;

        _proto.addBoxObstacle = function addBoxObstacle(position, extent, angle) {
          return this.navMesh.addBoxObstacle(new this.bjsRECAST.Vec3(position.x, position.y, position.z), new this.bjsRECAST.Vec3(extent.x, extent.y, extent.z), angle);
        }
        /**
         * Removes an obstacle created by addCylinderObstacle or addBoxObstacle
         * @param obstacle obstacle to remove from the navigation
         */
        ;

        _proto.removeObstacle = function removeObstacle(obstacle) {
          this.navMesh.removeObstacle(obstacle);
        }
        /**
         * If this plugin is supported
         * @returns true if plugin is supported
         */
        ;

        _proto.isSupported = function isSupported() {
          return this.bjsRECAST !== undefined;
        };

        return RecastJSPlugin;
      }());
      /**
       * Recast detour crowd implementation
       */


      _export("RecastJSCrowd", RecastJSCrowd = /*#__PURE__*/function () {
        /**
         * Recast/detour plugin
         */

        /**
         * Link to the detour crowd
         */

        /**
         * One transform per agent
         */

        /**
         * All agents created
         */

        /**
         * Link to the scene is kept to unregister the crowd from the scene
         */

        /**
         * Constructor
         * @param plugin recastJS plugin
         * @param maxAgents the maximum agent count in the crowd
         * @param maxAgentRadius the maximum radius an agent can have
         * @param scene to attach the crowd to
         * @returns the crowd you can add agents to
         */
        function RecastJSCrowd(plugin, maxAgents, maxAgentRadius, scene) {
          _defineProperty(this, "bjsRECASTPlugin", void 0);

          _defineProperty(this, "recastCrowd", {});

          _defineProperty(this, "transforms", new Array());

          _defineProperty(this, "agents", new Array());

          _defineProperty(this, "_scene", void 0);

          this.bjsRECASTPlugin = plugin;
          this.recastCrowd = new this.bjsRECASTPlugin.bjsRECAST.Crowd(maxAgents, maxAgentRadius, this.bjsRECASTPlugin.navMesh.getNavMesh());
          this._scene = scene;
        }
        /**
         * Add a new agent to the crowd with the specified parameter a corresponding transformNode.
         * You can attach anything to that node. The node position is updated in the scene update tick.
         * @param pos world position that will be constrained by the navigation mesh
         * @param parameters agent parameters
         * @param transform hooked to the agent that will be update by the scene
         * @returns agent index
         */


        var _proto2 = RecastJSCrowd.prototype;

        _proto2.addAgent = function addAgent(pos, parameters, transform) {
          var agentParams = new this.bjsRECASTPlugin.bjsRECAST.dtCrowdAgentParams();
          agentParams.radius = parameters.radius;
          agentParams.height = parameters.height;
          agentParams.maxAcceleration = parameters.maxAcceleration;
          agentParams.maxSpeed = parameters.maxSpeed;
          agentParams.collisionQueryRange = parameters.collisionQueryRange;
          agentParams.pathOptimizationRange = parameters.pathOptimizationRange;
          agentParams.separationWeight = parameters.separationWeight;
          agentParams.updateFlags = 7;
          agentParams.obstacleAvoidanceType = 0;
          agentParams.queryFilterType = 0;
          agentParams.userData = 0;
          var agentIndex = this.recastCrowd.addAgent(new this.bjsRECASTPlugin.bjsRECAST.Vec3(pos.x, pos.y, pos.z), agentParams);
          this.transforms.push(transform);
          this.agents.push(agentIndex);
          return agentIndex;
        }
        /**
         * Returns the agent position in world space
         * @param index agent index returned by addAgent
         * @returns world space position
         */
        ;

        _proto2.getAgentPosition = function getAgentPosition(index) {
          var agentPos = this.recastCrowd.getAgentPosition(index);
          return RecastJSCrowd.getWorldPosition(agentPos);
        }
        /**
         * 获取世界坐标
         * @param recastPos
         */
        ;

        RecastJSCrowd.getWorldPosition = function getWorldPosition(recastPos) {
          return new Vec3(recastPos.x * RecastConfig.RATIO, recastPos.y * RecastConfig.RATIO, recastPos.z * RecastConfig.RATIO);
        }
        /**
         * Returns the agent position result in world space
         * @param index agent index returned by addAgent
         * @param result output world space position
         */
        ;

        _proto2.getAgentPositionToRef = function getAgentPositionToRef(index, result) {
          var agentPos = this.recastCrowd.getAgentPosition(index);
          result.set(agentPos.x, agentPos.y, agentPos.z);
        }
        /**
         * Returns the agent velocity in world space
         * @param index agent index returned by addAgent
         * @returns world space velocity
         */
        ;

        _proto2.getAgentVelocity = function getAgentVelocity(index) {
          var agentVel = this.recastCrowd.getAgentVelocity(index);
          return new Vec3(agentVel.x, agentVel.y, agentVel.z);
        }
        /**
         * Returns the agent velocity result in world space
         * @param index agent index returned by addAgent
         * @param result output world space velocity
         */
        ;

        _proto2.getAgentVelocityToRef = function getAgentVelocityToRef(index, result) {
          var agentVel = this.recastCrowd.getAgentVelocity(index);
          result.set(agentVel.x, agentVel.y, agentVel.z);
        }
        /**
         * Returns the agent next target point on the path
         * @param index agent index returned by addAgent
         * @returns world space position
         */
        ;

        _proto2.getAgentNextTargetPath = function getAgentNextTargetPath(index) {
          var pathTargetPos = this.recastCrowd.getAgentNextTargetPath(index);
          return new Vec3(pathTargetPos.x, pathTargetPos.y, pathTargetPos.z);
        }
        /**
         * Returns the agent next target point on the path
         * @param index agent index returned by addAgent
         * @param result output world space position
         */
        ;

        _proto2.getAgentNextTargetPathToRef = function getAgentNextTargetPathToRef(index, result) {
          var pathTargetPos = this.recastCrowd.getAgentNextTargetPath(index);
          result.set(pathTargetPos.x, pathTargetPos.y, pathTargetPos.z);
        }
        /**
         * Gets the agent state
         * @param index agent index returned by addAgent
         * @returns agent state
         */
        ;

        _proto2.getAgentState = function getAgentState(index) {
          return this.recastCrowd.getAgentState(index);
        }
        /**
         * returns true if the agent in over an off mesh link connection
         * @param index agent index returned by addAgent
         * @returns true if over an off mesh link connection
         */
        ;

        _proto2.overOffmeshConnection = function overOffmeshConnection(index) {
          return this.recastCrowd.overOffmeshConnection(index);
        }
        /**
         * Asks a particular agent to go to a destination. That destination is constrained by the navigation mesh
         * @param index agent index returned by addAgent
         * @param destination targeted world position
         */
        ;

        _proto2.agentGoto = function agentGoto(index, destination) {
          this.recastCrowd.agentGoto(index, new this.bjsRECASTPlugin.bjsRECAST.Vec3(destination.x, destination.y, destination.z));
        }
        /**
         * Teleport the agent to a new position
         * @param index agent index returned by addAgent
         * @param destination targeted world position
         */
        ;

        _proto2.agentTeleport = function agentTeleport(index, destination) {
          this.recastCrowd.agentTeleport(index, new this.bjsRECASTPlugin.bjsRECAST.Vec3(destination.x, destination.y, destination.z));
        }
        /**
         * Update agent parameters
         * @param index agent index returned by addAgent
         * @param parameters agent parameters
         */
        ;

        _proto2.updateAgentParameters = function updateAgentParameters(index, parameters) {
          var agentParams = this.recastCrowd.getAgentParameters(index);

          if (parameters.radius !== undefined) {
            agentParams.radius = parameters.radius;
          }

          if (parameters.height !== undefined) {
            agentParams.height = parameters.height;
          }

          if (parameters.maxAcceleration !== undefined) {
            agentParams.maxAcceleration = parameters.maxAcceleration;
          }

          if (parameters.maxSpeed !== undefined) {
            agentParams.maxSpeed = parameters.maxSpeed;
          }

          if (parameters.collisionQueryRange !== undefined) {
            agentParams.collisionQueryRange = parameters.collisionQueryRange;
          }

          if (parameters.pathOptimizationRange !== undefined) {
            agentParams.pathOptimizationRange = parameters.pathOptimizationRange;
          }

          if (parameters.separationWeight !== undefined) {
            agentParams.separationWeight = parameters.separationWeight;
          }

          this.recastCrowd.setAgentParameters(index, agentParams);
        }
        /**
         * remove a particular agent previously created
         * @param index agent index returned by addAgent
         */
        ;

        _proto2.removeAgent = function removeAgent(index) {
          this.recastCrowd.removeAgent(index);
          var item = this.agents.indexOf(index);

          if (item > -1) {
            this.agents.splice(item, 1);
            this.transforms.splice(item, 1)[0].destroy();
          }
        }
        /**
         * get the list of all agents attached to this crowd
         * @returns list of agent indices
         */
        ;

        _proto2.getAgents = function getAgents() {
          return this.agents;
        }
        /**
         * Tick update done by the Scene. Agent position/velocity/acceleration is updated by this function
         * @param deltaTime in seconds
         */
        ;

        _proto2.update = function update(deltaTime) {
          // update obstacles
          this.bjsRECASTPlugin.navMesh.update(); // update crowd

          var timeStep = this.bjsRECASTPlugin.getTimeStep();
          var maxStepCount = this.bjsRECASTPlugin.getMaximumSubStepCount();

          if (timeStep <= Epsilon) {
            this.recastCrowd.update(deltaTime);
          } else {
            var iterationCount = Math.floor(deltaTime / timeStep);

            if (maxStepCount && iterationCount > maxStepCount) {
              iterationCount = maxStepCount;
            }

            if (iterationCount < 1) {
              iterationCount = 1;
            }

            var step = deltaTime / iterationCount;

            for (var i = 0; i < iterationCount; i++) {
              this.recastCrowd.update(step);
            }
          } // update transforms


          for (var index = 0; index < this.agents.length; index++) {
            this.transforms[index].worldPosition = this.getAgentPosition(this.agents[index]);
          }
        }
        /**
         * Set the Bounding box extent for doing spatial queries (getClosestPoint, getRandomPointAround, ...)
         * The queries will try to find a solution within those bounds
         * default is (1,1,1)
         * @param extent x,y,z value that define the extent around the queries point of reference
         */
        ;

        _proto2.setDefaultQueryExtent = function setDefaultQueryExtent(extent) {
          var ext = new this.bjsRECASTPlugin.bjsRECAST.Vec3(extent.x, extent.y, extent.z);
          this.recastCrowd.setDefaultQueryExtent(ext);
        }
        /**
         * Get the Bounding box extent specified by setDefaultQueryExtent
         * @returns the box extent values
         */
        ;

        _proto2.getDefaultQueryExtent = function getDefaultQueryExtent() {
          var p = this.recastCrowd.getDefaultQueryExtent();
          return new Vec3(p.x, p.y, p.z);
        }
        /**
         * Get the Bounding box extent result specified by setDefaultQueryExtent
         * @param result output the box extent values
         */
        ;

        _proto2.getDefaultQueryExtentToRef = function getDefaultQueryExtentToRef(result) {
          var p = this.recastCrowd.getDefaultQueryExtent();
          result.set(p.x, p.y, p.z);
        }
        /**
         * Get the next corner points composing the path (max 4 points)
         * @param index agent index returned by addAgent
         * @returns array containing world position composing the path
         */
        ;

        _proto2.getCorners = function getCorners(index) {
          var pt;
          var navPath = this.recastCrowd.getPath(index);
          var pointCount = navPath.getPointCount();
          var positions = [];

          for (pt = 0; pt < pointCount; pt++) {
            var p = navPath.getPoint(pt);
            positions.push(new Vec3(p.x, p.y, p.z));
          }

          return positions;
        }
        /**
         * Release all resources
         */
        ;

        _proto2.dispose = function dispose() {
          this.recastCrowd.destroy();
        };

        return RecastJSCrowd;
      }());

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=recastJsPlugin.js.map