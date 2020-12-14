import { access } from "./core";
import { plugin, ApplyPluginsType } from "@@/core/coreExports";

async function getInitialState() {
    const appGetInitialState = plugin.applyPlugins({
        key: "getInitialState",
        type: ApplyPluginsType.modify,
        initialValue: {},
    });
    return await appGetInitialState;
}

export function onRouterCreated({ router }) {
    router.beforeEach(async (to, from) => {
        let path;
        if (to.matched.length === 1) {
            path = to.matched[0].path;
        } else {
            path = to.path;
        }
        // 等待初始化数据
        await getInitialState();
        const canRoute = await access.hasAccess(path);
        return canRoute
    });
}