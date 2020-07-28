import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { ChargeWithInvoice } from 'src/app/interfaces/charge';
@Component({
  selector: 'app-payments-history',
  templateUrl: './payments-history.component.html',
  styleUrls: ['./payments-history.component.scss'],
})
export class PaymentsHistoryComponent implements OnInit {
  charges: ChargeWithInvoice[];
  startingAfter: string;
  endingBefore: string;
  page = 0;
  hasNext: boolean;
  loading: boolean;

  constructor(private customerService: CustomerService) {
    this.getCharges();
  }

  ngOnInit(): void {}

  getCharges(params?: { startingAfter?: string; endingBefore?: string }) {
    this.loading = true;
    this.customerService.getInvoices(params).then((result) => {
      this.hasNext = !!params?.endingBefore || result?.has_more;
      this.charges = result?.data;
      this.loading = false;
    });
  }

  nextPage() {
    this.page++;
    this.getCharges({
      startingAfter: this.charges[this.charges.length - 1].id,
    });
  }

  prevPage() {
    this.page--;
    this.getCharges({
      endingBefore: this.charges[0].id,
    });
  }
}
