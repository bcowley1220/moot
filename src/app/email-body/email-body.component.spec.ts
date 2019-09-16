import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailBodyComponent } from './email-body.component';

describe('EmailBodyComponent', () => {
  let component: EmailBodyComponent;
  let fixture: ComponentFixture<EmailBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
