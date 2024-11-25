import { UserDataService } from './user-data.service';

describe('UserDataService', () => {
  let service: UserDataService;

  beforeEach(() => {
    service = new UserDataService();
  });

  describe('formatAndStoreUserData', () => {
    it('should format phone number correctly with country code', () => {
      const countryCode = '55';
      const cellPhone = '12345678901';
      const formattedPhone = service.formatAndStoreUserData(countryCode, cellPhone);
      
      expect(formattedPhone).toBe('+55 (12) 34567-8901');
    });

    it('should return an empty string for invalid phone number', () => {
      const countryCode = '55';
      const cellPhone = '12345';
      const formattedPhone = service.formatAndStoreUserData(countryCode, cellPhone);
      
      expect(formattedPhone).toBe('');
    });

    it('should handle phone number with country code +', () => {
      const countryCode = '+55';
      const cellPhone = '12345678901';
      const formattedPhone = service.formatAndStoreUserData(countryCode, cellPhone);
      
      expect(formattedPhone).toBe('+55 (12) 34567-8901');
    });
  });

  describe('getVehicleTypeDisplay', () => {
    it('should return "Carro" when type is "CAR"', () => {
      const result = service.getVehicleTypeDisplay('CAR');
      expect(result).toBe('Carro');
    });

    it('should capitalize vehicle type string for other values', () => {
      const result = service.getVehicleTypeDisplay('motorcycle');
      expect(result).toBe('Motorcycle');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word in a string', () => {
      const result = service.capitalizeWords('hello world');
      expect(result).toBe('Hello World');
    });

    it('should handle a single word', () => {
      const result = service.capitalizeWords('hello');
      expect(result).toBe('Hello');
    });

    it('should handle an empty string', () => {
      const result = service.capitalizeWords('');
      expect(result).toBe('');
    });
  });
});