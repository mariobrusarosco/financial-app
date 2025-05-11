/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'

const router = createRouter()

// Ensure the DOM is ready before hydrating
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    hydrateRoot(
      rootElement,
      <StartClient router={router} />
    )
  } else {
    console.error("Target 'root' element not found for hydration.")
  }
}