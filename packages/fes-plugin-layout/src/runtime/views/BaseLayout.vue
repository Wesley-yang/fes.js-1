<template>
    <a-layout
        v-if="routeHasLayout"
        :class="[
            collapsed ? 'main-layout-collapsed' : '',
            `main-layout-navigation-${navigation}`
        ]"
        class="main-layout"
    >
        <template v-if="navigation !== 'top'">
            <div v-if="fixedSideBar" class="layout-sider-fixed-stuff"></div>
            <a-layout-sider
                v-model:collapsed="collapsed"
                :width="sideWidth"
                :class="[
                    'layout-sider',
                    fixedSideBar ? 'layout-sider-fixed' : ''
                ]"
                :theme="siderTheme"
                collapsible
            >
                <div v-if="navigation !== 'mixin'" class="layout-logo">
                    <img :src="logo" class="logo-img" />
                    <h1 class="logo-name">{{title}}</h1>
                </div>
                <Menu :menus="menus" :theme="siderTheme" />
            </a-layout-sider>
        </template>
        <a-layout class="child-layout">
            <a-layout-header v-if="currentFixedHeader" class="layout-header">
            </a-layout-header>
            <a-layout-header
                :class="[currentFixedHeader ? 'layout-header-fixed' : '']"
                class="layout-header"
            >
                <div v-if="navigation === 'mixin'" class="layout-logo">
                    <img :src="logo" class="logo-img" />
                    <h1 class="logo-name">{{title}}</h1>
                </div>
                <template v-if="navigation === 'top'">
                    <div class="layout-logo">
                        <img :src="logo" class="logo-img" />
                        <h1 class="logo-name">{{title}}</h1>
                    </div>
                    <Menu :menus="menus" :theme="theme" class="layout-menu" mode="horizontal" />
                </template>
                <div class="layout-header-custom">
                    <slot name="customHeader"></slot>
                </div>
                <template v-if="locale">
                    <slot name="locale"></slot>
                </template>
            </a-layout-header>
            <a-layout-content class="layout-content">
                <MultiTabProvider v-if="multiTabs" />
                <router-view v-else></router-view>
            </a-layout-content>
            <a-layout-footer class="layout-footer">
                Fes.js ©2020 Created by MumbleFe
            </a-layout-footer>
        </a-layout>
    </a-layout>
    <div v-else class="layout-content">
        <MultiTabProvider v-if="multiTabs" />
        <router-view v-else></router-view>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from '@@/core/coreExports';
import Layout from 'ant-design-vue/lib/layout';
import 'ant-design-vue/lib/layout/style';
import Menu from './Menu';
import MultiTabProvider from './MultiTabProvider';

export default {
    components: {
        [Layout.name]: Layout,
        [Layout.Sider.name]: Layout.Sider,
        [Layout.Content.name]: Layout.Content,
        [Layout.Header.name]: Layout.Header,
        [Layout.Footer.name]: Layout.Footer,
        Menu,
        MultiTabProvider
    },
    props: {
        menus: {
            type: Array,
            default() {
                return [];
            }
        },
        title: {
            type: String,
            default: ''
        },
        locale: {
            type: Boolean,
            default: false
        },
        logo: {
            type: String,
            default: ''
        },
        theme: {
            type: String,
            default: 'dark' // light、dark
        },
        navigation: {
            type: String,
            default: 'side' // side 左右（上/下）、 top 上/下、 mixin 上/下（左/右）
        },
        fixedHeader: {
            type: Boolean,
            default: false
        },
        fixedSideBar: {
            type: Boolean,
            default: true
        },
        multiTabs: {
            type: Boolean,
            default: false
        },
        sideWidth: {
            type: Number,
            default: 200
        }
    },
    setup(props) {
        const route = useRoute();
        const routeHasLayout = computed(() => {
            const _routeLayout = route.meta.layout;
            return _routeLayout === undefined ? true : _routeLayout;
        });
        const siderTheme = computed(() => {
            if (props.navigation === 'mixin') {
                return 'light';
            }
            return props.theme;
        });
        const currentFixedHeader = computed(() => props.fixedHeader || props.navigation === 'mixin');
        return {
            siderTheme,
            currentFixedHeader,
            route,
            routeHasLayout,
            collapsed: ref(false)
        };
    }
};
</script>

<style lang="less" vars="{ sideWidth: sideWidth +'px' }">
.main-layout {
    min-height: 100vh;
    &.main-layout-collapsed {
        .layout-sider {
            .layout-logo {
                justify-content: center;
                .logo-name {
                    display: none;
                }
            }
        }
        .layout-sider-fixed-stuff {
            overflow: hidden;
            width: 80px;
        }
    }
    &.main-layout-navigation-top {
        .layout-header {
            padding-left: 24px;
            color: hsla(0,0%,100%,.65);
            background: #001529;
            .layout-menu {
                line-height: 48px;
            }
            .layout-logo {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                min-width: 165px;
                height: 100%;
                overflow: hidden;
                transition: all .3s;
                .logo-img {
                    height: 32px;
                    width: auto;
                }
                .logo-name {
                    overflow: hidden;
                    margin: 0 0 0 12px;
                    color: #fff;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 32px;
                }
            }
            &.layout-header-fixed {
                left: 0;
                width: 100%;
            }
        }
    }
    &.main-layout-navigation-mixin {
        .layout-sider {
            padding: 48px 0 0;
            box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
            .ant-layout-sider-trigger {
                border-top: 1px solid #f0f0f0;
            }
        }
        .layout-header {
            padding-left: 24px;
            color: hsla(0,0%,100%,.65);
            background: #001529;
            .layout-menu {
                line-height: 48px;
            }
            .layout-logo {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                min-width: 165px;
                height: 100%;
                overflow: hidden;
                transition: all .3s;
                .logo-img {
                    height: 32px;
                    width: auto;
                }
                .logo-name {
                    overflow: hidden;
                    margin: 0 0 0 12px;
                    color: #fff;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 32px;
                }
            }
            &.layout-header-fixed {
                left: 0;
                width: 100%;
            }
        }
    }
    .layout-sider-fixed-stuff {
        overflow: hidden;
        width: var(--sideWidth);
        transition: width 0.2s;
        flex-shrink: 0;
    }
    .child-layout {
        position: relative;
    }
    .layout-sider {
        &.layout-sider-fixed {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 200px;
        }
        .layout-logo {
            height: 32px;
            margin: 16px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .logo-img {
                height: 32px;
                width: auto;
            }
            .logo-name {
                overflow: hidden;
                margin: 0 0 0 12px;
                color: #fff;
                font-weight: 600;
                font-size: 18px;
                line-height: 32px;
            }
        }
    }
    .layout-header {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        height: 48px;
        line-height: 48px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        padding: 0;
        .layout-header-custom {
            flex: 1;
        }
        &.layout-header-fixed {
            position: fixed;
            top: 0;
            left: var(--sideWidth);
            right: 0;
            z-index: 10;
            width: calc(100% - var(--sideWidth));
        }
    }
    .layout-content {
        position: relative;
    }
    .layout-footer {
        text-align: center;
    }
}
</style>