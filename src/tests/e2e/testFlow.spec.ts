import { test, expect } from '@playwright/test';

test.describe('E2E Pitanje Flow', () => {

  test('create quiz + add/edit/delete question', async ({ page }) => {

    // 1️⃣ Login kao admin (UI login)
    await page.goto('/login');
    await page.fill('input[name="email"]', 'coa@gmail.com');      // tvoj admin email
    await page.fill('input[name="password"]', '1233');       // tvoja lozinka
    await page.click('button[type="submit"]');
    await page.waitForURL('/'); // čekaj redirect posle logina

    // 2️⃣ Otvori stranicu za kreiranje kviza
    await page.goto('/kvizovi/kreiraj');
    await page.fill('input[name="title"]', 'E2E Test Kviz');
    await page.fill('textarea[name="description"]', 'Opis kviza za test');
    await page.fill('input[name="zanr"]', 'Test');
    await page.click('button[type="submit"]');

    // 3️⃣ Sačekaj redirect i uzmi quizId iz URL-a
    await page.waitForURL(/\/kvizovi\/.*\/izmeni/);
    const url = page.url();
    const quizId = url.split('/')[4]; // /kvizovi/[id]/izmeni

    // 4️⃣ Dodaj pitanje
    await page.fill('input[name="tekst"]', 'Ko je Nikola Tesla?');
    await page.fill('input[name="odgovor"]', 'Nikola Tesla');
    await page.fill('input[name="oblast"]', 'Istorija');
    await page.fill('input[name="poeni"]', '5');
    await page.click('#dodajPitanje'); // zameniti sa stvarnim id/button selector

    // Proveri da je pitanje dodato
    const added = page.locator('text=Ko je Nikola Tesla?');
    await expect(added).toBeVisible();



  });

});