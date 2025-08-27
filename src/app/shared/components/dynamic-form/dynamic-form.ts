import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  EyeOutline,
  EyeInvisibleOutline,
} from '@ant-design/icons-angular/icons';

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
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm implements OnInit {
  @Input() config!: FormConfig;
  @Output() formAction = new EventEmitter<{ action: string; value: any }>();
  form: FormGroup = new FormGroup({});
  passwordVisible = false;
  password?: string;
  icons = [EyeOutline, EyeInvisibleOutline];

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...this.icons);
  }

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
    console.log(
      'requiresValidation : ',
      requiresValidation,
      ' this.form.invalid : ',
      this.form.invalid
    );
    if (requiresValidation && this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
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
  getValidateStatus(name: string): 'error' | 'success' | '' {
    const control = this.form.get(name);
    if (!control) return '';
    if (control.invalid && (control.touched || control.dirty)) return 'error';
    if (control.valid && (control.touched || control.dirty)) return 'success';
    return '';
  }

  getErrorTip(name: string, label: string = name): string {
    const control = this.form.get(name);
    if (!control) return '';
    if (control.hasError('required') && (control.touched || control.dirty)) {
      return `กรุณากรอก ${label}`;
    }
    // เพิ่ม validation อื่น ๆ ที่จำเป็น
    return '';
  }
}
