import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationService } from '../pagination.service';
import { Column } from '../interfaces/Column';
import { Button } from '../interfaces/Button';
import { ButtonEvent } from '../interfaces/ButtonEvent';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent<T> implements OnInit {
  @Input()
  columns: Column[];

  @Input()
  buttons: Button[];

  @Input()
  url: string;

  @Output()
  onButtonsClick: EventEmitter<ButtonEvent<T>> = new EventEmitter<
    ButtonEvent<T>
  >();

  loading = false;

  displayedColumns: string[];

  dataSource: MatTableDataSource<T>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  query: PagedQuery = {
    orderColumn: '',
    orderDirection: 0,
    pageNumber: 1,
    pageSize: 10,
    searchString: '',
  };

  noOfResults: number;

  constructor(
    private service: PaginationService,
    private changeDetectorRefs: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns
      .map((x) => x.columnName)
      .concat(this.buttons.map((c) => c.buttonName));
    this.loadData();
  }

  buttonClick(buttonName: string, element: T): void {
    this.onButtonsClick.emit({
      buttonName: buttonName,
      row: element,
    });
  }

  async applyFilter(event: Event): Promise<void> {
    const filterValue = (event.target as HTMLInputElement).value;
    this.query.searchString = filterValue.trim().toLowerCase();
    await this.loadData();
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  async applySort(event: Event): Promise<void> {
    this.query.orderColumn = event['active'];
    this.query.orderDirection = event['direction'] == 'asc' ? 0 : 1;
    await this.loadData();
  }

  async applyPagination(event: PageEvent): Promise<void> {
    this.query.pageNumber = event.pageIndex + 1;
    this.query.pageSize = event.pageSize;
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      console.log(this.url);
      let url1 =
        this.url + `?pno=${this.query.pageNumber}&rno=${this.query.pageSize}`;
      if (this.query.searchString !== '') {
        url1 += `&q=${this.query.searchString}`;
      }
      if (this.query.orderColumn !== '') {
        url1 += `&order=${this.query.orderColumn}&dir=${this.query.orderDirection}`;
      }
      const pagedResponse = await this.service
        .retrivePaginatedData<T>(url1)
        .toPromise();
      this.noOfResults = pagedResponse.count;
      this.dataSource = new MatTableDataSource<T>(pagedResponse.result);
    } catch (e) {
      console.error(e);
      this.snackBar.open('Error while loading data for grid', null, {
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }
}

export interface PagedQuery {
  pageNumber: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: OrderDirection;
  searchString: string;
}

export enum OrderDirection {
  Ascending,
  Descending,
}
