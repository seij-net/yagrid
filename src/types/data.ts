export type Direction = "asc" | "desc"
export type DataQuery<T> = {
  /**
   * List of sort orders (column name + direction)
   */
  sortedBy: {column:string, direction: Direction}[],
  /** Nb items per page */
  size: number,
  /** Currently displayed page number */
  page: number
}
export type DataFetcher<T> = (query: DataQuery<T>)=>PromiseLike<T[]>
export type GridDataSource<T> = T[] | DataFetcher<T>