import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

try {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
} catch (e) {
  // Ignore if already initialized
}

import { beforeEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
});
