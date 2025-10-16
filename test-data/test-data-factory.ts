// For SauceDemo we use known demo accounts instead of creating via API
export class TestDataFactory {
  static async createTeacher(): Promise<any> {
    return {
      id: 'local-teacher-' + Date.now(),
      username: process.env.ADMIN_USER || 'standard_user',
      password: process.env.ADMIN_PASSWORD || 'secret_sauce',
      firstName: 'Standard',
      lastName: 'User',
      roles: ['teacher']
    };
  }

  static async createStudent(): Promise<any> {
    // Use same demo account for student role in this mock setup
    return {
      id: 'local-student-' + Date.now(),
      username: 'standard_user',
      password: 'secret_sauce',
      firstName: 'Student',
      lastName: 'User',
      roles: ['student']
    };
  }

  static async cleanupUser(_userId: string): Promise<void> {
    // no-op for demo site
    return;
  }
}
