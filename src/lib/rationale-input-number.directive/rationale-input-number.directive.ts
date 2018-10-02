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
  return {};
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
  @HostBinding('attr.value') @Input() value: string;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() isInt: boolean;
  @Input() separator: string;
  @Input() delimiter: string;
  @Input() selectOnFocus: boolean;

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
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const target = event.currentTarget as HTMLInputElement;
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    } else if (event.key.length === 1 && !event.key.match(new RegExp(`[\\d${this.separator}]`, 'gi'))) {
      event.preventDefault();
      if (event.key === '.') {
        target.value += this.separator;
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
    console.log('writeValue: ', value);
    //this.value = Number(value).toString();
  }

  registerOnChange(onChange: (value) => void): void {
    this.change = onChange;
    if (this.value) {
      this.change(Number(this.value));
    }
  }

  registerOnTouched(onTouched: () => void): void {
    this.touch = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
