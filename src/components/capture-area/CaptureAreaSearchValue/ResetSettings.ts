import { Matching, Similarity, Slicing } from '@/proc/regex/Regex';

/**
 * Reset settings for regex text fields
 */
export interface ResetSettings {
    matchingOption: Matching;
    slicingOption: Slicing;
    similarityOption: Similarity;
    numberOfMatches: number;
}

/**
 * Default settings for value regex
 */
export const defaultValueRegexSettings: ResetSettings = {
    matchingOption: Matching.EXACT,
    slicingOption: Slicing.SUBSTR,
    similarityOption: Similarity.NONE,
    numberOfMatches: 10000,
};

/**
 * Default settings for before constraints
 */
export const defaultBeforeConstraintsSettings: ResetSettings = {
    matchingOption: Matching.APPROX,
    slicingOption: Slicing.SUBSTR,
    similarityOption: Similarity.NONE,
    numberOfMatches: 10000,
};

/**
 * Default settings for after constraints
 */
export const defaultAfterConstraintsSettings: ResetSettings = {
    matchingOption: Matching.APPROX,
    slicingOption: Slicing.SUBSTR,
    similarityOption: Similarity.NONE,
    numberOfMatches: 10000,
};
