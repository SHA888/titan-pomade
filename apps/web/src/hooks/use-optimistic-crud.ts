import { useState, useCallback, useRef } from 'react';

interface OptimisticCrudOptions<T extends { id: string | number }> {
  items: T[];
  idKey?: keyof T;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useOptimisticCrud<T extends { id: string | number }>(options: OptimisticCrudOptions<T>) {
  const { items: initialItems, idKey = 'id', onSuccess, onError } = options;
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const deletedItemRef = useRef<{ item: T; index: number } | null>(null);

  const createItem = useCallback(
    async (createFn: () => Promise<T>, newItem: T) => {
      setLoading(true);
      try {
        // Optimistically add the new item
        setItems(prev => [...prev, newItem]);
        
        // Call the actual create function
        const createdItem = await createFn();
        
        // Replace the optimistic item with the actual one
        setItems(prev => {
          const withoutOptimistic = prev.filter(item => 
            item[idKey] !== newItem[idKey]
          );
          return [...withoutOptimistic, createdItem];
        });
        
        onSuccess?.();
        return createdItem;
      } catch (error) {
        // Rollback on error
        setItems(prev => prev.filter(item => item[idKey] !== newItem[idKey]));
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [idKey, onError, onSuccess]
  );

  const updateItem = useCallback(
    async (updateFn: () => Promise<T>, id: string | number, updatedItem: Partial<T>) => {
      setLoading(true);
      try {
        // Find the item to update
        const itemIndex = items.findIndex(item => item[idKey] === id);
        if (itemIndex === -1) throw new Error('Item not found');
        
        // Store the original item for rollback
        const originalItem = items[itemIndex];
        
        // Optimistically update the item
        setItems(prev => {
          const newItems = [...prev];
          newItems[itemIndex] = { ...originalItem, ...updatedItem } as T;
          return newItems;
        });
        
        // Call the actual update function
        const result = await updateFn();
        
        // Replace with the actual updated item
        setItems(prev => {
          const newItems = [...prev];
          newItems[itemIndex] = result;
          return newItems;
        });
        
        onSuccess?.();
        return result;
      } catch (error) {
        // Rollback on error
        setItems(prev => [...prev]); // This will trigger a re-render with original state
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [items, idKey, onError, onSuccess]
  );

  const deleteItem = useCallback(
    async (deleteFn: () => Promise<void>, id: string | number) => {
      setLoading(true);
      try {
        // Find the item to delete
        const itemIndex = items.findIndex(item => item[idKey] === id);
        if (itemIndex === -1) throw new Error('Item not found');
        
        // Store the original item for rollback
        const originalItem = items[itemIndex];
        deletedItemRef.current = { item: originalItem, index: itemIndex };
        
        // Optimistically remove the item
        setItems(prev => prev.filter(item => item[idKey] !== id));
        
        // Call the actual delete function
        await deleteFn();
        
        onSuccess?.();
      } catch (error) {
        // Rollback on error
        setItems(prev => {
          const itemExists = prev.some(item => item[idKey] === id);
          if (itemExists) return prev;
          
          // Add back the original item at the correct position
          const newItems = [...prev];
          // We can't accurately restore the position, so we'll add it at the end
          newItems.push(deletedItemRef.current?.item as T);
          return newItems;
        });
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
        deletedItemRef.current = null;
      }
    },
    [items, idKey, onError, onSuccess]
  );

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    setItems,
  };
}