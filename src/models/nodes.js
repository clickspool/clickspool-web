import { getNodeConfig } from '@/services/role';

import {nodeList} from '../../config/nodeList';
export default {
  namespace: 'nodeList',

  state: {
    data: [],
    branch: {},
  },

  reducers: {
    getBranch(state, { payload }) {
      return {
        ...state,
        branch: payload,
      };
    },
    getList(state) {
      return {
        ...state,
        data: nodeList.data,
      };
    },
  },
};
