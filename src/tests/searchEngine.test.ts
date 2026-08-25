import { describe, it, expect, beforeEach } from 'vitest';
import { 
  removeVietnameseTones, 
  ProductTrie, 
  PriceRangeIndex, 
  optimizedSortProducts, 
  LRUCache, 
  ShopSearchEngine 
} from '../utils/searchEngine';
import { INITIAL_PRODUCTS } from '../services/seedData';
import { Product } from '../types';

describe('High-Performance Search & Sort Algorithm Suite', () => {
  // 1. Vietnamese Diacritics Normalizer
  describe('1. Vietnamese Diacritics Normalizer', () => {
    it('should strip all diacritics and convert đ/Đ to d', () => {
      expect(removeVietnameseTones('Xe Đạp Địa Hình Giant')).toBe('xe dap dia hinh giant');
      expect(removeVietnameseTones('ĐƯỜNG TRƯỜNG PHƯỢT ĐỒI')).toBe('duong truong phuot doi');
      expect(removeVietnameseTones('Thước ngắm Cảo Đĩa LíP')).toBe('thuoc ngam cao dia lip');
    });

    it('should handle empty or whitespace-only strings gracefully', () => {
      expect(removeVietnameseTones('')).toBe('');
      expect(removeVietnameseTones('   ')).toBe('');
    });
  });

  // 2. Prefix Trie Data Structure with Pointer Navigation
  describe('2. Prefix Trie Data Structure', () => {
    let trie: ProductTrie;

    beforeEach(() => {
      trie = new ProductTrie();
      trie.insert('Giant', 'prod-1');
      trie.insert('Escape', 'prod-1');
      trie.insert('Trek', 'prod-2');
      trie.insert('Domane', 'prod-2');
      trie.insert('Twitter', 'prod-3');
      trie.insert('Sniper', 'prod-3');
    });

    it('should retrieve matching product IDs by exact prefix in O(k)', () => {
      const matchG = trie.searchPrefix('gia');
      expect(matchG.has('prod-1')).toBe(true);
      expect(matchG.has('prod-2')).toBe(false);

      const matchT = trie.searchPrefix('t');
      expect(matchT.has('prod-2')).toBe(true);
      expect(matchT.has('prod-3')).toBe(true);
    });

    it('should perform multi-term intersection search accurately', () => {
      const intersect = trie.searchMultiTerm('giant escape');
      expect(intersect).not.toBeNull();
      expect(intersect!.has('prod-1')).toBe(true);
      expect(intersect!.size).toBe(1);

      const noMatch = trie.searchMultiTerm('giant domane');
      expect(noMatch).not.toBeNull();
      expect(noMatch!.size).toBe(0);
    });
  });

  // 3. Two-Pointer Binary Search for Sorted Range Queries
  describe('3. Two-Pointer Binary Search (PriceRangeIndex)', () => {
    let priceIndex: PriceRangeIndex;

    beforeEach(() => {
      priceIndex = new PriceRangeIndex(INITIAL_PRODUCTS);
    });

    it('should locate products within exact price boundary pointers in O(log N)', () => {
      // Under 5,000,000đ
      const under5m = priceIndex.findInPriceRange(0, 4999999);
      expect(under5m.size).toBeGreaterThan(0);
      for (const id of under5m) {
        const prod = INITIAL_PRODUCTS.find(p => p.id === id);
        expect(prod?.salePrice).toBeLessThan(5000000);
      }

      // 5,000,000đ to 12,000,000đ
      const mid = priceIndex.findInPriceRange(5000000, 12000000);
      expect(mid.size).toBeGreaterThan(0);
      for (const id of mid) {
        const prod = INITIAL_PRODUCTS.find(p => p.id === id);
        expect(prod?.salePrice).toBeGreaterThanOrEqual(5000000);
        expect(prod?.salePrice).toBeLessThanOrEqual(12000000);
      }
    });
  });

  // 4. Dual-Pivot QuickSort with Pre-extracted Numeric Key Vectors
  describe('4. Dual-Pivot QuickSort Engine', () => {
    it('should sort products by price ascending', () => {
      const sorted = optimizedSortProducts(INITIAL_PRODUCTS, 'price_asc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].salePrice).toBeLessThanOrEqual(sorted[i + 1].salePrice);
      }
    });

    it('should sort products by price descending', () => {
      const sorted = optimizedSortProducts(INITIAL_PRODUCTS, 'price_desc');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].salePrice).toBeGreaterThanOrEqual(sorted[i + 1].salePrice);
      }
    });

    it('should sort products by rating descending', () => {
      const sorted = optimizedSortProducts(INITIAL_PRODUCTS, 'rating');
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i + 1].rating);
      }
    });
  });

  // 5. O(1) LRU Query Cache using Doubly Linked List & Hash Map Pointers
  describe('5. LRU Cache with Pointers', () => {
    it('should set, get and evict least recently used entries in O(1)', () => {
      const lru = new LRUCache<string>(3);
      lru.set('q1', 'result1');
      lru.set('q2', 'result2');
      lru.set('q3', 'result3');

      expect(lru.get('q1')).toBe('result1'); // q1 becomes most recently used

      // Add q4, which should evict q2 (since q1 was accessed, q2 was LRU)
      lru.set('q4', 'result4');

      expect(lru.get('q1')).toBe('result1');
      expect(lru.get('q2')).toBeUndefined();
      expect(lru.get('q3')).toBe('result3');
      expect(lru.get('q4')).toBe('result4');
    });
  });

  // 6. Unified ShopSearchEngine Integration Test
  describe('6. Unified ShopSearchEngine Integration', () => {
    let engine: ShopSearchEngine;

    beforeEach(() => {
      engine = new ShopSearchEngine(INITIAL_PRODUCTS);
    });

    it('should perform fast fuzzy diacritic-free queries and cache query results', () => {
      const res = engine.query({
        searchQuery: 'giant',
        category: 'all',
        brand: 'all',
        priceRange: 'all',
        showFlashSaleOnly: false,
        sortBy: 'featured'
      });

      expect(res.length).toBeGreaterThan(0);
      expect(res.every(p => p.brand === 'Giant' || p.name.includes('Giant'))).toBe(true);

      // Repeat query -> retrieved from LRU cache
      const cachedRes = engine.query({
        searchQuery: 'giant',
        category: 'all',
        brand: 'all',
        priceRange: 'all',
        showFlashSaleOnly: false,
        sortBy: 'featured'
      });
      expect(cachedRes).toBe(res);
    });
  });
});
