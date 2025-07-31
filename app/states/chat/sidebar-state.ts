import { observable } from "@legendapp/state"
import type { SidebarView } from "./types"

interface SidebarState {
  isOpen: boolean
  view: SidebarView
}

// Create the sidebar observable
export const sidebarState$ = observable<SidebarState>({
  isOpen: false,
  view: "chat-history"
})

// Actions for sidebar management
export const sidebarActions = {
  /**
   * Toggle sidebar open/close state
   * When manually opening, always default to chat history view
   */
  toggle: () => {
    const isCurrentlyOpen = sidebarState$.isOpen.get()
    sidebarState$.isOpen.set(!isCurrentlyOpen)
    
    // When manually opening sidebar, always default to chat history
    if (!isCurrentlyOpen) {
      sidebarState$.view.set("chat-history")
    }
  },

  /**
   * Open sidebar and switch to memory detail view
   */
  showMemoryDetail: () => {
    sidebarState$.isOpen.set(true)
    sidebarState$.view.set("memory-detail")
  },

  /**
   * Switch back to chat history view
   */
  showChatHistory: () => {
    sidebarState$.view.set("chat-history")
  },

  /**
   * Close sidebar
   */
  close: () => {
    sidebarState$.isOpen.set(false)
  },

  /**
   * Open sidebar (will show chat history by default)
   */
  open: () => {
    sidebarState$.isOpen.set(true)
    sidebarState$.view.set("chat-history")
  }
} 