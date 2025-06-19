import { DetailedFeatureData } from './types';
import { coreFeaturesData } from './core-features';

// Placeholder data for sections that don't have detailed data yet
const placeholderData: Record<string, DetailedFeatureData> = {};

// Map of all feature data organized by section and feature
const featureDataMap: Record<string, Record<string, DetailedFeatureData>> = {
  'getting-started': placeholderData,
  'core-features': coreFeaturesData,
  'advanced-features': placeholderData,
  'integrations': placeholderData,
};

/**
 * Get detailed feature data for a specific section and feature
 * @param sectionId - The section ID (e.g., 'core-features')
 * @param featureTitle - The feature title (e.g., 'Dashboard & Analytics')
 * @returns DetailedFeatureData or null if not found
 */
export function getDetailedFeatureData(sectionId: string, featureTitle: string): DetailedFeatureData | null {
  const sectionData = featureDataMap[sectionId];
  if (!sectionData) {
    return null;
  }

  // Try to find by exact title match first
  if (sectionData[featureTitle]) {
    return sectionData[featureTitle];
  }

  // Try to find by slugified title
  const slugifiedTitle = featureTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  for (const [title, data] of Object.entries(sectionData)) {
    const titleSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (titleSlug === slugifiedTitle) {
      return data;
    }
  }

  return null;
}

/**
 * Get all features for a specific section
 * @param sectionId - The section ID
 * @returns Array of feature titles or empty array if section not found
 */
export function getFeaturesForSection(sectionId: string): string[] {
  const sectionData = featureDataMap[sectionId];
  return sectionData ? Object.keys(sectionData) : [];
}

/**
 * Get all available sections
 * @returns Array of section IDs
 */
export function getAvailableSections(): string[] {
  return Object.keys(featureDataMap);
}

export type { DetailedFeatureData }; 