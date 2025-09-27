import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeaderComponent {
  title = '';
  breadcrumb: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let r = this.route.firstChild;
          while (r?.firstChild) r = r.firstChild;
          return r?.snapshot.data ?? {};
        })
      )
      .subscribe((data) => {
        this.title = data['title'] ?? '';
        this.breadcrumb = data['breadcrumb'] ?? [];
      });
  }
}
