import { TestBed } from '@angular/core/testing';

import { AdminRoleGuardService } from './admin-role-guard.service';

describe('AdminRoleGuardService', () => {
  let service: AdminRoleGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRoleGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
