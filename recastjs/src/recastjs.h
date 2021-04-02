#pragma once
#include "../recastnavigation/Detour/Include/DetourNavMesh.h"
#include "../recastnavigation/Detour/Include/DetourCommon.h"
#include "../recastnavigation/Detour/Include/DetourNavMeshBuilder.h"
#include "../recastnavigation/DetourCrowd/Include/DetourCrowd.h"
#include "../recastnavigation/DetourTileCache/Include/DetourTileCache.h"
#include "../recastnavigation/DetourTileCache/Include/DetourTileCacheBuilder.h"
#include "../recastnavigation/RecastDemo/Contrib/fastlz/fastlz.h"
#include <vector>
#include <iostream>
#include <list>

class dtNavMeshQuery;
class dtNavMesh;
class MeshLoader;
class NavMesh;
struct rcPolyMesh;
class rcPolyMeshDetail;
struct rcConfig;
struct NavMeshintermediates;
struct TileCacheData;

#ifndef Log(str)
#define Log(str) std::cout << std::string(str) << std::endl;
#endif // DEBUG


struct Vec3 
{
    Vec3() {}
    Vec3(float v) : x(v), y(v), z(v) {}
    Vec3(float x, float y, float z) : x(x), y(y), z(z) {}
    void isMinOf(const Vec3& v)
    {
        x = std::min(x, v.x);
        y = std::min(y, v.y);
        z = std::min(z, v.z);
    }
    void isMaxOf(const Vec3& v)
    {
        x = std::max(x, v.x);
        y = std::max(y, v.y);
        z = std::max(z, v.z);
    }
    float operator [](int index) {
        return ((float*)&x)[index];
    }
    float x, y, z;
};

struct OffMeshLinkConfig
{
	OffMeshLinkConfig() {
	}
	static OffMeshLinkConfig* GetInstance(const float* offMeshConVerts, const  float* offMeshConRad, const  int* offMeshConFlags,
		const  int * offMeshConAreas, const  int * offMeshConDir, const  int* offMeshConUserID, const  int offMeshConCount)
	{
		if (m_pInstance == NULL) {
			m_pInstance = new OffMeshLinkConfig();
		}
		else {
			m_pInstance->free();
		}
		m_pInstance->init(offMeshConVerts, offMeshConRad, offMeshConFlags, offMeshConAreas, offMeshConDir, offMeshConUserID, offMeshConCount);
		return m_pInstance;
	}
	//AreaTypeList �����б�ÿ��link 6������
	float* offMeshConVerts;
	//link ����
	float* offMeshConRad;
	//link��־
	unsigned short* offMeshConFlags;//char
	//AreaTypeList char ��������
	unsigned char* offMeshConAreas;//char
	//�Ƿ�˫�� 0 �� 1��
	unsigned char* offMeshConDir;
	//link id
	unsigned int* offMeshConUserID;
	//link ����
	int offMeshConCount;
	template<class T, class K>
	T* getArray(K* array, int size, T v) {
		T* s = new T[size];
		for (int i = 0; i < size; ++i) {
			s[i] = (T)array[i];
		}
		return s;
	}

	void init(const float* offMeshConVerts, const  float* offMeshConRad, const  int* offMeshConFlags,
		const  int * offMeshConAreas, const  int * offMeshConDir, const  int* offMeshConUserID, const  int offMeshConCount) {
		this->offMeshConVerts = this->getArray(offMeshConVerts, offMeshConCount * 6, 0.1f);
		this->offMeshConRad = this->getArray(offMeshConRad, offMeshConCount, 0.1f);
		unsigned char ch;
		unsigned short s;
		this->offMeshConFlags = this->getArray(offMeshConFlags, offMeshConCount, s);
		this->offMeshConAreas = this->getArray(offMeshConAreas, offMeshConCount, ch);
		this->offMeshConDir = this->getArray(offMeshConDir, offMeshConCount, ch);
		this->offMeshConUserID = this->getArray(offMeshConUserID, offMeshConCount, 1u);
		this->offMeshConCount = offMeshConCount;
		if (this->offMeshConCount) {
			Log((std::to_string(this->offMeshConVerts[0]) + " " + std::to_string(this->offMeshConRad[0]) + " " + std::to_string(this->offMeshConFlags[0]) + " " + std::to_string(this->offMeshConCount)).c_str());
		}
	}
	void free() {
		delete[] this->offMeshConVerts;
		delete[] this->offMeshConRad;
		delete[] this->offMeshConFlags;
		delete[] this->offMeshConAreas;
		delete[] this->offMeshConDir;
		delete[] this->offMeshConUserID;
	}
	private:
		static OffMeshLinkConfig * m_pInstance;
};

