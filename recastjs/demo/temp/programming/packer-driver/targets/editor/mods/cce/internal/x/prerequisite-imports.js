System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: async function () {
      // Auto generated represents the prerequisite imports of project modules.
      await (async () => {
        const requests = [() => _context.import('file:///D:/BabylonJsExtensions/recastjs/demo/assets/script/recastdetourjs/tool/INavigationEngine.ts'), () => _context.import('file:///D:/BabylonJsExtensions/recastjs/demo/assets/script/recastdetourjs/tool/RecastDetourManager.ts'), () => _context.import('file:///D:/BabylonJsExtensions/recastjs/demo/assets/script/recastdetourjs/tool/recastJsPlugin.ts'), () => _context.import('file:///D:/BabylonJsExtensions/recastjs/demo/assets/script/test.ts')];

        for (const request of requests) {
          try {
            await request();
          } catch (_err) {// The error should have been caught by executor.
          }
        }
      })();
    }
  };
});
//# sourceMappingURL=prerequisite-imports.js.map