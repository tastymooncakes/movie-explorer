import { z } from 'zod';

export const MovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string(),
    poster_path: z.string().nullable(), 
    backdrop_path: z.string().nullable(),
    release_date: z.string(),
    vote_average: z.number(),
    vote_count: z.number(),
    genre_ids: z.array(z.number()),
    adult: z.boolean(),
    original_language: z.string(),
    original_title: z.string(),
    popularity: z.number(),
    video: z.boolean(),
});

export const MoviesResponseSchema = z.object({
    page: z.number(),
    results: z.array(MovieSchema),
    total_pages: z.number(),
    total_results: z.number(),
});

export const GenreSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const ProductionCompanySchema = z.object({
    id: z.number(),
    logo_path: z.string().nullable(),
    name: z.string(),
    origin_country: z.string(),
});

export const ProductionCountrySchema = z.object({
    iso_3166_1: z.string(),
    name: z.string(),
});

export const SpokenLanguageSchema = z.object({
    english_name: z.string(),
    iso_639_1: z.string(),
    name: z.string(),
});

// MovieDetails extends Movie but replaces genre_ids with genres array
export const MovieDetailsSchema = MovieSchema.omit({ genre_ids: true }).extend({
    runtime: z.number().nullable(),
    budget: z.number(),
    revenue: z.number(),
    homepage: z.string().nullable(),
    imdb_id: z.string().nullable(),
    status: z.string(),
    tagline: z.string().nullable(),
    genres: z.array(GenreSchema),
    production_companies: z.array(ProductionCompanySchema),
    production_countries: z.array(ProductionCountrySchema),
    spoken_languages: z.array(SpokenLanguageSchema),
});

export const CastMemberSchema = z.object({
    id: z.number(),
    name: z.string(),
    character: z.string(),
    profile_path: z.string().nullable(),
    order: z.number(),
});

export const CrewMemberSchema = z.object({
    id: z.number(),
    name: z.string(),
    job: z.string(),
    department: z.string(),
    profile_path: z.string().nullable(),
});

// Credits response doesn't have an id field
export const CreditsSchema = z.object({
    cast: z.array(CastMemberSchema),
    crew: z.array(CrewMemberSchema),
});

export const VideoSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    site: z.string(),
    type: z.string(),
    official: z.boolean(),
    published_at: z.string(),
});

// Videos response doesn't have an id field
export const VideosResponseSchema = z.object({
    results: z.array(VideoSchema),
});

export const ReviewAuthorDetailsSchema = z.object({
    name: z.string(),
    username: z.string(),
    avatar_path: z.string().nullable(),
    rating: z.number().nullable(),
});

export const ReviewSchema = z.object({
    id: z.string(),
    author: z.string(),
    author_details: ReviewAuthorDetailsSchema,
    content: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    url: z.string(),
});

// Reviews response doesn't have an id field
export const ReviewsResponseSchema = z.object({
    page: z.number(),
    results: z.array(ReviewSchema),
    total_pages: z.number(),
    total_results: z.number(),
});