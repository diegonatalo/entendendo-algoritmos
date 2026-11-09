import {
  HashSearchResult,
  HashResult,
  InsertionResult,
  HashTable,
} from "@/types/hash";

export function createTable(size: number): HashTable {
  return Array.from({ length: size }, () => []);
}

// função hash didática: soma dos códigos dos caracteres, módulo o tamanho
export function hashFunction(key: string, size: number): HashResult {
  let sum = 0;
  for (let i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i);
  }
  return { sum, index: sum % size };
}

export function insert(
  table: HashTable,
  key: string,
  value: string,
): InsertionResult {
  const { sum, index } = hashFunction(key, table.length);
  const bucket = table[index];
  const existing = bucket.findIndex((input) => input.key === key);
  const updated = existing !== -1;
  const collision = !updated && bucket.length > 0;

  const newBucket = updated
    ? bucket.map((input, i) => (i === existing ? { key, value } : input))
    : [...bucket, { key, value }];

  return {
    table: table.map((b, i) => (i === index ? newBucket : b)),
    index,
    sum,
    collision,
    updated,
  };
}

export function search(table: HashTable, key: string): HashSearchResult {
  const { sum, index } = hashFunction(key, table.length);
  let comparisons = 0;

  for (const input of table[index]) {
    comparisons++;
    if (input.key === key) {
      return { index, sum, comparisons, value: input.value };
    }
  }

  return { index, sum, comparisons };
}

export function resize(
  table: HashTable,
  newSize: number,
): HashTable {
  let next = createTable(newSize);
  for (const input of table.flat()) {
    next = insert(next, input.key, input.value).table;
  }
  return next;
}

export function loadFactor(table: HashTable): number {
  return table.flat().length / table.length;
}
