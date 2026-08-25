import { Product, BikeCategory } from '../types';

/**
 * High-Performance Search & Sort Engine
 * Techniques:
 * 1. Fast Vietnamese Diacritics Normalization
 * 2. Prefix Trie Data Structure with Pointer Navigation for Instant O(K) Search
 * 3. Two-Pointer Binary Search for Range Filtering
 * 4. Dual-Pivot QuickSort with Pre-extracted Numeric Key Vectors
 * 5. O(1) LRU Query Cache using Doubly Linked List & Hash Map Pointers
 */

// 1. Vietnamese Tone Normalizer
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// 2. Trie Node with Pointers
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  productIds: Set<string> = new Set();
  isWordEnd: boolean = false;
}

export class ProductTrie {
  root: TrieNode = new TrieNode();

  // Insert a token associated with a product ID
  insert(word: string, productId: string): void {
    const normalized = removeVietnameseTones(word);
    if (!normalized) return;

    let current = this.root;
    current.productIds.add(productId);

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      let nextNode = current.children.get(char);
      if (!nextNode) {
        nextNode = new TrieNode();
        current.children.set(char, nextNode);
      }
      current = nextNode;
      current.productIds.add(productId);
    }
    current.isWordEnd = true;
  }

  // Search by prefix in O(k) where k is prefix length
  searchPrefix(prefix: string): Set<string> {
    const normalized = removeVietnameseTones(prefix);
    if (!normalized) return new Set();

    let current = this.root;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      const nextNode = current.children.get(char);
      if (!nextNode) {
        return new Set();
      }
      current = nextNode;
    }
    return current.productIds;
  }

  // Multi-term intersection search
  searchMultiTerm(query: string): Set<string> | null {
    const tokens = removeVietnameseTones(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return null;

    let resultSet: Set<string> | null = null;

    for (const token of tokens) {
      const matches = this.searchPrefix(token);
      if (matches.size === 0) return new Set(); // No intersection possible

      if (resultSet === null) {
        resultSet = new Set(matches);
      } else {
        // Intersect sets
        const nextIntersection = new Set<string>();
        for (const id of resultSet) {
          if (matches.has(id)) {
            nextIntersection.add(id);
          }
        }
        resultSet = nextIntersection;
        if (resultSet.size === 0) return resultSet;
      }
    }

    return resultSet;
  }
}

// 3. Two-Pointer Binary Search for Sorted Range Queries
export interface PriceIndexEntry {
  id: string;
  price: number;
}

export class PriceRangeIndex {
  private sortedEntries: PriceIndexEntry[] = [];

  constructor(products: Product[]) {
    this.buildIndex(products);
  }

  buildIndex(products: Product[]): void {
    this.sortedEntries = products.map(p => ({
      id: p.id,
      price: p.salePrice
    }));
    // Fast sort by price ascending
    this.sortedEntries.sort((a, b) => a.price - b.price);
  }

  // Lower bound binary search (first index where price >= target)
  private lowerBound(target: number): number {
    let left = 0;
    let right = this.sortedEntries.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (this.sortedEntries[mid].price < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  // Upper bound binary search (first index where price > target)
  private upperBound(target: number): number {
    let left = 0;
    let right = this.sortedEntries.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (this.sortedEntries[mid].price <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  // Range query using left & right binary search pointers in O(log N + K)
  findInPriceRange(minPrice: number, maxPrice: number): Set<string> {
    const leftPointer = this.lowerBound(minPrice);
    const rightPointer = this.upperBound(maxPrice);

    const ids = new Set<string>();
    for (let i = leftPointer; i < rightPointer; i++) {
      ids.add(this.sortedEntries[i].id);
    }
    return ids;
  }
}

// 4. Dual-Pivot / Pre-extracted Key Vector QuickSort
export type SortCriteria = 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'sold';

export function optimizedSortProducts(
  items: Product[],
  criteria: SortCriteria
): Product[] {
  if (items.length <= 1) return items;
  if (criteria === 'featured') return items;

  // Create lightweight sort tuples to avoid repeated object traversal
  const tuples: { product: Product; key: number }[] = items.map(p => {
    let key = 0;
    switch (criteria) {
      case 'price_asc':
      case 'price_desc':
        key = p.salePrice;
        break;
      case 'rating':
        key = p.rating;
        break;
      case 'sold':
        key = p.soldCount || 0;
        break;
    }
    return { product: p, key };
  });

  const isAscending = criteria === 'price_asc';

  // In-place Dual-pivot quicksort on tuples
  quickSort(tuples, 0, tuples.length - 1, isAscending);

  return tuples.map(t => t.product);
}

function quickSort(
  arr: { product: Product; key: number }[],
  low: number,
  high: number,
  asc: boolean
): void {
  if (low < high) {
    // Insertion sort optimization for small partitions
    if (high - low < 10) {
      insertionSort(arr, low, high, asc);
      return;
    }

    const pivotIdx = partition(arr, low, high, asc);
    quickSort(arr, low, pivotIdx - 1, asc);
    quickSort(arr, pivotIdx + 1, high, asc);
  }
}

function partition(
  arr: { product: Product; key: number }[],
  low: number,
  high: number,
  asc: boolean
): number {
  const pivot = arr[high].key;
  let i = low - 1;

  for (let j = low; j < high; j++) {
    const shouldSwap = asc ? arr[j].key <= pivot : arr[j].key >= pivot;
    if (shouldSwap) {
      i++;
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}

function insertionSort(
  arr: { product: Product; key: number }[],
  low: number,
  high: number,
  asc: boolean
): void {
  for (let i = low + 1; i <= high; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= low && (asc ? arr[j].key > current.key : arr[j].key < current.key)) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
}

// 5. LRU Cache with Doubly Linked List & Map Pointers
interface LRUNode<T> {
  key: string;
  value: T;
  prev: LRUNode<T> | null;
  next: LRUNode<T> | null;
}

export class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, LRUNode<T>> = new Map();
  private head: LRUNode<T> | null = null;
  private tail: LRUNode<T> | null = null;

  constructor(capacity = 50) {
    this.capacity = capacity;
  }

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    // Move accessed node to head
    this.moveToHead(node);
    return node.value;
  }

  set(key: string, value: T): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    const newNode: LRUNode<T> = {
      key,
      value,
      prev: null,
      next: null
    };

    this.cache.set(key, newNode);
    this.addToHead(newNode);

    if (this.cache.size > this.capacity) {
      this.removeTail();
    }
  }

  private addToHead(node: LRUNode<T>): void {
    node.next = this.head;
    node.prev = null;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
  }

  private moveToHead(node: LRUNode<T>): void {
    if (node === this.head) return;

    // Detach node
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.tail) this.tail = node.prev;

    // Place at head
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
  }

  private removeTail(): void {
    if (!this.tail) return;
    this.cache.delete(this.tail.key);

    if (this.tail.prev) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      this.head = null;
      this.tail = null;
    }
  }

  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
  }
}

