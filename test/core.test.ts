import { CharacterAI } from '@components/character/engine/ai';
import { collisionRegistry } from '@components/character/engine/collision/registry';
import { CharacterCombat } from '@components/character/engine/combat';
import { CharacterDeath } from '@components/character/engine/death';
import { CharacterModel } from '@components/character/engine/model';
import { CharacterProgression } from '@components/character/engine/progression';
import { CharacterRegistry } from '@components/character/engine/registry';
import { SpatialHash } from '@components/character/engine/spatial-hash';
import { CharacterSpeech } from '@components/character/engine/speech';
import { FlowerModel } from '@components/flower/model';
import { SeedRandom } from '@components/flower/seed';
import { FlowerStore } from '@components/flower/store';
import { ItemModel } from '@components/item/model';
import { ItemRegistry } from '@components/item/registry';
import { ItemSystem } from '@components/item/system';
import { leaderboardStore } from '@components/leaderboard/store';
import { AboutStore } from '@domain/about/about.store';
import { ContentEntity } from '@domain/about/content.entity';
import { translations } from '@domain/i18n/translations';
import {
  educationItems,
  experienceItems,
  professionalSkills,
  skills,
} from '@domain/profile/profile-content';
import { buttonVariants } from '@lib/button-variant';
import { secureRandom } from '@lib/random';
import { cn } from '@lib/utils';
import { profileAnimation, profileTransition } from '@motion/profile-motion';
import { HomeStore } from '@store/home';
import { LanguageStore, languageStore } from '@store/language-store';
import { ThemeStore, themeStore } from '@store/theme-store';
import { describe, expect, test } from 'bun:test';

function installBrowser(): { cleanup: () => void; triggerMedia: () => void } {
  const values = new Map<string, string>();
  const mediaListeners: Array<() => void> = [];
  const windowMock = {
    innerWidth: 1280,
    innerHeight: 720,
    scrollX: 12,
    scrollY: 24,
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    matchMedia: () => ({
      matches: false,
      addEventListener: (_event: string, listener: () => void) => mediaListeners.push(listener),
    }),
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: windowMock });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { languages: ['th'], language: 'th' },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      documentElement: { lang: 'en', classList: { add: () => undefined, remove: () => undefined } },
    },
  });
  return {
    triggerMedia: () => mediaListeners.forEach((listener) => listener()),
    cleanup: () => {
      delete (globalThis as { window?: unknown }).window;
      delete (globalThis as { navigator?: unknown }).navigator;
      delete (globalThis as { document?: unknown }).document;
    },
  };
}

