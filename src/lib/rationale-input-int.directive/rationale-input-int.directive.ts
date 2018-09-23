import { Directive, Renderer2, ElementRef, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[rationale-input-int]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RationaleInputIntDirective),
    multi: true
  }]
})
export class RationaleInputIntDirective implements ControlValueAccessor, OnInit {
  private renderer: Renderer2;
  private elementRef: ElementRef;
  private touch: () => void;
  private change: (value: number) => void;
  @Input() default: number;

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    this.renderer = renderer;
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.default = this.default || 0;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    } else if (event.key.length <= 1 && !event.key.match(/\d/g)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    let value = Number.parseInt(target.value, 10);
    if (!Number.isFinite(value)) {
      value = this.default;
    }
    this.change(value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const target = event.currentTarget as HTMLInputElement;
    let cursorPos = target.selectionStart;
    const clipboardData = event.clipboardData.getData('text') || '';
    const clipboardNumber = Number.parseInt(clipboardData.replace(/[^\d]/gi, ''), 10);
    target.value = target.value.slice(0, cursorPos) + clipboardNumber + target.value.slice(target.selectionEnd);
    cursorPos += clipboardNumber.toString().length;
    target.selectionStart = cursorPos;
    target.selectionEnd = cursorPos;
    event.preventDefault();
    this.change(Number.parseInt(target.value, 10));
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.touch();
  }

  writeValue(value: any): void {
    let parsedNumber = Number.parseInt(value, 10);
    if (!Number.isFinite(parsedNumber)) {
      parsedNumber = this.default;
    }
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', parsedNumber);
  }

  registerOnChange(onChange: (number) => void): void {
    this.change = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.touch = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

}
