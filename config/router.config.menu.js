export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'message',
        component: './Feedback/Customer',
      },
      {
        path: '/knowledge_base',
        name: 'knowledge',
        icon: 'message',
        component: './Feedback/Customer',
        key: '6',
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'message',
        component: './Feedback/Customer',
        key: '7',
      },
      {
        path: '/payment_setting',
        name: 'paymentSetting',
        icon: 'message',
        component: './Feedback/Customer',
        key: '8',
      },
      {
        path: '/p_report',
        name: 'pReport',
        icon: 'message',
        key: '9',
        routes: [
          {
            path: '/p_report/earn',
            name: 'earn',
            component: './Feedback/Customer',
            key: '9-1',
          },
          {
            path: '/p_report/payout',
            name: 'payout',
            component: './Feedback/Customer',
            key: '9-2',
          }]
      },
      {
        path: '/afiliate',
        name: 'afiliate',
        icon: 'message',
        component: './Feedback/Customer',
        key: '10',
      },
      {
        path: '/support',
        name: 'support',
        icon: 'message',
        component: './Feedback/Customer',
        key: '11',
      },
      {
        path: '/op_user',
        name: 'opUser',
        icon: 'message',
        component: './Feedback/Customer',
        key: '12',
      },
      {
        path: '/promotional',
        name: 'promotional',
        icon: 'message',
        component: './Feedback/Customer',
        key: '13',
      },

      {
        path: '/payroll',
        name: 'payroll',
        icon: 'message',
        component: './Feedback/Customer',
        key: '14',
      },
      {
        path: '/r_analytic',
        name: 'oReport',
        icon: 'message',
        component: './Feedback/Customer',
        key: '15',
      },
      {
        path: '/feedback',
        name: 'feedback',
        icon: 'message',
        key: '4',
        routes: [
          {
            path: '/feedback/feedbackcategory',
            name: 'feedbackcategory',
            component: './Category/FeedbackCategory',
            key: '4-6',
          },
          {
            path: '/feedback/customer',
            name: 'customer',
            component: './Feedback/Customer',
            key: '4-1',
          },
          {
            path: '/feedback/faq',
            name: 'faq',
            noMenu: true,
            component: './Feedback/Faq',
            key: '4-3',
          },
        ],
      },
      {
        path: '/system',
        name: 'system',
        icon: 'lock',
        key: '2',
        routes: [
          {
            path: '/system/permission',
            name: 'permission',
            component: './System/Permission',
            key: '2-1',
          },
          {
            path: '/system/role',
            name: 'role',
            component: './System/Role',
            key: '2-2',
          },
          {
            path: '/system/role/add',
            name: 'roleadd',
            component: './System/RoleAdd',
          },
          {
            path: '/system/role/edit/:id',
            name: 'roleedit',
            component: './System/RoleEdit',
          },
          {
            path: '/system/setting',
            name: 'setting',
            component: './System/Setting',
            key: '2-4',
          },
          {
            path: '/system/versions',
            name: 'versions',
            component: './System/Versions',
            key: '2-3',
          },
          {
            path: '/system/webversion',
            name: 'webversion',
            component: './System/WebVersion',
            key: '2-5',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
