export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{ path: '/admin', redirect: '/admin/sub-page' }],
  },
  {
    name: '查询表格',
    icon: 'table',
    path: '/list',
    component: './interface-info',
  },
  { path: '/', redirect: '/list' },
  { component: '404', layout: false, path: './*' },
];
