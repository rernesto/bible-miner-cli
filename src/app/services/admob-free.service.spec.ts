import { TestBed } from '@angular/core/testing';

import { AdmobFreeService } from './admob-free.service';

describe('AdmobFreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmobFreeService = TestBed.get(AdmobFreeService);
    expect(service).toBeTruthy();
  });
});
