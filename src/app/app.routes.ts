import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: AuthLayout, canActivate: [AuthGuard] }, // หน้าแรก
  // { path: 'apply-loan', component: LoanApplication }, // Route สำหรับหน้าสมัครสินเชื่อ
  // เพิ่ม routes อื่นๆ ที่คุณต้องการ
  { path: '**', redirectTo: '' }, // Redirect ไปหน้าหลักหากไม่พบเส้นทาง
];
