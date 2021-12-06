import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mapfre-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() maxSize: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() totalPages: number;
  @Input() boundaryLinkNumbers: boolean;
  @Input() disabled: boolean;
  @Input() rotate: boolean;
  @Input() forceEllipses: boolean;
  @Output() onChangePage: EventEmitter<any> = new EventEmitter();
  
  pages: any[] = [];

  constructor() {}

  ngOnInit() {
    if(!this.totalPages) this.calculateTotalPages();
    this.getPages();
  }

  ngOnChanges(changes) {
    if(this.totalItems && changes.totalItems && changes.totalItems.previousValue != changes.totalItems.currentValue) {
      if(!this.totalPages) this.calculateTotalPages();
    }

    if((this.totalPages && changes.totalPages && changes.totalPages.previousValue != changes.totalPages.currentValue) ||
       (this.currentPage && changes.currentPage && changes.currentPage.previousValue != changes.currentPage.currentValue)) {
      this.getPages();
    }
  }

  calculateTotalPages() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
    this.totalPages = Math.max(totalPages || 0, 1);
  };

  selectPage(page: number) {
    if (this.currentPage !== page && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.onChangePage.emit({ page: page });
    }
  }

  noPrevious() {
    return this.currentPage == 1;
  }

  noNext() {
    return this.currentPage == this.totalPages;
  }

  makePage(number: number, text: string, isActive: boolean) {
    return {
      number: number,
      text: text,
      active: isActive
    };
  }

  getPages() {
    var pages = [];

    // Default page limits
    var startPage = 1, endPage = this.totalPages;
    var isMaxSized = this.maxSize && this.maxSize < this.totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (this.rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(this.currentPage - Math.floor(this.maxSize / 2), 1);
        endPage = startPage + this.maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > this.totalPages) {
          endPage = this.totalPages;
          startPage = endPage - this.maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage = (Math.ceil(this.currentPage / this.maxSize) - 1) * this.maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + this.maxSize - 1, this.totalPages);
      }
    }

    // Add page number links
    for (var number = startPage; number <= endPage; number++) {
      var page = this.makePage(number, String(number), number === this.currentPage);
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && this.maxSize > 0 && (!this.rotate || this.forceEllipses || this.boundaryLinkNumbers)) {
      if (startPage > 1) {
        if (!this.boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
          var previousPageSet = this.makePage(startPage - 1, '...', false);
          pages.unshift(previousPageSet);
        }
        if (this.boundaryLinkNumbers) {
          if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
            var secondPageLink = this.makePage(2, '2', false);
            pages.unshift(secondPageLink);
          }
          //add the first page
          var firstPageLink = this.makePage(1, '1', false);
          pages.unshift(firstPageLink);
        }
      }

      if (endPage < this.totalPages) {
        if (!this.boundaryLinkNumbers || endPage < this.totalPages - 2) { //need ellipsis for all options unless range is too close to end
          var nextPageSet = this.makePage(endPage + 1, '...', false);
          pages.push(nextPageSet);
        }
        if (this.boundaryLinkNumbers) {
          if (endPage === this.totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
            var secondToLastPageLink = this.makePage(this.totalPages - 1, String(this.totalPages - 1), false);
            pages.push(secondToLastPageLink);
          }
          //add the last page
          var lastPageLink = this.makePage(this.totalPages, String(this.totalPages), false);
          pages.push(lastPageLink);
        }
      }
    }

    this.pages = pages;
  }

}