struct Triangle 
{
    Triangle(){}
    const Vec3& getPoint(long n)
    {
        if (n < 2)
        {
            return mPoint[n];
        }
        return mPoint[2];
    }
    Vec3 mPoint[3];
};

struct DebugNavMesh 
{
    int getTriangleCount() { return int(mTriangles.size()); }
    const Triangle& getTriangle(int n)
    {
        if (n < int(mTriangles.size()))
        {
            return mTriangles[n];
        }
        return mTriangles.back();
    }
    std::vector<Triangle> mTriangles;
};

struct NavPath
{
    int getPointCount() { return int(mPoints.size()); }
    const Vec3& getPoint(int n)
    {
        if (n < int(mPoints.size()))
        {
            return mPoints[n];
        }
        return mPoints.back();
    }
    std::vector<Vec3> mPoints;
};

struct NavmeshData
{
    void* dataPointer;
    int size;
};

struct RecastFastLZCompressor : public dtTileCacheCompressor
{
    virtual int maxCompressedSize(const int bufferSize)
    {
        return (int)(bufferSize* 1.05f);
    }
    
    virtual dtStatus compress(const unsigned char* buffer, const int bufferSize,
                              unsigned char* compressed, const int /*maxCompressedSize*/, int* compressedSize)
    {
        *compressedSize = fastlz_compress((const void *const)buffer, bufferSize, compressed);
        return DT_SUCCESS;
    }
    
    virtual dtStatus decompress(const unsigned char* compressed, const int compressedSize,
                                unsigned char* buffer, const int maxBufferSize, int* bufferSize)
    {
        *bufferSize = fastlz_decompress(compressed, compressedSize, buffer, maxBufferSize);
        return *bufferSize < 0 ? DT_FAILURE : DT_SUCCESS;
    }
};

struct RecastLinearAllocator : public dtTileCacheAlloc
{
    unsigned char* buffer;
    size_t capacity;
    size_t top;
    size_t high;
    
    RecastLinearAllocator(const size_t cap) : buffer(0), capacity(0), top(0), high(0)
    {
        resize(cap);
    }
    
    ~RecastLinearAllocator()
    {
        dtFree(buffer);
    }

    void resize(const size_t cap)
    {
        if (buffer) dtFree(buffer);
        buffer = (unsigned char*)dtAlloc(cap, DT_ALLOC_PERM);
        capacity = cap;
    }
    
    virtual void reset()
    {
        high = dtMax(high, top);
        top = 0;
    }
    
    virtual void* alloc(const size_t size)
    {
        if (!buffer)
            return 0;
        if (top+size > capacity)
            return 0;
        unsigned char* mem = &buffer[top];
        top += size;
        return mem;
    }
    
    virtual void free(void* /*ptr*/)
    {
        // Empty
    }
};

struct RecastMeshProcess : public dtTileCacheMeshProcess
{

    inline RecastMeshProcess()
    {
    }

	const OffMeshLinkConfig* config;

    virtual void process(struct dtNavMeshCreateParams* params,
                         unsigned char* polyAreas, unsigned short* polyFlags)
    {
        // Update poly flags from areas.
        for (int i = 0; i < params->polyCount; ++i)
        {
            polyAreas[i] = 0;
            polyFlags[i] = 1; //SAMPLE_POLYFLAGS_WALK
        }

		if (config) {
			// Pass in off-mesh connections.
			params->offMeshConVerts = config->offMeshConVerts;//m_geom->getOffMeshConnectionVerts();
			params->offMeshConRad = config->offMeshConRad;//m_geom->getOffMeshConnectionRads();
			params->offMeshConDir = config->offMeshConDir;//m_geom->getOffMeshConnectionDirs();
			params->offMeshConAreas = config->offMeshConAreas;//m_geom->getOffMeshConnectionAreas();
			params->offMeshConFlags = config->offMeshConFlags;//m_geom->getOffMeshConnectionFlags();
			params->offMeshConUserID = config->offMeshConUserID;//m_geom->getOffMeshConnectionId();
			params->offMeshConCount = config->offMeshConCount;//m_geom->getOffMeshConnectionCount();    
		}
    }
};

