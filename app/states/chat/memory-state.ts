import { observable } from "@legendapp/state"
import type { MemoryReference } from "./types"

interface MemoryState {
  selectedMemory: MemoryReference | null
}

// Create the memory observable
export const memoryState$ = observable<MemoryState>({
  selectedMemory: null
})

// Actions for memory management
export const memoryActions = {
  /**
   * Set the selected memory for viewing details
   */
  selectMemory: (memory: MemoryReference) => {
    memoryState$.selectedMemory.set(memory)
  },

  /**
   * Clear the selected memory
   */
  clearMemory: () => {
    memoryState$.selectedMemory.set(null)
  }
} 