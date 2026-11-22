import { expect, test } from '@playwright/test';

test('follows a topic into an article and its table of contents', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Garden Wiki', level: 1 })).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  await expect(nav.locator('.nav-brand .wiki-wordmark')).toHaveAttribute('style', /gwiki\.svg/);
  await expect(nav.getByRole('link', { name: 'Linux', exact: true })).toHaveAttribute('href', '/linux/');
  await expect(nav.getByRole('link', { name: 'Networking', exact: true })).toHaveAttribute('href', '/networking/');
  await expect(nav.getByRole('link', { name: 'Segurança', exact: true })).toHaveAttribute('href', '/security/');
  await expect(nav.getByRole('link', { name: 'Blockchain', exact: true })).toHaveAttribute('href', '/blockchain/');
  await expect(nav.getByRole('link', { name: 'Música', exact: true })).toHaveAttribute('href', '/music/');
  await expect(nav.getByRole('link', { name: 'Contato', exact: true })).toHaveAttribute('href', 'https://guisso.dev');
  await expect(nav.getByRole('link', { name: 'GitHub', exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: /Networking/ }).filter({ hasText: /nota/ }).click();
  await page.getByRole('navigation', { name: 'Nesta seção' }).getByRole('link', { name: 'ZeroTier' }).click();

  await expect(page.getByRole('heading', { name: 'ZeroTier', level: 1 })).toBeVisible();
  await page.getByText('Nesta página', { exact: true }).click();
  const target = page.getByRole('navigation', { name: 'Nesta página' }).getByRole('link', { name: 'Resumo' });
  await target.click();
  await expect(page).toHaveURL(/\/networking\/zerotier\/#resumo$/);
  await expect(page.getByRole('img', { name: 'Diagrama das camadas VL1 e VL2 do ZeroTier' })).toBeVisible();
});

test('finds a note by title without accents and opens it with the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog');
  const input = search.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('migracao paperless');
  await expect(search.getByRole('link', { name: /Migração Paperless-ngx/ })).toBeVisible();
  await input.press('Enter');
  await expect(page).toHaveURL(/\/linux\/debian\/proxmox\/paperless-migration\/$/);
  await page.locator('summary[aria-label="PT, selecionar idioma"]').click();
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/linux\/debian\/proxmox\/paperless-migration\/$/);
  await expect(page.getByRole('heading', { name: 'Paperless-ngx Migration', level: 1 })).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link', { name: 'Linux', exact: true })).toHaveAttribute('href', '/en/linux/');
  await expect(nav.getByRole('link', { name: 'Networking', exact: true })).toHaveCount(0);
});

test('opens the mobile dock and remembers the color theme', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 750 });
  await page.goto('/music/bateria/');
  await expect(page.locator('.wiki-document .prose')).toHaveCount(0);
  const directory = page.getByRole('navigation', { name: 'Nesta seção' });
  await expect(directory.getByRole('heading', { name: 'Subseções' })).toBeVisible();
  await expect(directory.getByRole('heading', { name: 'Notas' })).toBeVisible();
  const sidebar = page.locator('.section-rail');
  const navigation = sidebar.getByRole('navigation', { name: 'Navegação da seção' });
  await expect(navigation).toBeHidden();
  await sidebar.locator('summary').click();
  await expect(navigation.getByRole('link', { name: 'Música' })).toBeVisible();

  const launch = page.getByRole('button', { name: 'Abrir menu de navegação' });
  await expect(launch).toBeVisible();
  await expect(launch.locator('.wiki-wordmark')).toHaveAttribute('style', /gwiki\.svg/);
  await launch.click();
  await expect(page.locator('[data-nav-launch]')).toHaveAttribute('aria-expanded', 'true');
  const controls = page.locator('.site-nav > :is(.nav-brand, .nav-link, .nav-close), .site-nav > details > summary');
  const visibleControls = controls.filter({ visible: true });
  await expect(visibleControls).toHaveCount(6);
  const rows = await visibleControls.evaluateAll((items) =>
    new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size
  );
  expect(rows).toBe(1);

  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  const music = nav.getByRole('link', { name: 'Música', exact: true });
  await expect(music).toBeHidden();
  await nav.locator('summary[aria-label=Assuntos]').click();
  await expect(music).toBeVisible();
  await expect(music).toHaveAttribute('href', '/music/');
  await expect(nav.getByRole('link', { name: 'Contato' })).toBeVisible();
  await nav.locator('summary[aria-label=Tema]').click();
  const themes = nav.getByRole('group', { name: 'Tema' });
  await expect(themes.getByRole('button')).toHaveCount(4);
  await expect(themes.getByRole('link')).toHaveCount(0);
  await expect(music).toBeHidden();
  await themes.getByRole('button', { name: 'Areia' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'areia');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'areia');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('lists all sibling pages in deep section navigation', async ({ page }) => {
  await page.route('https://guisso.dev/**', (route) => route.abort());
  await page.goto('/music/bateria/aulas-de-bateria-com-grillo/like-a-stone-grillo/');
  const rail = page.getByRole('navigation', { name: 'Navegação da seção' });
  await expect(rail.getByRole('listitem')).toHaveCount(7);
  await expect(rail.getByRole('link', { name: 'Like a Stone', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(rail.getByRole('link', { name: 'Linux', exact: true })).toHaveCount(0);

  await expect(rail.getByRole('link', { name: 'Dino Fonseca - Stand By Me' })).toBeVisible();
  await expect(rail.getByRole('link', { name: 'Abrir seção' })).toHaveCount(0);
  await rail.getByRole('link', { name: 'Aulas de bateria com Grillo', exact: true }).click();
  const directory = page.getByRole('navigation', { name: 'Nesta seção' });
  await expect(directory.getByRole('heading', { name: 'Notas' })).toBeVisible();
  await expect(directory.getByRole('listitem')).toHaveCount(7);
});

test('preserves an old URL and keeps drafts out of the published wiki', async ({ page, request }) => {
  await page.route('https://guisso.dev/**', (route) => route.abort());
  await page.goto('/music/base-viradas/voltando-base/');
  await expect(page).toHaveURL(/\/music\/bateria\/base-viradas\/voltando-base\/$/);
  await expect(page.getByRole('heading', { name: 'Estudos de Bateria: Voltando ao Básico', level: 1 })).toBeVisible();
  const draft = await request.get('/music/bateria/scar-tissue-grillo/');
  expect(draft.status()).toBe(404);
  const body = await (await request.get('/search.json')).text();
  expect(body).not.toContain('scar-tissue-grillo');
});
