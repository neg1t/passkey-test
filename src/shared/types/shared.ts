export interface IResponse<T> {
  items: T
}

export interface IPaginatedResponse<T> extends IResponse<T> {
  totalItems: number
  itemsQuantity: number
  itemsOffset: number
}
