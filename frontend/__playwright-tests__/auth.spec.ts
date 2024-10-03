import { test, expect } from '@playwright/test';

test('Basic auth', async ({ page, browser }) => {
    await test.step('should login', async () => {
        await page.goto('http://localhost:3000/');
    })
})