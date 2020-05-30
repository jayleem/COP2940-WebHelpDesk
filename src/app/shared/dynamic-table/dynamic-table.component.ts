/*
Jason L Murphy
5/30/2020
This is a hacky attempt at a dynamic table component for this project
  Uses bootstrap and ng-pagination
    How to use: 
    Place this component in a HTML template.
    <app-dynamic-table

    [tableHeaders]="[]" <-- Declare table headers here

    [tableDataFields]="[]" <-- Data fields here this is used for sorting and should match the object properties

    [data]="" <-- Data should be passed as a variable from the parent object to this component 
                  e.g Parent Component: myData: { id = 1, name = "John Smith" }
                      In the Parent Component HTML set the [data] option as follows [data]="myData"

    [filterControl]=boolean <-- Enables filter controls although this may require custom implementation

    [pagination]=boolean <-- Enables ng-pagination just google it.

    ></app-dynamic-table>
*/


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  //vars received from parent component
  @Input() tableHeaders: string[] = [];
  @Input() tableDataFields: string[] = [];
  @Input() data: any[] = []
  @Input() filterControl: boolean;
  @Input() pagination: boolean;
  //vars sent to parent component
  @Output() onFiltersApplied: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFiltersCleared: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteClicked: EventEmitter<any> = new EventEmitter<any>();


  //selected issue id used for deleteing a ticket from table view
  //
  public id;
  //table sorting vars
  //
  public sorted = false;
  public sortOrder = -1;
  public colSorted = [false, false, false, false, false, false, false, false, false, false];

  //table filter vars
  public currentPriority; //default priority
  public currentStatus; //default status
  //pagination vars
  //
  public currentPage = 1;
  public itemsPerPage = 10;
  public pageSize = 0;
  //error var for displaying errors to the user e.g. no results
  //
  public errors;

  constructor(private issuesService: IssuesService) { }

  ngOnInit(): void {

  }

  changePriority(change: string) {
    this.currentPriority = change;
  }

  changeStatus(change: string) {
    this.currentStatus = change;
  }

  applyFilters() {
   this.onFiltersApplied.emit({filters: {currentPriority: this.currentPriority, currentStatus: this.currentStatus }})
  }

  clearFilters() {
    this.currentPriority = null;
    this.currentStatus = null;
    this.errors = null;
    this.onFiltersCleared.emit({filters: null })
  }

  onDelete(id){
    this.onDeleteClicked.emit({id:id});
   }

  onPageChange(change: number) {
    this.pageSize = this.itemsPerPage * (change - 1);
  }

  changePagesize(change: string) {
    this.itemsPerPage = this.pageSize + parseInt(change);
  }

  //table sort
  //
  dynamicSort(key) {
    return (a, b) => {
      let result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
      return result * this.sortOrder;
    }
  }

  switchSort(index, boolean) {
    if (boolean) {
      this.colSorted[index] = true;
      this.sortOrder = 1;
      for (let i = 0; i < this.colSorted.length; i++) {
        if (i != index) {
          this.colSorted[i] = false;
        }
      }
    } else {
      this.colSorted[index] = false;
      this.sortOrder = -1;
    }
  }

  tableDynamicSort(key) {
    this.data.sort(this.dynamicSort(key));
  }

  kvpNoSort(a, b) {    
    return 0;
  }
}
