import { Component, OnInit } from '@angular/core';
import { IS4 } from './IS4';
import { Router } from '@angular/router';

@Component({
  template: '',
})
export class RedirectComponent implements OnInit {
  constructor(private is4: IS4, private router: Router) {}
  ngOnInit(): void {
    this.is4.signInCallback().then(() => this.router.navigate(['/app']));
  }
}
