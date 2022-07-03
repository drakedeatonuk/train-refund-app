import { InjectionToken, Type } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { IXPlatWindow } from '../models';

/**
 * Various InjectionTokens shared across all platforms
 * Always suffix with 'Token' for clarity and consistency
 */

export const PlatformLanguageToken = new InjectionToken<string>('PlatformLanguageToken');
export const PlatformWindowToken = new InjectionToken<IXPlatWindow>('PlatformWindowToken');
