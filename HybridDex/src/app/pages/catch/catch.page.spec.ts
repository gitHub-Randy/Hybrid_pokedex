import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatchPage } from './catch.page';

describe('CatchPage', () => {
  let component: CatchPage;
  let fixture: ComponentFixture<CatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