class NavMesh
{
public:
    NavMesh() : m_navQuery(0)
        , m_navMesh(0)
        , m_tileCache(0)
        , m_pmesh(0)
        , m_dmesh(0)
        , m_navData(0)
        , m_defaultQueryExtent(1.f)
        , m_talloc(32000)
    {

    }
    void destroy();
	template<class T, class K>
	std::vector<T>& getArray(K* array, int size,T v) {
		std::vector<T> tempArray;
		tempArray.resize(size);
		for (int i = 0; i < size; ++i) {
			tempArray.push_back((T)array[i]);
		}
		return tempArray;
	}
    void build(const float* positions, const int positionCount, const int* indices, const int indexCount, const rcConfig& config, const OffMeshLinkConfig& offMeshConfig);
    void buildFromNavmeshData(NavmeshData* navmeshData);
    NavmeshData getNavmeshData() const;
    void freeNavmeshData(NavmeshData* navmeshData);

    DebugNavMesh getDebugNavMesh();
    Vec3 getClosestPoint(const Vec3& position);
    Vec3 getRandomPointAround(const Vec3& position, float maxRadius);
    Vec3 moveAlong(const Vec3& position, const Vec3& destination);
    dtNavMesh* getNavMesh() 
    { 
        return m_navMesh; 
    }
    NavPath computePath(const Vec3& start, const Vec3& end) const;
    void setDefaultQueryExtent(const Vec3& extent)
    {
        m_defaultQueryExtent = extent;
    }
    Vec3 getDefaultQueryExtent() const
    {
        return m_defaultQueryExtent;
    }

    dtObstacleRef* addCylinderObstacle(const Vec3& position, float radius, float height);
    dtObstacleRef* addBoxObstacle(const Vec3& position, const Vec3& extent, float angle);
    void removeObstacle(dtObstacleRef* obstacle);
    void update();

    dtTileCache* m_tileCache;
    dtNavMeshQuery* m_navQuery;
protected:

    std::list<dtObstacleRef> m_obstacles;
    dtNavMesh* m_navMesh;
    
    rcPolyMesh* m_pmesh;
    rcPolyMeshDetail* m_dmesh;
    unsigned char* m_navData;
    Vec3 m_defaultQueryExtent;

    RecastLinearAllocator m_talloc;
    RecastFastLZCompressor m_tcomp;
    RecastMeshProcess m_tmproc;

    void navMeshPoly(DebugNavMesh& debugNavMesh, const dtNavMesh& mesh, dtPolyRef ref);
    void navMeshPolysWithFlags(DebugNavMesh& debugNavMesh, const dtNavMesh& mesh, const unsigned short polyFlags);
    bool computeTiledNavMesh(const std::vector<float>& verts, const std::vector<int>& tris, rcConfig& cfg, NavMeshintermediates& intermediates, const std::vector<unsigned char>& triareas, const OffMeshLinkConfig& offMeshConfig);
    int rasterizeTileLayers(const int tx, const int ty, const rcConfig& cfg, TileCacheData* tiles, const int maxTiles, NavMeshintermediates& intermediates, const std::vector<unsigned char>& triareas, const std::vector<float>& verts);
};

class Crowd
{
public:
    Crowd(const int maxAgents, const float maxAgentRadius, dtNavMesh* nav);
    void destroy();
    int addAgent(const Vec3& pos, const dtCrowdAgentParams* params);
    void removeAgent(const int idx);
    void update(const float dt);
    Vec3 getAgentPosition(int idx);
    Vec3 getAgentVelocity(int idx);
    Vec3 getAgentNextTargetPath(int idx);
    int getAgentState(int idx);
    bool overOffmeshConnection(int idx);
    void agentGoto(int idx, const Vec3& destination);
    void agentTeleport(int idx, const Vec3& destination);
    dtCrowdAgentParams getAgentParameters(const int idx);
    void setAgentParameters(const int idx, const dtCrowdAgentParams* params);
    void setDefaultQueryExtent(const Vec3& extent)
    {
        m_defaultQueryExtent = extent;
    }
    Vec3 getDefaultQueryExtent() const
    {
        return m_defaultQueryExtent;
    }
    NavPath getCorners(const int idx);

protected:

    dtCrowd *m_crowd;
    Vec3 m_defaultQueryExtent;
};
