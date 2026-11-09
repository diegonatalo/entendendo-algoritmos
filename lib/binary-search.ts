import { Step, SearchResult } from "@/types/search";

export function binarySearch(arr: number[], target: number): SearchResult {
  let start = 0;
  let end = arr.length - 1;
  let attempts = 0;

  // pior caso: cada tentativa descarta pelo menos metade, então são ⌊log₂ n⌋ + 1 tentativas
  const maxAttempts = arr.length > 0 ? Math.floor(Math.log2(arr.length)) + 1 : 0;
  const steps: Step[] = [];

  while (start <= end) {
    attempts++;

    const middle = Math.floor((start + end) / 2);

    const currentArray = arr.slice(start, end + 1);

    steps.push({
      attempt: attempts,
      currentArray,
      middle,
      middleValue: arr[middle],
    });

    if (arr[middle] === target) {
      return {
        index: middle,
        attempts,
        maxAttempts,
        steps,
      };
    }
    if (arr[middle] < target) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return { index: -1, attempts, maxAttempts, steps };
}
