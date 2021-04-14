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
        icon: 'appstore',
        // key: '16',
      },
      {
        path: '/user_management',
        name: 'userManagement',
        icon: 'team',
        key: '16',
      },
      {
        path: '/book_management',
        name: 'bookManagement',
        icon: 'book',
        key: '17',
      },
      {
        path: '/coupon_management',
        name: 'couponManagement',
        icon: 'trophy',
        key: '18',
      },
      {
        path: '/order_management',
        name: 'orderManagement',
        icon: 'pushpin',
        key: '19',
      },
      {
        path: '/purchase_management',
        name: 'purchaseManagement',
        icon: 'wallet',
        key: '20',
      },
      // {
      //   path: '/recharge',
      //   "key": "21",
      //   name: 'history',
      //   icon: 'wallet',
      //   component: './Exception/404',
      // },
      {
        path: '/knowledge_base',
        name: 'knowledge',
        icon: 'profile',
        key: '6',
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'solution',
        key: '7',
      },
      {
        path: '/payment_setting',
        name: 'paymentSetting',
        icon: "file-search",
        key: '8',
      },
      {
        path: '/p_report',
        name: 'pReport',
        icon: "stock",
        key: '9',
        routes: [
          {
            path: '/p_report/earn',
            name: 'earn',
            key: '9-1',
          },
          {
            path: '/p_report/payout',
            name: 'payout',
            key: '9-2',
          }]
      },
      {
        path: '/material',
        name: 'afiliate',
        icon: 'bank',
        key: '10',
        routes: [
          {
            path: '/material/market',
            name: 'market',
            key: '10-1',
          },
          {
            path: '/material/my',
            name: 'my',
            key: '10-2',
          }]
      },
      {
        path: '/support',
        name: 'support',
        icon: 'diff',
        key: '11',
      },
      {
        path: '/op_user',
        name: 'opUser',
        icon: 'user',
        key: '12',
      },
      {
        path: '/promotional',
        name: 'promotional',
        icon: 'monitor',
        key: '13',
      },

      {
        path: '/payroll',
        name: 'payroll',
        icon: 'shop',
        key: '14',
      },
      {
        path: '/r_analytic',
        name: 'oReport',
        icon: 'fund',
        key: '15',
      },
      {
        path: '/feedback',
        name: 'feedback',
        icon: "question-circle",
        key: '4',
        routes: [
          {
            path: '/feedback/feedbackcategory',
            name: 'feedbackcategory',
            component: './Category/FeedbackCategory',
            key: '4-6',
          },
          {
            path: '/feedback/faq',
            name: 'faq',
            noMenu: true,
            component: './Feedback/Faq',
            key: '4-3',
          },
          {
            path: '/feedback/customer',
            name: 'customer',
            component: './Feedback/Customer',
            key: '4-1',
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
