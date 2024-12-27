import { TestBed } from '@angular/core/testing';
import { TripPlannerMapsService } from './trip-planner-maps.service';
import { BatteryService } from './baterry/battery.service';
import { FingChargingService } from './findCharging/fing-charging.service';
import { Step } from '../../models/step';

describe('TripPlannerMapsService', () => {
  let service: TripPlannerMapsService;
  let batteryServiceMock: jest.Mocked<BatteryService>;
  let findChargingMock: jest.Mocked<FingChargingService>;

  beforeEach(() => {
    // Mock dos serviços
    batteryServiceMock = {
      getBatteryHealth: jest.fn(),
      getConsumptionEnergetic: jest.fn(),
      getBatteryCapacity: jest.fn(),
      calculateRealAutonomy: jest.fn(),
      calculateBatteryConsumption: jest.fn(),
    } as unknown as jest.Mocked<BatteryService>;

    findChargingMock = {
      findAllChargingStationsBetween: jest.fn(),
    } as unknown as jest.Mocked<FingChargingService>;

    TestBed.configureTestingModule({
      providers: [
        TripPlannerMapsService,
        { provide: BatteryService, useValue: batteryServiceMock },
        { provide: FingChargingService, useValue: findChargingMock },
      ],
    });

    service = TestBed.inject(TripPlannerMapsService);
  });

  it('deve calcular as estações de carregamento corretamente', async () => {
    // Mock dos dados do veículo e percurso
    const selectedVehicle = { id: '1', name: 'Carro Elétrico' };
    const remainingBattery = 50; // 50%
    const batteryHealth = 100; // 100%
    const stepsArray: Step[] = [
      { distance: 50, duration: '10 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
      { distance: 70, duration: '15 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
    ];

    // Mock das respostas dos serviços
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15); // MJ/km
    batteryServiceMock.getBatteryCapacity.mockReturnValue(75); // kWh
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(500); // km
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance) => (distance / 500) * 100); // consumo em %

    findChargingMock.findAllChargingStationsBetween.mockResolvedValue([
      { station: { name: 'Station A', place_id: 'A' }, accumulatedDistance: 60, distanceToNext: 40 },
      { station: { name: 'Station B', place_id: 'B' }, accumulatedDistance: 120, distanceToNext: 0 },
    ]);

    // Chama o método
    const result = await service.calculateChargingStations(selectedVehicle, remainingBattery, batteryHealth, stepsArray);

    // Validações
    expect(result.canCompleteTrip).toBe(true);
    expect(result.canCompleteWithoutStops).toBe(true);
    expect(result.batteryPercentageAfterTrip).toBeGreaterThan(0);
    expect(result.chargingStationsMap.size).toBe(0); // Parou nenhuma

    // Verifica se os métodos dos mocks foram chamados corretamente
    expect(batteryServiceMock.getBatteryHealth).toHaveBeenCalledWith(selectedVehicle, batteryHealth);
    expect(batteryServiceMock.calculateBatteryConsumption).toHaveBeenCalledTimes(1);
  });

  it('deve retornar que a viagem é possível sem paradas', async () => {
    const selectedVehicle = { id: '1', name: 'Carro Elétrico' };
    const remainingBattery = 100; // 100%
    const batteryHealth = 100; // 100%
    const stepsArray: Step[] = [
      { distance: 50, duration: '10 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
    ];

    // Mock dos serviços
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15); // MJ/km
    batteryServiceMock.getBatteryCapacity.mockReturnValue(75); // kWh
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(500); // km
    batteryServiceMock.calculateBatteryConsumption.mockReturnValue(10); // consumo em %

    findChargingMock.findAllChargingStationsBetween.mockResolvedValue([]);

    // Chama o método
    const result = await service.calculateChargingStations(selectedVehicle, remainingBattery, batteryHealth, stepsArray);

    // Validações
    expect(result.canCompleteTrip).toBe(true);
    expect(result.canCompleteWithoutStops).toBe(true);
    expect(result.chargingStationsMap.size).toBe(0); // Sem paradas
  });

  it('deve retornar que a viagem não é possível se a bateria não for suficiente', async () => {
    const selectedVehicle = { id: '1', name: 'Carro Elétrico' };
    const remainingBattery = 20; // 20%
    const batteryHealth = 100; // 100%
    const stepsArray: Step[] = [
      { distance: 50, duration: '10 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
      { distance: 70, duration: '15 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
    ];

    // Mock dos serviços
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15); // MJ/km
    batteryServiceMock.getBatteryCapacity.mockReturnValue(75); // kWh
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(500); // km
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance) => (distance / 500) * 100); // consumo em %

    findChargingMock.findAllChargingStationsBetween.mockResolvedValue([
      { station: { name: 'Station A', place_id: 'A' }, accumulatedDistance: 60, distanceToNext: 40 },
      { station: { name: 'Station B', place_id: 'B' }, accumulatedDistance: 120, distanceToNext: 0 },
    ]);

    // Chama o método
    const result = await service.calculateChargingStations(selectedVehicle, remainingBattery, batteryHealth, stepsArray);

    // Validações
    expect(result.canCompleteTrip).toBe(false); // Viagem não pode ser completada com a bateria restante
    expect(result.canCompleteWithoutStops).toBe(false); // Não pode ser completada sem paradas
  });

  it('deve parar em uma estação de carregamento se necessário', async () => {
    const selectedVehicle = { id: '1', name: 'Carro Elétrico' };
    const remainingBattery = 50; // 50%
    const batteryHealth = 100; // 100%
    const stepsArray: Step[] = [
      { distance: 150, duration: '10 mins', instructions: '', travelMode: '', path: [], maneuver: '', roadType: '' },
    ];

    // Mock dos serviços
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(0.41);
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(280);
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance) => distance * 0.3);

    findChargingMock.findAllChargingStationsBetween.mockResolvedValue([
      { station: { name: 'Station A', place_id: 'A' }, accumulatedDistance: 60, distanceToNext: 80 },
      { station: { name: 'Station B', place_id: 'B' }, accumulatedDistance: 140, distanceToNext: 0 },
    ]);

    // Chama o método
    const result = await service.calculateChargingStations(selectedVehicle, remainingBattery, batteryHealth, stepsArray);

    // Validações
    expect(result.canCompleteTrip).toBe(true); // Não pode completar a viagem sem parar
    expect(result.chargingStationsMap.size).toBeGreaterThan(0); // Parou em pelo menos uma estação
    // Verifica se as estações foram corretamente mapeadas
    expect(result.chargingStationsMap.has('Station B')).toBe(false);
  });
});
