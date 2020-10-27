/*
 * @Author: senla.liu
 * @Date: 2020-01-17 14:30:50
 * @LastEditors  : senla.liu
 * @LastEditTime : 2020-01-17 14:53:39
 * @FilePath: \\xchat-web/src/pages/Operation/Users/services/interface.ts
 */
// tslint:disable-next-line:class-name
// tslint:disable-next-line:interface-name
export interface UserType {
 user_id: string;
 type: number,
}

// tslint:disable-next-line:interface-name
export interface Money {
 user_id: string;
 coin_operate?: number,
 coin?: number,
 diamond_operate?: number
 diamond?: number,
}


// tslint:disable-next-line:interface-name
export interface UserList {
 page: number;
 page_size: number,
 user_id?: string,
 nick_id?: string,
 username?: string,
 sex?: number,
 create_at_begin?:string,
 create_at_end?:string,
}