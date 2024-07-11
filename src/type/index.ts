/**
 * 分页
 * @param T  分页中的数据类型
 */
export interface Page<T> {
  /** 当前分页所在页码 */
  pageOn: number,
  /** 每页的数据条数 */
  pageSize: number,
  /** 总页数 */
  totalPage: number,
  /** 数据总条数 */
  totalSize: number,
  /** 分页中的数据 */
  datas: Array<T>
}

/**
 * User
 */
export interface User {
  username: string;
  created_at: Date;
  email: string;
  gender: string;
  name: string;
  password: string;
  phone: string;
  userId: number;
}

/**
 * Book
 */
export interface Book {
  id: number;
  title?: string;
  author?: string;
  category_id?: number;
  publisher?: string;
  quantity?: number;
  created_at?: Date;
}

/**
 * ApifoxModel
 */
export interface Borrow {
  book_id?: number;
  borrow_date?: Date;
  id: number;
  really_return_date?: Date;
  return_date?: Date;
  user_id?: number;
  [property: string]: any;
}