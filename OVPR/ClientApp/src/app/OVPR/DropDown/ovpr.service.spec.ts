import { TestBed } from '@angular/core/testing';

import { OVPRService } from './ovpr.service';

describe('OVPRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OVPRService = TestBed.get(OVPRService);
    expect(service).toBeTruthy();
  });
});
