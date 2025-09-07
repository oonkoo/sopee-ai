// lib/config/modelDisplay.ts

interface ModelDisplayConfig {
  showActualModelNames: boolean
  customModelNames: Record<string, string>
}

// Configuration for model name display
const MODEL_DISPLAY_CONFIG: ModelDisplayConfig = {
  // Set to true to show actual model names, false to show custom names
  showActualModelNames: false,
  
  // Mapping of actual model names to user-friendly names
  customModelNames: {
    'gemini-1.5-flash': 'sopee-1.5-light',
    'gemini-1.5-pro': 'sopee-1.5-pro',
    'gpt-4': 'sopee-4.0',
    'gpt-3.5-turbo': 'sopee-3.5-turbo',
    // Add more mappings as needed
  }
}

/**
 * Get the display name for a model based on current configuration
 * @param actualModelName - The actual model name from the database
 * @param isAdmin - Whether the current user is an admin (for future use)
 * @returns The model name to display to the user
 */
export function getModelDisplayName(actualModelName: string, isAdmin: boolean = false): string {
  // Future admin logic - always show actual name for admins
  if (isAdmin) {
    const customName = MODEL_DISPLAY_CONFIG.customModelNames[actualModelName]
    return customName ? `${actualModelName} (${customName})` : actualModelName
  }
  
  // For regular users, check configuration
  if (MODEL_DISPLAY_CONFIG.showActualModelNames) {
    return actualModelName
  }
  
  // Return custom name if available, otherwise return actual name
  return MODEL_DISPLAY_CONFIG.customModelNames[actualModelName] || actualModelName
}

/**
 * Update the model display configuration
 * @param config - Partial configuration to update
 */
export function updateModelDisplayConfig(config: Partial<ModelDisplayConfig>): void {
  Object.assign(MODEL_DISPLAY_CONFIG, config)
}

/**
 * Get the current model display configuration
 */
export function getModelDisplayConfig(): ModelDisplayConfig {
  return { ...MODEL_DISPLAY_CONFIG }
}

/**
 * Add or update a custom model name mapping
 * @param actualName - The actual model name
 * @param customName - The custom display name
 */
export function setCustomModelName(actualName: string, customName: string): void {
  MODEL_DISPLAY_CONFIG.customModelNames[actualName] = customName
}

/**
 * Remove a custom model name mapping
 * @param actualName - The actual model name to remove mapping for
 */
export function removeCustomModelName(actualName: string): void {
  delete MODEL_DISPLAY_CONFIG.customModelNames[actualName]
}