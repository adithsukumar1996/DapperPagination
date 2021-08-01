import { Component, ViewChild } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { Button } from './interfaces/Button';
import { Column } from './interfaces/Column';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dapper-ui';

  @ViewChild('app-grid')
  grid: GridComponent<any>;
  columns: Column[] = [
    { DisplayName: 'Address', columnName: 'address' },
    { DisplayName: 'District', columnName: 'district' },
  ];
  buttons: Button[] = [{ buttonName: 'Notes', displayName: 'NOtes' }];

  buttonClick(event: any) {
    console.log(event);
  }
}
