import { TestBed } from '@angular/core/testing';

import { LiveStreamingServiceService } from './live-streaming-service.service';

describe('LiveStreamingServiceService', () => {
  let service: LiveStreamingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveStreamingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
