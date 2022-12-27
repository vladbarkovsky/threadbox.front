import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderRoutingModule } from './header-routing.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, HeaderRoutingModule, NgbCollapseModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
