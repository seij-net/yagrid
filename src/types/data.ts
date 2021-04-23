export type DataQuery<T> = {}
export type DataFetcher<T> = (query: DataQuery<T>)=>PromiseLike<T>
export type GridDataSource<T> = T[] | DataFetcher<T>