describe('domain and utility models', () => {
  test('generates secure random values in the expected range', () => {
    const value = secureRandom();

    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  test('stores content and education data', () => {
    const content = new ContentEntity('/image.png', 'alt', 'text');
    const about = new AboutStore();

    expect(content).toEqual({ image: '/image.png', alt: 'alt', text: 'text' });
    expect(about.education).toHaveLength(3);
    expect(about.sectionVariant.visible).toEqual({ opacity: 1, y: 0 });
    expect(translations.th['nav.home']).toBeTruthy();
    expect(experienceItems.length).toBeGreaterThan(0);
    expect(educationItems.length).toBeGreaterThan(0);
    expect(skills).toContain('TypeScript');
    expect(professionalSkills.length).toBeGreaterThan(0);
    expect(buttonVariants({ variant: 'default' })).toContain('inline-flex');
    expect(profileAnimation).toHaveProperty('scale');
    expect(profileTransition).toHaveProperty('duration');
  });

  test('produces deterministic flower models', () => {
    const first = new FlowerStore(2, 42);
    const second = new FlowerStore(2, 42);
    const model = new FlowerModel(0, new SeedRandom(42));

    expect(first.flowers.map((flower) => flower.size)).toEqual(
      second.flowers.map((flower) => flower.size),
    );
    expect(model.layoutStyle.position).toBe('absolute');
    expect(model.motionStyle.opacity).toBeGreaterThan(0);
    expect(model.animate).toHaveProperty('rotate');
    expect(model.transition.repeat).toBe(Infinity);
  });

  test('merges utility class names', () => {
    expect(cn('px-2', undefined, 'px-4')).toBe('px-4');
  });
});

describe('character systems', () => {
  test('tracks characters and spatial queries', () => {
    const registry = new CharacterRegistry();
    const first = new CharacterModel();
    const second = new CharacterModel();
    first.x.set(10);
    first.y.set(10);
    second.x.set(20);
    second.y.set(20);
    registry.add(first);
    registry.add(second);

    const hash = new SpatialHash(32);
    hash.insert(first);
    hash.insert(second);

    expect(registry.count).toBe(2);
    expect(registry.alive).toHaveLength(2);
    expect(hash.query(10, 10)).toContain(first);
    hash.clear();
    expect(hash.query(10, 10)).toHaveLength(0);
    registry.remove(first);
    registry.clear();
    expect(registry.count).toBe(0);
  });

  test('updates progression, speech, and combat state', () => {
    const progression = new CharacterProgression();
    const attacker = new CharacterModel();
    const victim = new CharacterModel();
    attacker.isSpawning = false;
    victim.isSpawning = false;
    attacker.x.set(0);
    victim.x.set(1);
    attacker.vx = 8;
    victim.vx = -8;

    progression.gainExp(attacker, 120);
    progression.heal(attacker, 10);
    progression.onKill(attacker, victim);
    expect(attacker.level).toBeGreaterThan(1);

    const speech = new CharacterSpeech();
    speech.setSpeech('hello');
    speech.startTalking();
    speech.stopTalking();
    speech.dispose();
    expect(speech.speech).toBe('hello');

    const originalSetTimeout = globalThis.setTimeout;
    let scheduled = 0;
    globalThis.setTimeout = ((callback: () => void) => {
      scheduled++;
      if (scheduled === 1) callback();
      return 1 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
    const timedSpeech = new CharacterSpeech();
    timedSpeech.startTalking();
    timedSpeech.stopTalking();
    globalThis.setTimeout = originalSetTimeout;
    expect(timedSpeech.speech).not.toBe('');

    const combat = new CharacterCombat();
    combat.resolve(attacker, victim);
    expect(victim.hp).toBeLessThan(100);

    const ai = new CharacterAI(attacker);
    ai.flee(victim);
    ai.seekEnemy(victim);
    ai.wander();
    ai.update();
  });

  test('handles death and collision registry lifecycle', async () => {
    const death = new CharacterDeath();
    const character = new CharacterModel();
    const nearby = new CharacterModel();
    character.isSpawning = false;
    nearby.isSpawning = false;
    character.x.set(4);
    character.y.set(5);
    nearby.x.set(10);
    nearby.y.set(10);
    const characters = (await import('@components/character/engine/registry')).characterRegistry;
    characters.add(character);
    characters.add(nearby);
    death.trigger(character);
    expect(nearby.vx !== 0 || nearby.vy !== 0).toBe(true);
    expect(character.isDying).toBe(true);
    death.finalize(character);
    death.revive(character);
    expect(character.isAlive).toBe(true);
    characters.clear();

    collisionRegistry.spawn(1, 2);
    expect(collisionRegistry.effects).toHaveLength(1);
    const id = collisionRegistry.effects[0]?.id;
    if (id !== undefined) collisionRegistry.remove(id);
    collisionRegistry.activate(2, 1);
    expect(collisionRegistry.isActive(1, 2)).toBe(true);
    collisionRegistry.deactivate(1, 2);
    expect(collisionRegistry.isActive(1, 2)).toBe(false);
    expect(collisionRegistry.canSpawnEffect(1, 2)).toBe(true);
    expect(collisionRegistry.canSpawnEffect(1, 2)).toBe(false);
  });
});

describe('items and stores', () => {
  test('collects and removes items', () => {
    const registry = new ItemRegistry();
    const item = new ItemModel('heal', 10, 10);
    registry.items.push(item);

    expect(registry.tryPickup(10, 10, 5)).toBe(item);
    expect(item.collected).toBe(true);
    registry.removeCollected();
    expect(registry.items).toHaveLength(0);
    registry.start();
    registry.stop();
  });

  test('applies item buffs through the update system', async () => {
    const character = new CharacterModel();
    character.isSpawning = false;
    character.x.set(0);
    character.y.set(0);
    const registry = new ItemRegistry();
    registry.items.push(new ItemModel('heal', 0, 0));

    const originalItems = (await import('@components/item/registry')).itemRegistry.items;
    const characters = (await import('@components/character/engine/registry')).characterRegistry;
    characters.add(character);
    originalItems.push(...registry.items);
    const system = new ItemSystem();
    system.update();
    originalItems.length = 0;
    characters.clear();
    expect(character.hp).toBe(100);
  });

  test('supports home and language store state', () => {
    const home = new HomeStore();
    home.add();
    expect(home.count).toBe(2);
    home.removeById(2);
    expect(home.count).toBe(1);
    home.setAuto(0);
    home.dispose();

    languageStore.setLanguage('th');
    expect(languageStore.t('nav.home')).toBe(translations.th['nav.home']);
    languageStore.setLanguage('en');
    themeStore.init();
  });

  test('hydrates browser-backed stores', () => {
    const browser = installBrowser();
    const home = new HomeStore();
    home.hydrate();
    home.add();
    home.remove();

    const language = new LanguageStore();
    language.init();
    language.setLanguage('th');
    expect(language.hydrated).toBe(true);

    const theme = new ThemeStore();
    theme.init();
    theme.setMode('dark');
    theme.toggle();
    browser.triggerMedia();
    expect(theme.hydrated).toBe(true);
    browser.cleanup();
  });

  test('sorts leaderboard characters by level, hp, and exp', async () => {
    const { characterRegistry } = await import('@components/character/engine/registry');
    characterRegistry.clear();
    const low = new CharacterModel();
    const high = new CharacterModel();
    low.level = 1;
    high.level = 2;
    characterRegistry.add(low);
    characterRegistry.add(high);
    expect(leaderboardStore.ranking[0]).toBe(high);
    high.level = 1;
    high.hp = low.hp;
    high.exp = 20;
    low.exp = 10;
    expect(leaderboardStore.ranking[0]).toBe(high);
    characterRegistry.clear();
  });
});
