import { describe, expect, it } from 'vitest';
import { ShoppingCart, Tag } from 'lucide-react';
import { TAG_COLORS, TAG_ICON_GROUPS, getTagColor, getTagIcon } from './tag-appearance';

// Mirrors APPEARANCE_KEY_PATTERN and APPEARANCE_KEY_MAX_LENGTH in better-call-buffet's tags domain
const BACKEND_KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BACKEND_KEY_MAX_LENGTH = 50;

describe('tag appearance', () => {
  it('only uses keys the backend accepts', () => {
    const iconKeys = TAG_ICON_GROUPS.flatMap(group => Object.keys(group.icons));
    const keys = [...iconKeys, ...Object.keys(TAG_COLORS)];

    keys.forEach(key => {
      expect(key).toMatch(BACKEND_KEY_PATTERN);
      expect(key.length).toBeLessThanOrEqual(BACKEND_KEY_MAX_LENGTH);
    });
  });

  it('lists each icon once', () => {
    const iconKeys = TAG_ICON_GROUPS.flatMap(group => Object.keys(group.icons));

    expect(new Set(iconKeys).size).toBe(iconKeys.length);
  });

  it('resolves icons, falling back to the generic tag icon for unknown keys', () => {
    expect(getTagIcon(null)).toBeNull();
    expect(getTagIcon('shopping-cart')).toBe(ShoppingCart);
    expect(getTagIcon('removed-icon')).toBe(Tag);
  });

  it('resolves colors, returning null for missing or unknown keys', () => {
    expect(getTagColor(null)).toBeNull();
    expect(getTagColor('amber')).toBe(TAG_COLORS.amber);
    expect(getTagColor('removed-color')).toBeNull();
  });
});
