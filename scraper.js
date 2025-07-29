const puppeteer = require('puppeteer');

async function fetchStarlinkData(email, password) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://account.starlink.com/');

    // Login
    await page.type('input[name="email"]', email);
    await page.click('button[type="submit"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Espera a que cargue la tabla de suscripciones
    await page.waitForSelector('h2'); // puedes cambiar esto por un selector más específico

    // Extrae la información
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.slice(1).map(row => {
        const cols = row.querySelectorAll('td');
        return {
          nombre: cols[0]?.innerText.trim(),
          ubicacion: cols[1]?.innerText.trim(),
          estado: cols[2]?.innerText.trim()
        };
      });
    });

    await browser.close();
    return data;

  } catch (err) {
    await browser.close();
    throw err;
  }
}

module.exports = fetchStarlinkData;