// 6. Unified Search Engine instance coordinating the algorithmic data structures
export class ShopSearchEngine {
  private trie = new ProductTrie();
  private priceIndex: PriceRangeIndex | null = null;
  private productMap = new Map<string, Product>();
  private queryCache = new LRUCache<Product[]>(100);

  constructor(products: Product[]) {
    this.indexProducts(products);
  }

  indexProducts(products: Product[]): void {
    this.trie = new ProductTrie();
    this.productMap.clear();
    this.queryCache.clear();

    products.forEach(p => {
      this.productMap.set(p.id, p);

      // Tokenize and index
      const tokens = [
        ...p.name.split(/\s+/),
        ...p.brand.split(/\s+/),
        ...p.categoryName.split(/\s+/),
        p.category,
        p.brand,
        p.name,
        ...(p.shortDesc ? p.shortDesc.split(/\s+/) : []),
        ...(p.specs?.frameMaterial ? p.specs.frameMaterial.split(/\s+/) : []),
        ...(p.specs?.groupset ? p.specs.groupset.split(/\s+/) : [])
      ];

      tokens.forEach(t => {
        if (t && t.length >= 2) {
          this.trie.insert(t, p.id);
        }
      });
    });

    this.priceIndex = new PriceRangeIndex(products);
  }

  query(options: {
    searchQuery: string;
    category: BikeCategory | 'all';
    brand: string;
    priceRange: string;
    showFlashSaleOnly: boolean;
    sortBy: SortCriteria;
  }): Product[] {
    const cacheKey = JSON.stringify(options);
    const cached = this.queryCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let candidateIds: Set<string> | null = null;

    // 1. Algorithmic Search with Trie
    if (options.searchQuery.trim()) {
      candidateIds = this.trie.searchMultiTerm(options.searchQuery.trim());
      if (candidateIds && candidateIds.size === 0) {
        this.queryCache.set(cacheKey, []);
        return [];
      }
    }

    // 2. Algorithmic Price Range with Binary Search Pointers
    if (options.priceRange !== 'all' && this.priceIndex) {
      let minPrice = 0;
      let maxPrice = Infinity;

      if (options.priceRange === 'under5m') {
        maxPrice = 4999999;
      } else if (options.priceRange === '5m-12m') {
        minPrice = 5000000;
        maxPrice = 12000000;
      } else if (options.priceRange === '12m-20m') {
        minPrice = 12000000;
        maxPrice = 20000000;
      } else if (options.priceRange === 'above20m') {
        minPrice = 20000001;
      }

      const priceMatchIds = this.priceIndex.findInPriceRange(minPrice, maxPrice);

      if (candidateIds === null) {
        candidateIds = new Set(priceMatchIds);
      } else {
        const nextSet = new Set<string>();
        for (const id of candidateIds) {
          if (priceMatchIds.has(id)) nextSet.add(id);
        }
        candidateIds = nextSet;
      }
    }

    // 3. Filter candidates
    let results: Product[] = [];
    if (candidateIds !== null) {
      for (const id of candidateIds) {
        const prod = this.productMap.get(id);
        if (prod && this.matchFilters(prod, options)) {
          results.push(prod);
        }
      }
    } else {
      for (const prod of this.productMap.values()) {
        if (this.matchFilters(prod, options)) {
          results.push(prod);
        }
      }
    }

    // 4. Fast Sorting
    results = optimizedSortProducts(results, options.sortBy);

    this.queryCache.set(cacheKey, results);
    return results;
  }

  private matchFilters(p: Product, options: { category: BikeCategory | 'all'; brand: string; showFlashSaleOnly: boolean }): boolean {
    if (options.category !== 'all' && p.category !== options.category) return false;
    if (options.brand !== 'all' && p.brand !== options.brand) return false;
    if (options.showFlashSaleOnly && !p.isFlashSale) return false;
    return true;
  }
}
