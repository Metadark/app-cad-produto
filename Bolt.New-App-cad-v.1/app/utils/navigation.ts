import { Frame } from '@nativescript/core';

export function navigate(page: string, options: any = {}) {
  Frame.topmost().navigate({
    moduleName: page,
    ...options
  });
}