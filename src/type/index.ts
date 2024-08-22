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


export interface InventoryPage {
  endRow?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  list?: BookInventory[];
  navigateFirstPage?: number;
  navigateLastPage?: number;
  navigatepageNums?: number[];
  navigatePages?: number;
  nextPage?: number;
  pageNum?: number;
  pages?: number;
  pageSize?: number;
  prePage?: number;
  size?: number;
  startRow?: number;
  total?: number;
  [property: string]: any;
}


export interface BookInventory {
  author?: string;
  bookTitle?: string;
  categoryId?: number;
  inventoryId?: number;
  publisher?: string;
  quantity?: number;
  [property: string]: any;
}

/**
 * User
 */
export interface User {
  username: string;
  created_at?: Date;
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
  bookId: number;
  inventoryId: number;
  isBorrowed: boolean;
  isDiscarded: boolean;
  [property: string]: any;
}


/**
 * Borrow
 */
export interface Borrow {
  actualReturnDate?: Date;
  bookId?: number;
  borrowdate?: Date;
  oughtReturnDate?: Date;
  recordId: number;
  userId?: number;
  [property: string]: any;
}

/**
 * Permission
 */
export interface Permission {
  maxBorrowBooks: number;
  maxBorrowDay: number;
  permissionDesc: string;
  permissionName: string;
  [property: string]: any;
}

export interface Category {
  categoryId: number;
  name?: string;
  [property: string]: any;
}
