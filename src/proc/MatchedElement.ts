/**
 * Interface for matched elements
 */
export interface MatchedElement {
    rating: number;
    match: {
        index: number;
        element: string;
    };
    timestamp?: string;
}
