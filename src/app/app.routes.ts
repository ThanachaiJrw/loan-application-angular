import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '', component: HomeComponent }, // หน้าแรก
  // { path: 'apply-loan', component: LoanApplication }, // Route สำหรับหน้าสมัครสินเชื่อ
  // เพิ่ม routes อื่นๆ ที่คุณต้องการ
  { path: '**', redirectTo: '' }, // Redirect ไปหน้าหลักหากไม่พบเส้นทาง
];
