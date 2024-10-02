const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3005;
let browser;

const getCdi = async () => {
    const cdiPage = await browser.newPage();
    await cdiPage.goto('https://investidor10.com.br/indices/cdi/');

    const cdiValueElement = await cdiPage.$('#header_action > div > div.name-ticker > h2');
    const cdiValue = await cdiValueElement.evaluate(el => el.textContent);

    await cdiPage.close();
    return cdiValue.split(".")[0];
};

const getInter = async () => {
    const interPage = await browser.newPage();
    await interPage.goto('https://yubb.com.br/investimentos/renda-fixa/banco-inter-106-cdi-cdb-361-dias-100-minimo?principal=5000&months=12');
    await interPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36');

    try {
        await interPage.waitForSelector('body > div.Site__wrapper > div > div > section.bg-gray-100.pt-4.pb-5 > div > div > div.col-12.col-lg-5.mt-5.mt-lg-0.ml-auto > div.investmentComparisons > div:nth-child(3) > h5', { timeout: 50000 });

        const interValueElement = await interPage.$('body > div.Site__wrapper > div > div > section.bg-gray-100.pt-4.pb-5 > div > div > div.col-12.col-lg-5.mt-5.mt-lg-0.ml-auto > div.investmentComparisons > div:nth-child(3) > h5');

        if (interValueElement) {
            const interValue = (await interValueElement.evaluate(el => el.textContent)).split("Banco Inter ")[1].replace(" ", " do ");
            await interPage.close();
            return interValue;
        } else {
            throw new Error('Inter value element not found on the page');
        }
    } catch (error) {
        await interPage.close();
        return "sem dados"
    }
};

const getC6 = async () => {
    const c6Page = await browser.newPage();
    await c6Page.goto('https://www.idinheiro.com.br/contas/digital/quanto-seu-dinheiro-rende-no-c6-bank/');
    await c6Page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36');

    try {
        await c6Page.waitForSelector('#post-1665798 > div > figure:nth-child(19) > table > tbody > tr:nth-child(2) > td:nth-child(2)', { timeout: 50000 });

        const c6ValueElement = await c6Page.$('#post-1665798 > div > figure:nth-child(19) > table > tbody > tr:nth-child(2) > td:nth-child(2)');

        if (c6ValueElement) {
            const c6Value = (await c6ValueElement.evaluate(el => el.textContent)).replace(" ", " do ");
            await c6Page.close();
            return c6Value;
        } else {
            throw new Error('c6 value element not found on the page');
        }
    } catch (error) {
        return "sem dados"
    }
};

const getPicPay = async () => {
    const picpPayPage = await browser.newPage();
    await picpPayPage.goto('https://www.idinheiro.com.br/contas/digital/picpay-ou-nubank/');
    await picpPayPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36');

    try {
        await picpPayPage.waitForSelector('#compact-table-item1 > td.idh-block-compact-table__column--right > ul > li:nth-child(1)', { timeout: 50000 });

        const picpPayValueElement = await picpPayPage.$('#compact-table-item1 > td.idh-block-compact-table__column--right > ul > li:nth-child(1)');

        if (picpPayValueElement) {
            const picpPayValue = (await picpPayValueElement.evaluate(el => el.textContent)).split("Rende ")[1];
            await picpPayPage.close();
            return picpPayValue;
        } else {
            throw new Error('picpPay value element not found on the page');
        }
    } catch (error) {
        return "sem dados"
    }
};

const getNubank = async () => {
    const nubankPage = await browser.newPage()
    await nubankPage.goto('https://canaltech.com.br/negocios/nubank-como-e-o-cashback-com-rendimento-de-200-do-cdi-no-cartao-ultravioleta-205319/');
    await nubankPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36');

    try {
        await nubankPage.waitForSelector('#content-news > h2:nth-child(10)', { timeout: 50000 });

        const nubankValueElement = await nubankPage.$('#content-news > h2:nth-child(10)');

        if (nubankValueElement) {
            const nubankValue = (await nubankValueElement.evaluate(el => el.textContent)).split('Qualquer dinheiro na conta Nubank rende ')[1].replace("?", "");
            await nubankPage.close();
            return nubankValue;
        } else {
            throw new Error('nubank value element not found on the page');
        }
    } catch (error) {
        return "sem dados"
    }
}

app.get('/', async (req, res) => {
    browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox'],
    });

    const cdi = await getCdi();
    const inter = await getInter();
    const nubank = await getNubank();
    const c6 = await getC6();
    const picPay = await getPicPay();

    await browser.close();

    return res.json({ cdi, inter, c6, picPay, nubank, "feito por": "João Paulo Dias - vulgo jp e melhor joão do 2° D.S" });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
