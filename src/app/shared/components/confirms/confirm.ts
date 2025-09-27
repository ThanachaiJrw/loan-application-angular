import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface ConfirmOptions {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class Confirm {
  constructor(private modal: NzModalService) {}

  open(options: ConfirmOptions) {
    this.modal.confirm({
      nzTitle: options.title || 'Confirm',
      nzContent: options.content || 'Are you sure?',
      nzOkText: options.okText || 'OK',
      nzCancelText: options.cancelText || 'Cancel',
      nzOnOk: () => {
        if (options.onOk) {
          options.onOk();
        }
      },
      nzOnCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
      },
      nzClosable: true,
      nzMaskClosable: true,
      nzOkDanger: false,
      nzCancelDisabled: !options.showCancel,
    });
  }
}
