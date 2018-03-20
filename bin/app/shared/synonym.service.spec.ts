/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SynonymService } from './synonym.service';

describe('SynonymService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SynonymService]
    });
  });

  it('should ...', inject([SynonymService], (service: SynonymService) => {
    expect(service).toBeTruthy();
  }));
});
