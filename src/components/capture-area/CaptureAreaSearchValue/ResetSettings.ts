import { Matching } from '@/proc/regex/Regex';
import { Slicing } from '@/proc/regex/Regex';
import { Similarity } from '@/proc/regex/Regex';

export interface ResetSettings {
    matchingOption: Matching;
    slicingOption: Slicing;
    similarityOption: Similarity;
    numberOfMatches: number;
}