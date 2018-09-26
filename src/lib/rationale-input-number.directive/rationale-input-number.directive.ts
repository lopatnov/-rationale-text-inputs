import { Directive, Input, OnInit, forwardRef, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[rationale-input-number]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RationaleInputNumberDirective),
    multi: true
  }]
})
export class RationaleInputNumberDirective implements OnInit, ControlValueAccessor {  
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() maxlength: number;
  @Input() separator: string;
  @Input() delimiter: string;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() isSelectAllOnFocus: boolean;

  private renderer: Renderer2;
  private elementRef: ElementRef;
  private touch: () => void;
  private change: (value: number) => void;

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    this.renderer = renderer;
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.delimiter = this.delimiter || ' ';
    this.separator = this.separator || ',';
  }

  writeValue(obj: any): void {
    throw new Error("Method not implemented.");
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
