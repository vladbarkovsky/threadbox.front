import type { PaginatedQuery } from '../paginated-query';

export interface GetThreadListQuery extends PaginatedQuery {
	boardId: string;
	searchText: string;
}
