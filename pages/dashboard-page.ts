import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  private readonly selectors = {
    welcomeMessage: '.title',
    userProfile: '.product_label, .inventory_item_name',
    logoutButton: '#logout_sidebar_link'
  };

  constructor(page: Page) {
    super(page);
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.page.isVisible(this.selectors.welcomeMessage);
  }

  async getUserProfileName(): Promise<string> {
    return await this.getText(this.selectors.userProfile);
  }

  async isDashboardDisplayed(): Promise<boolean> {
    return await this.page.isVisible(this.selectors.welcomeMessage);
  }
}
