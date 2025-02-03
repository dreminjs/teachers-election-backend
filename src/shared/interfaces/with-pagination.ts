


export interface IWithPagination<T> {
    items: T[]
    currentPage: number
    count: number
}