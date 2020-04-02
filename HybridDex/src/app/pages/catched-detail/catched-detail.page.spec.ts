import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatchedDetailPage } from './catched-detail.page';

describe('CatchedDetailPage', () => {
  let component: CatchedDetailPage;
  let fixture: ComponentFixture<CatchedDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchedDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatchedDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
