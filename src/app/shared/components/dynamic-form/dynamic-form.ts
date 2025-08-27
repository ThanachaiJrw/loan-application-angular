import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

export type fieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'blank'
  | 'header'
  | 'footer'
  | 'password';

export interface FormField {
  type: fieldType;
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  col?: number;
  required?: boolean;
}

export interface FormButton {
  label: string;
  action: string;
  color?: 'primary' | 'warning' | 'success' | 'danger';
  requiresValidation?: boolean;
}

export interface FormConfig {
  fields: FormField[];
  buttons: FormButton[];
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzGridModule,
    NzTypographyModule,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm implements OnInit {
  @Input() config!: FormConfig;
  @Output() formAction = new EventEmitter<{ action: string; value: any }>();
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    const group: any = {};
    this.config.fields.forEach((field) => {
      group[field.name] = new FormControl(
        '',
        field.required ? Validators.required : []
      );
    });
    this.form = new FormGroup(group);
  }

  onClick(action: string, requiresValidation: boolean = false) {
    if (requiresValidation && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (action === 'reset') {
      this.onReset();
      return;
    }
    this.formAction.emit({ action, value: this.form.value });
  }

  onReset() {
    this.form.reset();
    this.formAction.emit({ action: 'reset', value: null });
  }

  getColClass(field: FormField): string {
    return `col-span-${field.col || 3}`;
  }
}
