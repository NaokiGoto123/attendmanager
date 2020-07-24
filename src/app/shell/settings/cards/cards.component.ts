import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StripeCardElement } from '@stripe/stripe-js';
import Stripe from 'stripe';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  // 支払方法登録フォームの設置場所を取得しておく
  @ViewChild('cardElement') private cardElementRef: ElementRef;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
  });

  cardElement: StripeCardElement;
  methods: Stripe.PaymentMethod[];

  isComplete: boolean;
  loading = true;
  inProgress: boolean;

  constructor(
    private fb: FormBuilder,
    public paymentService: PaymentService,
    public customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getCards();
  }

  async buildForm() {
    const stripeClient = await this.paymentService.getStripeClient();
    const elements = stripeClient.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount(this.cardElementRef.nativeElement);
    this.cardElement.on(
      'change',
      (event) => (this.isComplete = event.complete)
    );
  }

  // カード一覧を取得
  getCards() {
    this.paymentService.getPaymentMethods().then((methods) => {
      this.methods = methods.data;
    });
    this.loading = false;
  }

  // カードを作成
  createCard() {
    if (this.form.valid) {
      this.inProgress = true;
      this.snackBar.open('カードを登録しています', null, {
        duration: null,
      });
      this.paymentService
        .setPaymemtMethod(
          this.cardElement,
          this.form.value.name,
          this.form.value.email
        )
        .then(() => {
          this.snackBar.open('カードを登録しました');
          this.getCards();
        })
        .catch((error: Error) => {
          switch (error.message) {
            case 'expired_card':
              this.snackBar.open('カードの有効期限が切れています');
              break;
            default:
              this.snackBar.open('登録に失敗しました');
          }
        })
        .finally(() => {
          this.loading = false;
          this.cardElement.clear();
        });
    }
  }

  // 編集するカードをフォームの初期値にセット
  setCardToForm(paymentMethod: Stripe.PaymentMethod) {
    this.form.patchValue({
      name: paymentMethod.billing_details.name,
      email: paymentMethod.billing_details.email,
    });
    this.cardElement.clear();
  }

  // カードの削除
  deleteStripePaymentMethod(id: string) {
    const progress = this.snackBar.open('カードを削除しています', null, {
      duration: null,
    });
    this.loading = true;
    this.paymentService
      .deleteStripePaymentMethod(id)
      .then(() => {
        this.snackBar.open('カードを削除しました');
        this.getCards();
      })
      .catch(() => {
        this.snackBar.open('カードの削除に失敗しました');
      })
      .finally(() => {
        this.loading = false;
        progress.dismiss();
      });
  }
}
