export default [
  {path: '/', name: '主页', icon: 'home', component: './index'},
  {path: '/interfaceInfo/:id', name: '查看接口', icon: 'smile', component: './interfaceInfo', hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './user/login'}],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{name: '接口管理', path: '/admin/interfaceInfo', component: './admin/interfaceInfo'}],
  },
  {component: '404', layout: false, path: './*'},
];
