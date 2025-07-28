import type { Movie } from "./movie";

export interface WatchListItem extends Movie {
    dateAdded: string;
}

export type SortOption = 'dateAdded' | 'title' | 'releaseDate' | 'rating';

export type SortDirection = 'asc' | 'desc'