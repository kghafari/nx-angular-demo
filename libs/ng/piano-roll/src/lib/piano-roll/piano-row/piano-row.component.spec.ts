import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PianoRowComponent } from './piano-row.component';

describe('PianoRowComponent', () => {
  let component: PianoRowComponent;
  let fixture: ComponentFixture<PianoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PianoRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PianoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
