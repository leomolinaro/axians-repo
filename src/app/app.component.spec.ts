import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserCardComponent } from './user-card/user-card.component';
import { MaterialModule } from './material/material.module';
import { User } from './models/user';
import { Observable, never, from, throwError } from 'rxjs';
import { UserService } from './services/user.service';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
describe('AppComponent', () => {

  let appComponent: AppComponent;
  let userService: UserService;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent,
        UserCardComponent
      ],
      providers: [
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    userService = TestBed.get(UserService);
  });

  let preparePendingCall = function() {
    // Simulo una chiamata che non riceve mai risposta
    return spyOn(userService, "getUserByUsername").and.returnValue(never());
  }

  let prepareSuccessResponse = function () {
    // Simulo una chiamata che ha successo
    return spyOn(userService, "getUserByUsername").and.returnValue(from<User>([
      { name: "Nome 1", avatar_url: "avatar_url_1" },
      { name: "Nome 2", avatar_url: "avatar_url_2" },
    ]));
  }

  let prepareErrorResponse = function () {
    // Simulo una chiamata che dà errore
    return spyOn(userService, "getUserByUsername").and.returnValue(throwError(""));
  }

  /*****************************************************************************/
  /** searchUser() METHOD ******************************************************/
  /*****************************************************************************/

  it('should be loading while is searching for a user and before the response', () => {
    preparePendingCall();
    appComponent.searchUser();
    expect(appComponent.isLoading).toBeTruthy();
  });

  it('should have an empty user while is searching for a user and before the response', () => {
    preparePendingCall();
    appComponent.searchUser();
    expect(appComponent.user).toBeNull();
  });
  
  it('should not have any errors while is searching for a user and before the response, even if it had some errors previously', () => {
    preparePendingCall();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeFalsy();
    appComponent.usernameControl.setErrors({ notFound: true });
    expect(appComponent.usernameControl.invalid).toBeTruthy();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeFalsy();
  });

  it('should call the service getUserByUsername() method when searches for a user', () => {
    let spy = prepareSuccessResponse();
    appComponent.searchUser();
    expect(spy).toHaveBeenCalled();
  });

  it('should not be loading after a success response', () => {
    prepareSuccessResponse();
    appComponent.searchUser();
    expect(appComponent.isLoading).toBeFalsy();
  });

  it('should valorize the user after a success response', () => {
    prepareSuccessResponse();
    appComponent.searchUser();
    expect(appComponent.user).not.toBeNull();
  });

  it('should not have any errors after a success response, even if it had some errors previously', () => {
    prepareSuccessResponse();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeFalsy();
    appComponent.usernameControl.setErrors({ notFound: true });
    expect(appComponent.usernameControl.invalid).toBeTruthy();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeFalsy();
  });

  it('should not be loading after an error response', () => {
    prepareErrorResponse();
    appComponent.searchUser();
    expect(appComponent.isLoading).toBeFalsy();
  });

  it('should have a notFound error after an error response', () => {
    prepareErrorResponse();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeTruthy();
    expect(appComponent.usernameControl.hasError('notFound')).toBeTruthy();
  });

  /*****************************************************************************/
  /** clear() METHOD ***********************************************************/
  /*****************************************************************************/

  it('should have an empty user after cancelling', () => {
    appComponent.user = new User();
    appComponent.clear();
    expect(appComponent.user).toBeNull();
  });

  it('should not have any errors after cancelling', () => {
    prepareErrorResponse();
    appComponent.searchUser();
    expect(appComponent.usernameControl.invalid).toBeTruthy();
    appComponent.clear();
    expect(appComponent.usernameControl.invalid).toBeFalsy();
  });

  it('should have an empty username after cancelling', () => {
    appComponent.usernameControl.setValue('sample username');
    appComponent.clear();
    expect(appComponent.usernameControl.value).toBe('');
  });

  /*****************************************************************************/
  /** TEMPLATE *****************************************************************/
  /*****************************************************************************/

  it('should dispay an error message when the user is not found', () => {
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css(".not-found-error"));
    expect(de).toBeNull();
    prepareErrorResponse();
    appComponent.searchUser();
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(".not-found-error"));
    let errorMessage: HTMLElement = de.nativeElement;
    expect(errorMessage.innerText.length).toBeGreaterThan(0);
  });
  
  it('should display a loading spinner while loading', () => {
    fixture.detectChanges();
    let spinner = fixture.debugElement.query(By.directive(MatSpinner));
    expect(spinner).toBeNull();
    preparePendingCall();
    appComponent.searchUser();
    fixture.detectChanges();
    spinner = fixture.debugElement.query(By.directive(MatSpinner));
    expect(spinner).not.toBeNull();
  });

  it('should display the user card if a user is found', () => {
    fixture.detectChanges();
    let userCard = fixture.debugElement.query(By.directive(UserCardComponent));
    expect(userCard).toBeNull();
    prepareSuccessResponse();
    appComponent.searchUser();
    fixture.detectChanges();
    userCard = fixture.debugElement.query(By.directive(UserCardComponent));
    expect(userCard).not.toBeNull();
  });

  it('should update the username control when I write a username in the input box', async (() => {
    fixture.detectChanges();
    let de = fixture.debugElement.query(By.css("input"));
    let input: HTMLInputElement = de.nativeElement;
    input.value = "Username";
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(appComponent.usernameControl.value).toBe("Username");
  }));

  it('should call searchUser() method when I click the search button', () => {
    let button = fixture.debugElement.query(By.css(".search-button"));
    let spy = spyOn(appComponent, "searchUser");
    button.triggerEventHandler("click", null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call searchUser() method when I press enter while editing in the input box', () => {
    let input = fixture.debugElement.query(By.css("input"));
    let spy = spyOn(appComponent, "searchUser");
    input.triggerEventHandler("keyup.enter", null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call clear() method when I press esc while editing in the input box', () => {
    let input = fixture.debugElement.query(By.css("input"));
    let spy = spyOn(appComponent, "clear");
    input.triggerEventHandler("keyup.esc", null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call clear() method when I click the clear icon', () => {
    fixture.detectChanges();
    let button = fixture.debugElement.query(By.css(".clear-icon"));
    let spy = spyOn(appComponent, "clear");
    button.triggerEventHandler("click", null);
    expect(spy).toHaveBeenCalled();
  });

});
