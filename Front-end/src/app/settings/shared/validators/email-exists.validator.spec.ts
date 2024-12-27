import { FormControl } from '@angular/forms';
import { of, throwError, Observable } from 'rxjs';
import { UserService } from '../../core/services/user/user.service';
import { emailExistsValidator, emailnoExistsValidator } from './email-exists.validator';

describe('Email Exists Validator', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = {
      checkEmailExists: jest.fn()
    } as unknown as jest.Mocked<UserService>;
  });

  it('should return error when email exists', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(of(true));
    const control = new FormControl('existing@email.com');

    const validator = emailExistsValidator(mockUserService);
    (validator(control) as Observable<{ emailExists: boolean } | null>).subscribe((result) => {
      expect(result).toEqual({ emailExists: true });
      done();
    });
  });

  it('should return null when email does not exist', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(of(false));
    const control = new FormControl('new@email.com');

    const validator = emailExistsValidator(mockUserService);
    (validator(control) as Observable<{ emailExists: boolean } | null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null when email is empty', (done) => {
    const control = new FormControl('');

    const validator = emailExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null on service error', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(throwError(() => new Error('Error')));
    const control = new FormControl('error@email.com');

    const validator = emailExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });
});

describe('Email Does Not Exist Validator', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = {
      checkEmailExists: jest.fn()
    } as unknown as jest.Mocked<UserService>;
  });

  it('should return error when email does not exist', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(of(false));
    const control = new FormControl('nonexistent@email.com');

    const validator = emailnoExistsValidator(mockUserService);
    (validator(control) as Observable<{ emailExists: boolean } | null>).subscribe((result) => {
      expect(result).toEqual({ emailExists: true });
      done();
    });
  });

  it('should return null when email exists', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(of(true));
    const control = new FormControl('existing@email.com');

    const validator = emailnoExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null on service error', (done) => {
    mockUserService.checkEmailExists.mockReturnValue(throwError(() => new Error('Error')));
    const control = new FormControl('error@email.com');

    const validator = emailnoExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null if the control value is empty', (done) => {
    const control = new FormControl('');

    const validator = emailnoExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null if the control value is null', (done) => {
    const control = new FormControl(null);

    const validator = emailnoExistsValidator(mockUserService);
    (validator(control) as Observable<null>).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

});
