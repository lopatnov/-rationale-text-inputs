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

function defaultFormatterInt(value: string, delimiter: string): string {
  if (value && value.length > 4) {
    for (let index = value.length - 3; index > 0; index -= 3) {
      value = value.substr(0, index) + delimiter + value.substr(index);
    }
  }
  return value;
}

export function defaultFormatter(value: number, component: RationaleInputNumberDirective): string {
  if (Number.isFinite(value)) {
    const parts = value.toString().split('.');
    const u = defaultFormatterInt(parts[0], component.delimiter);
    const m = !component.isInt && defaultFormatterInt(parts[1], component.delimiter);
    return (component.prefix || '') + u + (m && m.length ? component.separator + m : '') + (component.suffix || '');
  }
  return '#';
}

export function defaultParser(value: string, component: RationaleInputNumberDirective): number {
  if (!value) {
    return 0;
  }
  return Number.parseFloat(value.replace(component.separator, '.').replace(/[^\d.]/g, ''));
}

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
  @Input() parse: (value: string, component: RationaleInputNumberDirective) => number;
  @Input() format: (value: number, component: RationaleInputNumberDirective) => string;

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
    this.format = this.format || defaultFormatter;
    this.parse = this.parse || defaultParser;
    this.refresh();
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
    const offsetCharacters = this.getCharacterOffset(target);
    const value = this.parse(target.value, this);
    this.change(value);
    this.elementRef.nativeElement.value = this.format(value, this);
    offsetCharacters();
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.touch();
  }

  writeValue(value: any): void {
    this.refresh(String(value));
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

  public refresh(value?: string) {
    const offsetCharacters = this.getCharacterOffset(this.elementRef.nativeElement);
    this.elementRef.nativeElement.value = this.format(this.parse(value || this.elementRef.nativeElement.value, this), this);
    offsetCharacters();
  }

  private getCharacterOffset(target: HTMLInputElement) {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const originalLength = target.value.length;
    return () => {
      const diff = target.value.length - originalLength;
      target.selectionStart = start + diff;
      target.selectionEnd = end + diff;
    };
  }

}
