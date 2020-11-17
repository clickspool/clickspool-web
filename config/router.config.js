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
      { path: '/', redirect: "/welcome" },
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'table',
        component: './Exception/404',
      },
      {
        path: '/knowledge_base',
        name: 'knowledge',
        icon: 'message',
        component: './Exception/404',
        key: '6',
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'message',
        component: './System/Profile',
        key: '7',
      },
      {
        path: '/payment_setting',
        name: 'paymentSetting',
        icon: 'message',
        component: './System/PaymentSetting',
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
            component: './Exception/404',
            key: '9-1',
          },
          {
            path: '/p_report/payout',
            name: 'payout',
            component: './Exception/404',
            key: '9-2',
          }]
      },
      {
        path: '/material',
        name: 'afiliate',
        icon: 'message',
        // component: './Material/index',
        key: '10',
        routes: [
          {
            path: '/material/market',
            component: './Material/Market',
            key: '10-1',
          },
          {
            path: '/material/my',
            component: './Material/My',
            key: '10-2',
          }]
      },
      {
        path: '/support',
        name: 'support',
        icon: 'message',
        component: './Exception/404',
        key: '11',
      },
      {
        path: '/op_user',
        name: 'opUser',
        icon: 'message',
        component: './System/Users',
        key: '12',
      },
      {
        path: '/promotional',
        name: 'promotional',
        icon: 'message',
        component: './Material/index',
        key: '13',
      },

      {
        path: '/payroll',
        name: 'payroll',
        icon: 'message',
        component: './Exception/404',
        key: '14',
      },
      {
        path: '/r_analytic',
        name: 'oReport',
        icon: 'message',
        component: './Exception/404',
        key: '15',
      },

      {
        path: '/feedback',
        name: 'feedback',
        icon: 'message',
        key: '4',
        routes: [
          {
            path: '/feedback/customer',
            name: 'customer',
            component: './Feedback/Customer',
            key: '4-1',
          },
          {
            path: '/feedback/customer/detail/:id',
            name: 'customer',
            component: './Feedback/CustomerDetail',
            key: '4-2',
          },
          {
            path: '/feedback/faq',
            name: 'feedback',
            component: './Feedback/Faq',
            key: '4-3',
          },
          {
            path: '/feedback/faq/add',
            name: 'feedback',
            component: './Feedback/FaqAdd',
            key: '4-4',
          },
          {
            path: '/feedback/faq/edit/:id',
            name: 'feedback',
            component: './Feedback/FaqEdit',
            key: '4-5',
          },
          {
            path: '/feedback/feedbackcategory',
            name: 'feedbackcategory',
            component: './Category/FeedbackCategory',
            key: '4-6',
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
            // key: '2-1-1',
          },
          {
            path: '/system/role/edit/:id',
            name: 'roleedit',
            component: './System/RoleEdit',
            // key: '2-1-2',
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
            key: '2-3'
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
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
