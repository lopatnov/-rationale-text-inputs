import { TestBed } from '@angular/core/testing';

import { TextInputsService } from './text-inputs.service';

describe('TextInputsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextInputsService = TestBed.get(TextInputsService);
    expect(service).toBeTruthy();
  });
});
