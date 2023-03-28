const { chromium } = require('playwright');

async function searchGoogleForDomain(keyword, domain) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.google.com');

  await page.type('input[name="q"]', keyword);

  await Promise.all([
    page.keyboard.press('Enter'),
    page.waitForNavigation(),
  ]);

  let position = -1;
  let pageNum = 1;

  while (true) {
    const searchResults = await page.$$('#rso a h3');
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      const parent = await result.$('xpath=..');
      const href = await parent.getAttribute('href');
      if (href && href.includes(domain)) {
        position = (pageNum - 1) * 10 + i + 1;
        console.log(`The website ${domain} was found on position ${position} of page ${pageNum}`);
        await browser.close();
        return;
      }
    }

    const nextButton = await page.$('#pnnext');

    if (!nextButton) {
      console.log(`The website ${domain} was not found in the search results`);
      await browser.close();
      return;
    }

    const nextButtonIsDisabled = await nextButton.getAttribute('aria-disabled') === 'true';

    if (nextButtonIsDisabled) {
      console.log(`The website ${domain} was not found in the search results`);
      await browser.close();
      return;
    } else {
      pageNum++;
      const nextUrl = `https://www.google.com${await nextButton.getAttribute('href')}`;
      await page.goto(nextUrl);
      await page.waitForSelector('#search');
    }
  }
}

//searchGoogleForDomain('Купить слона', 'vk.com');

async function searchYandexForDomain(keyword, domain) {
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();
  
    await page.goto('https://ya.ru/');
  
    await page.type('input[id="text"]', keyword);
  
    await Promise.all([
      page.keyboard.press('Enter'),
      page.waitForNavigation(),
    ]);
  
    let position = -1;
    let pageNum = 1;
  
    while (true) {
      const searchResults = await page.$$('.organic .organic__url');
      console.log(searchResults.length);
      for (let i = 0; i < searchResults.length; i++) {
        const result = searchResults[i];
        const href = await result.getAttribute('href');
        console.log(href);
        if (href && href.includes(domain)) {
          position = (pageNum - 1) * 10 + i + 1;
          console.log(`The website ${domain} was found on position ${position} of page ${pageNum}`);
          await browser.close();
          return;
        }
      }
  
      const nextButton = await page.$('a.Pager-Item_type_next');
  
      if (!nextButton) {
        console.log(`The website ${domain} was not found in the search results`);
        await browser.close();
        return;
      }
  
      const nextButtonIsDisabled = await nextButton.getAttribute('aria-disabled') === 'true';
  
      if (nextButtonIsDisabled) {
        console.log(`The website ${domain} was not found in the search results`);
        await browser.close();
        return;
      } else {
        pageNum++;
        const nextUrl = `https://yandex.ru${await nextButton.getAttribute('href')}`;
        await page.goto(nextUrl);
        await page.waitForSelector('.main__content');
      }
    }
  }

  searchYandexForDomain('купить слона', 'vk.com');
