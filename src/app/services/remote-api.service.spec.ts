import { TestBed } from '@angular/core/testing';

import { RemoteApiService } from './remote-api.service';

describe('RemoteApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteApiService = TestBed.get(RemoteApiService);
    expect(service).toBeTruthy();
  });
});
