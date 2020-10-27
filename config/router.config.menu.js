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
        path: '/operation',
        name: 'operation',
        icon: 'desktop',
        key: '1',
        routes: [
          {
            path: '/operation/user',
            name: 'user',
            key: '1-4',
            icon: 'user',
            routes: [
              {
                path: '/operation/user/list',
                name: 'list',
                component: './Operation/Users/Users',
                key: '1-4-1',
              },
              {
                path: '/operation/user/agora',
                name: 'agora',
                component: './Operation/Agora',
                key: '1-4-7',
              },
              {
                path: '/operation/user/virtualaccount',
                name: 'virtualaccount',
                component: './Operation/VirtualAccount/AccountList',
                key: '1-4-4',
              },
              {
                path: '/operation/user/va_reply',
                name: 'va_reply',
                component: './Operation/ApplyNew/Index.js',
                // component: './Operation/VirtualAccount/Reply.tsx',
                key: '1-4-5',
              },
              {
                path: '/operation/user/apply',
                name: 'apply',
                component: './Operation/Apply/ApplyList.tsx',
                key: '1-4-6',
              },
              {
                path: '/operation/user/audit',
                name: 'audit',
                component: './Operation/Audit/AuditList.tsx',
                key: '1-4-8',
              },
            ]
          },
          {
            path: '/operation/gift',
            name: 'gift',
            key: '1-5',
            icon: 'gift',
            routes: [
              {
                path: '/operation/gift/list',
                name: 'list',
                component: './Operation/Gift/GiftList',
                key: '1-5-1',
              },
              {
                path: '/operation/gift/category',
                name: 'category',
                component: './Operation/Gift/CategoryList',
                key: '1-5-2',
              },
            ],
          },
          {
            path: '/operation/videoscene',
            name: 'video',
            key: '1-11',
            icon: 'video-camera',
            routes: [
              {
                path: '/operation/videoscene/tools',
                name: 'tools',
                component: './Operation/Scene/ToolList',
                key: '1-11-1',
              },
              {
                path: '/operation/videoscene/category',
                name: 'category',
                component: './Operation/Scene/CategoryList',
                key: '1-11-2',
              },
            ]
          },
          {
            path: '/operation/meme',
            name: 'meme',
            key: '1-12',
            icon: 'smile',
            routes: [
              {
                path: '/operation/meme/tools',
                name: 'tools',
                component: './Operation/Meme/ToolList',
                key: '1-12-1',
              },
              {
                path: '/operation/meme/category',
                name: 'category',
                component: './Operation/Meme/CategoryList',
                key: '1-12-2',
              },
              {
                path: '/operation/meme/subcate',
                name: 'subcate',
                component: './Operation/Meme/SubCateList',
                key: '1-12-3',
              },
            ]
          },
          {
            path: '/operation/assistant',
            name: 'assistant',
            key: '1-13',
            icon: 'robot',
            routes: [
              {
                path: '/operation/assistant/messagepush',
                name: 'messagepush',
                component: './Operation/messagePush/index',
                key: '1-13-1',
              },
              {
                path: '/operation/assistant/messageFaq',
                name: 'messageFaq',
                component: './Operation/messageFaq/index',
                key: '1-13-2',
              },
              {
                path: '/operation/assistant/messagetemplate',
                name: 'messagetemplate',
                component: './Operation/messageTemplate/TemplateList.tsx',
                key: '1-13-3',
              },
            ]
          },
          {
            path: '/operation/material',
            name: 'material',
            key: '1-1',
            icon: 'file-image',
            routes: [
              {
                path: '/operation/material/image',
                name: 'image',
                component: './Operation/Image',
                key: '1-1-1',
              },
              {
                path: '/operation/material/imagegroup',
                name: 'imagegroup',
                component: './Operation/ImageGroup',
                key: '1-1-2',
              },
              {
                path: '/operation/material/activity',
                name: 'activity',
                component: './Supply/Activity',
                key: '1-1-3',
              },
            ]
          },
          {
            path: '/operation/advertisement',
            name: 'advertisement',
            key: '1-14',
            component: './Operation/Advertisement/List',
          },
          {
            path: '/operation/voiceTag',
            name: 'voiceTag',
            key: '1-15',
            component: './Operation/VoiceTag/Activity',
          },
          {
            path: '/operation/host',
            name: 'host',
            key: '1-6',
            icon: 'audio',
            routes: [
              {
                path: '/operation/host/manage',
                name: 'manage',
                component: './Operation/Host/index.tsx',
                key: '1-6-1',
              },
              {
                path: '/operation/host/mcn',
                name: 'mcn',
                component: './Operation/Host/Mcn',
                key: '1-6-2',
              },
              {
                path: '/operation/host/mcnpay',
                name: 'mcnpay',
                component: './Operation/Host/McnPay',
                key: '1-6-3',
              },
            ]
          },
        ],
      },
      {
        path: '/order',
        name: 'order',
        key: '5',
        icon: 'snippets',
        routes: [
          {
            path: '/order/log',
            name: 'log',
            component: './Operation/Log/Activity',
            key: '5-4',
          },
          {
            path: '/order/giftOrder',
            name: 'giftOrder',
            component: './Order/GiftOrder/index',
            key: '5-5',
          },
          {
            path: '/order/member',
            name: 'member',
            component: './Order/Member/MemberOrders',
            key: '5-1',
          },
          {
            path: '/order/diamond',
            name: 'diamond',
            component: './Order/Diamond/DiamondOrders',
            key: '5-2',
          },
          {
            path: '/order/withdraw',
            name: 'withdraw',
            component: './Order/Withdraw/WithdrawOrders.tsx',
            key: '5-3',
          },
        ]
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
