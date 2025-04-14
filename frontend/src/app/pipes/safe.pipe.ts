import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeStyle, SafeScript, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
  pure: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: string = 'html'): SafeHtml | SafeResourceUrl | SafeUrl | SafeStyle | SafeScript {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      default:
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
} 