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
import { NzGridModule, NzRowDirective } from 'ng-zorro-antd/grid';
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

export type validatorConfig = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
};

export interface FormField {
  type: fieldType;
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  col?: number;
  showErrorTip?: boolean;
  validators?: validatorConfig[];
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
  alignButtons?: 'start' | 'center' | 'end';
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
    NzRowDirective,
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
      const validators: any[] = [];

      if (field.validators) {
        field.validators.forEach((validate) => {
          switch (validate.type) {
            case 'required':
              validators.push(Validators.required);
              break;
            case 'minLength':
              validators.push(Validators.minLength(validate.value));
              break;
            case 'maxLength':
              validators.push(Validators.maxLength(validate.value));
              break;
            case 'pattern':
              validators.push(Validators.pattern(validate.value));
              break;
          }
        });
      }
      console.log('field.name : ', field.name, ' validators : ', validators);
      group[field.name] = new FormControl('', validators);
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
      this.form.markAllAsDirty();
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

  getErrorTip(field: FormField): string {
    const control = this.form.get(field.name);
    if (!control || !control.errors) return '';
    console.log('control : ', control.hasError('required'));
    console.log('field : ', field);
    if (field.showErrorTip) {
      for (const validate of field.validators ?? []) {
        switch (validate.type) {
          case 'required':
            if (control.hasError('required')) {
              return validate.message;
            }
            break;
          case 'minLength':
            if (control.hasError('minlength')) {
              return validate.message;
            }
            break;
          case 'maxLength':
            if (control.hasError('maxlength')) {
              return validate.message;
            }
            break;
          case 'pattern':
            if (control.hasError('pattern')) {
              return validate.message;
            }
            break;
        }
      }
    }
    return '';
  }
}
