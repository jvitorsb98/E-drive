import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Espiar o método platformBrowserDynamic
jest.mock('@angular/platform-browser-dynamic', () => ({
  platformBrowserDynamic: jest.fn() as jest.MockedFunction<typeof platformBrowserDynamic>, // Tipando corretamente
}));

describe('App initialization', () => {
  it('should bootstrap the AppModule', async () => {
    const mockBootstrapModule = jest.fn().mockResolvedValue(undefined);
    
    // Mocka a função platformBrowserDynamic para retornar um objeto com bootstrapModule
    (platformBrowserDynamic as jest.Mock).mockReturnValue({
      bootstrapModule: mockBootstrapModule,
    });

    await import('./main');

    expect(platformBrowserDynamic).toHaveBeenCalled();
    expect(mockBootstrapModule).toHaveBeenCalledWith(AppModule);
  });

  it('should log an error if initialization fails', async () => {
    const mockError = new Error('Erro ao inicializar');
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockBootstrapModule = jest.fn().mockRejectedValue(mockError);
    (platformBrowserDynamic as jest.Mock).mockReturnValue({
      bootstrapModule: mockBootstrapModule,
    });

    await import('./main'); 

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });
});