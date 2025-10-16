import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld {
  page: any;
  testUser: any;
  createdUser: any;
  authToken: string | null = null;
}

setWorldConstructor(CustomWorld);
