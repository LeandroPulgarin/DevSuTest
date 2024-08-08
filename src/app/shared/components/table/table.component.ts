import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  Input,
  Signal,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  @Input({ required: true }) columns!: WritableSignal<string[]>;
  @Input() data: Signal<T[]> = signal([]);
  @Input() public pageSizes: number[] = [1, 5, 10, 20];
  @Input() private itemsPerPage: number = 5;

  public currentPage = signal(0);
  public currentPageDisplay = computed(() => this.currentPage() + 1);
  public paginatedData = computed(() => {
    const start = this.currentPage() * this.itemsPerPageSignal();
    const end = start + this.itemsPerPageSignal();
    return this.data().slice(start, end);
  });
  public totalPages = computed(() =>
    Math.ceil(this.data().length / this.itemsPerPageSignal())
  );
  public dataQuantity = computed(() => {
    return this.data().length;
  });
  public itemsPerPageSignal = signal(this.itemsPerPage);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('rowTemplate', { static: true }) rowTemplate!: TemplateRef<any>;

  constructor() {
    effect(
      () => {
        this.data();
        this.currentPage.set(0);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((page) => page + 1);
    }
  }

  public previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
    }
  }

  public changePageSize(size: Event): void {
    const selectedSize = (size.target as HTMLSelectElement).value;
    this.itemsPerPageSignal.set(parseInt(selectedSize));
    this.currentPage.set(0);
  }
}
