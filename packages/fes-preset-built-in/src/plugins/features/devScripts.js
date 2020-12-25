import {
    readFileSync
} from 'fs';

export default (api) => {
    api.describe({
        key: 'devScripts',
        config: {
            schema(joi) {
                return joi.object();
            }
        },
        enableBy() {
            return api.env === 'development';
        }
    });

    api.addBeforeMiddlewares(() => (req, res, next) => {
        if (req.path.includes('@@/devScripts.js')) {
            api.applyPlugins({
                key: 'addDevScripts',
                type: api.ApplyPluginsType.add,
                initialValue: process.env.HMR !== 'none'
                    ? [
                        readFileSync(
                            require.resolve(
                                '@umijs/bundler-webpack/bundled/webpackHotDevClient'
                            ),
                            'utf-8'
                        )
                    ]
                    : []
            }).then((scripts) => {
                res.end(
                    scripts
                        .join('\r\n\r\n')
                        .replace(
                            /{}.SOCKET_SERVER/g,
                            JSON.stringify(process.env.SOCKET_SERVER || '')
                        )
                );
            });
        } else {
            next();
        }
    });

    api.addHTMLHeadScripts(() => [{
        src: '@@/devScripts.js'
    }]);

    api.onGenerateFiles(() => {
        api.writeTmpFile({
            path: './core/devScripts.js',
            content: process.env.HMR !== 'none'
                ? `
if (window.g_initWebpackHotDevClient) {
  function tryApplyUpdates(onHotUpdateSuccess) {
    // @ts-ignore
    if (!module.hot) {
      window.location.reload();
      return;
    }

    function isUpdateAvailable() {
      // @ts-ignore
      return window.g_getMostRecentCompilationHash() !== __webpack_hash__;
    }

    // TODO: is update available?
    // @ts-ignore
    if (!isUpdateAvailable() || module.hot.status() !== 'idle') {
      return;
    }

    function handleApplyUpdates(err, updatedModules) {
      if (err || !updatedModules || window.g_getHadRuntimeError()) {
        window.location.reload();
        return;
      }

      onHotUpdateSuccess && onHotUpdateSuccess();

      if (isUpdateAvailable()) {
        // While we were updating, there was a new update! Do it again.
        tryApplyUpdates();
      }
    }

    // @ts-ignore
    module.hot.check(true).then(
      function (updatedModules) {
        handleApplyUpdates(null, updatedModules);
      },
      function (err) {
        handleApplyUpdates(err, null);
      },
    );
  }

  window.g_initWebpackHotDevClient({
    tryApplyUpdates,
  });
}
      `
                : ''
        });
    });

    api.addEntryImportsAhead(() => [{
        source: '@@/core/devScripts'
    }]);
};
