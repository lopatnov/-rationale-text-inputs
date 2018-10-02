import { Directive, Input, OnInit, forwardRef, Renderer2,
  ElementRef, HostBinding, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const localFormat = (() => {
  const localNumber = (1234567.89).toLocaleString();
  const separatorIndex = localNumber.indexOf('89') - 1;
  if (separatorIndex !== -1) {
    const delimiters = localNumber.substr(0, separatorIndex).replace(/[\d]/g, '');
    return {
      separator: localNumber[separatorIndex],
      delimiter: delimiters[0]
    };
  }
  return {
    separator: '.',
    delimiter: ''
  };
})();

@Directive({
  selector: '[rationale-input-number]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RationaleInputNumberDirective),
    multi: true
  }]
})
export class RationaleInputNumberDirective implements OnInit, OnChanges, ControlValueAccessor {
  @HostBinding('attr.min') @Input() min: string;
  @HostBinding('attr.max') @Input() max: string;
  @HostBinding('attr.step')  @Input() step: string;
  @Input() isInt: boolean;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() separator: string;
  @Input() delimiter: string;

  private renderer: Renderer2;
  private elementRef: ElementRef;
  private touch: () => void;
  private change: (value: number) => void;

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    this.renderer = renderer;
    this.elementRef = elementRef;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ', changes);
  }

  ngOnInit() {
    this.separator = this.separator || localFormat.separator;
    if (!this.delimiter && this.delimiter !== '') {
      this.delimiter = localFormat.delimiter;
    }
    this.elementRef.nativeElement.value = this.formatValue(Number(this.elementRef.nativeElement.value));
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const target = event.currentTarget as HTMLInputElement;
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    } else if (event.key.length === 1 && !event.key.match(/[\d]/gi)) {
      event.preventDefault();
      if (event.key === '.' || event.key === this.separator) {
        this.onAddSeparator(target);
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    this.change(Number(target.value));
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.touch();
  }

  writeValue(value: any): void {
    this.elementRef.nativeElement.value = this.formatValue(Number(value));
  }

  registerOnChange(onChange: (value) => void): void {
    this.change = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.touch = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  private formatValue(value: number) {
    const parts = value.toString().split('.');
    let u = parts[0];
    let m = parts[1];
    if (u.length > 4) {
      for (let index = u.length - 3; index > 0; index -= 3) {
        u = u.substr(0, index) + this.delimiter + u.substr(index);
      }
    }
    if (m && m.length > 4) {
      for (let index = m.length - 3; index > 0; index -= 3) {
        m = m.substr(0, index) + this.delimiter + m.substr(index);
      }
    }
    return u + (m && m.length ? this.separator + m : '');
  }

  private onAddSeparator(target: HTMLInputElement) {
    if (!this.isInt) {
      const selectionStart = target.selectionStart;
      const selectionEnd = target.selectionEnd;
      const leftPart = target.value.substr(0, selectionStart);
      const rightPart = target.value.substr(selectionEnd);
      if ((leftPart + rightPart).indexOf(this.separator) === -1) {
        target.value = leftPart + this.separator + rightPart;
        target.selectionStart = selectionStart + 1;
        target.selectionEnd = target.selectionStart;
      }
    }
  }

}
