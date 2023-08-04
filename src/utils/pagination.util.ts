import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../common/pagination-constants";

export const paginationHelper = (page: number | undefined, pageSize: number | undefined) => {
    const pageNumber = page || DEFAULT_PAGE;
    const pageLimit = pageSize || DEFAULT_PAGE_SIZE;
    return {
        limit: pageLimit,
        offset: (pageNumber - 1) * pageLimit
    }
}

export default paginationHelper;