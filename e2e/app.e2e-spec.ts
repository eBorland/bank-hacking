import { BankHackingPage } from './app.po';

describe('bank-hacking App', () => {
  let page: BankHackingPage;

  beforeEach(() => {
    page = new BankHackingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
