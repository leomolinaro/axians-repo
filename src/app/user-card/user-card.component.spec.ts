import { MaterialModule } from './../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';
import { By } from '@angular/platform-browser';

describe("UserCardComponent", () => {

  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ UserCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = {
      avatar_url: "url_di_esempio",
      name: "Nome Completo",
      location: "Località",
      company: "Compagnia",
      bio: "Biografia dell'utente.",
      blog: "blog_url_di_esempio"
    };
    fixture.detectChanges();
  });

  /*****************************************************************************/
  /** TEMPLATE *****************************************************************/
  /*****************************************************************************/

  it("should display the avatar of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-avatar"));
    let el: HTMLElement = de.nativeElement;
    expect(el.getAttribute("src")).toBe("url_di_esempio");
  });

  it("should display the name of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-name"));
    let el: HTMLElement = de.nativeElement;
    expect(el.innerText).toContain("Nome Completo");
  });

  it("should display the location of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-location"));
    let el: HTMLElement = de.nativeElement;
    expect(el.innerText).toContain("Località");
  });

  it("should display the company of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-company"));
    let el: HTMLElement = de.nativeElement;
    expect(el.innerText).toContain("Compagnia");
  });

  it("should display the biography of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-bio"));
    let el: HTMLElement = de.nativeElement;
    expect(el.innerText).toContain("Biografia dell'utente");
  });

  it("should display the site of the user", () => {
    let de = fixture.debugElement.query(By.css(".user-blog"));
    let el: HTMLElement = de.nativeElement;
    expect(el.getAttribute("href")).toBe("blog_url_di_esempio");
    expect(el.innerText).toContain("blog_url_di_esempio");
  });

});
