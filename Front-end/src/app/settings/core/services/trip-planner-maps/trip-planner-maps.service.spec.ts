import { TestBed } from '@angular/core/testing';
import { TripPlannerMapsService } from './trip-planner-maps.service';
import { BatteryService } from './baterry/battery.service';
import { FingChargingService } from './findCharging/fing-charging.service';
import { Step } from '../../models/step';

describe('TripPlannerMapsService', () => {
  let service: TripPlannerMapsService;
  let batteryServiceMock: jest.Mocked<BatteryService>;
  let findChargingServiceMock: jest.Mocked<FingChargingService>;

  beforeAll(() => {
    global.google = {
        maps: {
            geometry: {
                spherical: {
                    computeDistanceBetween: jest.fn((pointA, pointB) => 1000), // Retorna 1 km
                    computeArea: jest.fn(),
                    computeHeading: jest.fn(),
                    computeLength: jest.fn(),
                    computeOffset: jest.fn(),
                    computeOffsetOrigin: jest.fn(),
                    interpolate: jest.fn(),
                    computeSignedArea: jest.fn(() => 0), // Mock de computeSignedArea
                },
                encoding: {
                    decodePath: jest.fn(() => []),  // Mock de decodePath
                    encodePath: jest.fn(() => '')  // Mock de encodePath
                },
                poly: {
                    containsLocation: jest.fn(() => true), // Mock de containsLocation
                    isLocationOnEdge: jest.fn(() => true), // Mock de isLocationOnEdge
                },
            },
        },
    } as any;
});




  beforeEach(() => {
    const batteryMock = {
      getBatteryHealth: jest.fn(),
      getConsumptionEnergetic: jest.fn(),
      getBatteryCapacity: jest.fn(),
      calculateRealAutonomy: jest.fn(),
      calculateBatteryConsumption: jest.fn(),
    };

    const chargingMock = {
      findAllChargingStationsBetween: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TripPlannerMapsService,
        { provide: BatteryService, useValue: batteryMock },
        { provide: FingChargingService, useValue: chargingMock },
      ],
    });

    service = TestBed.inject(TripPlannerMapsService);
    batteryServiceMock = TestBed.inject(BatteryService) as jest.Mocked<BatteryService>;
    findChargingServiceMock = TestBed.inject(FingChargingService) as jest.Mocked<FingChargingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should complete the trip without stops if battery is sufficient', async () => {
    const stepsArray: Step[] = [
      { distance: 10, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
    ];

    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15); // MJ/km
    batteryServiceMock.getBatteryCapacity.mockReturnValue(50); // kWh
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(333); // km
    batteryServiceMock.calculateBatteryConsumption.mockReturnValue(3); // %

    const result = await service.calculateChargingStations(
      {}, // selectedVehicle
      50, // remainingBattery
      100, // batteryHealth
      stepsArray
    );

    expect(result.canCompleteTrip).toBe(true);
    expect(result.canCompleteWithoutStops).toBe(true);
    expect(result.chargingStationsMap.size).toBe(0);
  });

  it('should return false if battery is insufficient and no stations are found', async () => {
    const stepsArray: Step[] = [
      { distance: 200, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
    ];

    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15);
    batteryServiceMock.getBatteryCapacity.mockReturnValue(50);
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(333);
    batteryServiceMock.calculateBatteryConsumption.mockReturnValue(80); // Consome 80% da bateria para o percurso

    findChargingServiceMock.findAllChargingStationsBetween.mockResolvedValue([]); // Sem estações

    const result = await service.calculateChargingStations(
      {},
      20, // Apenas 20% de bateria restante
      100,
      stepsArray
    );

    expect(result.canCompleteTrip).toBe(false);
    expect(result.chargingStationsMap.size).toBe(0);
  });

  it('should add charging station stops if battery is insufficient', async () => {
    const stepsArray: Step[] = [
      { distance: 100, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
      { distance: 100, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
    ];
  
    const mockStation = {
      station: { place_id: 'station1', name: 'Station 1', geometry: { location: { lat: 0, lng: 0 } } },
      step: stepsArray[1],
    };
  
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15);
    batteryServiceMock.getBatteryCapacity.mockReturnValue(50);
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(333);
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance: number) => distance * 0.3);
  
    findChargingServiceMock.findAllChargingStationsBetween.mockResolvedValue([mockStation]);
  
    const result = await service.calculateChargingStations(
      {},
      30, // Apenas 30% de bateria restante
      100,
      stepsArray
    );
  
    console.log(result); // Diagnóstico detalhado
    expect(result.canCompleteTrip).toBe(true); // Verifique as condições
    expect(result.canCompleteWithoutStops).toBe(false);
    expect(result.chargingStationsMap.size).toBe(1);
    expect(result.chargingStationsMap.has(mockStation.station)).toBe(true);
  });
  

  it('should skip a station if a further one is reachable', async () => {
    const stepsArray: Step[] = [
      { distance: 100, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
      { distance: 200, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
    ];
  
    const stations = [
      { station: { place_id: 'station1', name: 'Station 1', geometry: { location: { lat: 0, lng: 0 } } }, step: stepsArray[0] },
      { station: { place_id: 'station2', name: 'Station 2', geometry: { location: { lat: 0.0001, lng: 0.0001 } } }, step: stepsArray[1] },
    ];
  
    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(15);
    batteryServiceMock.getBatteryCapacity.mockReturnValue(50);
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(333);
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance: number) => distance * 0.3);
  
    findChargingServiceMock.findAllChargingStationsBetween.mockResolvedValue(stations);
  
    const result = await service.calculateChargingStations(
      {},
      60, // 60% de bateria restante
      100,
      stepsArray
    );
  
    expect(result.canCompleteTrip).toBe(true);
    expect(result.canCompleteWithoutStops).toBe(false);
    expect(result.chargingStationsMap.size).toBe(1);
    expect(result.chargingStationsMap.has(stations[1].station)).toBe(true); // Verificando se a estação mais distante foi escolhida
  });
  

  it('should correctly calculate stops for a long trip with multiple stations', async () => {
    const stepsArray: Step[] = [
        { distance: 100, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
        { distance: 150, path: [], duration: '', instructions: '', travelMode: '', maneuver: '', roadType: '' },
    ];

    const stations = [
        { station: { place_id: 'station1', name: 'Station 1', geometry: { location: { lat: 0, lng: 0 } } }, step: stepsArray[0] },
        { station: { place_id: 'station2', name: 'Station 2', geometry: { location: { lat: 0, lng: 0 } } }, step: stepsArray[1] },
    ];

    batteryServiceMock.getBatteryHealth.mockReturnValue(100);
    batteryServiceMock.getConsumptionEnergetic.mockReturnValue(0.41);
    batteryServiceMock.calculateRealAutonomy.mockReturnValue(280);
    batteryServiceMock.calculateBatteryConsumption.mockImplementation((distance) => distance * 0.3);

    findChargingServiceMock.findAllChargingStationsBetween.mockResolvedValue(stations);

    const result = await service.calculateChargingStations(
        {}, // selectedVehicle
        40, // remainingBattery
        100,
        stepsArray
    );

    expect(result.canCompleteTrip).toBe(true);
    expect(result.chargingStationsMap.size).toBe(1);
    expect(result.chargingStationsMap.has(stations[0].station)).toBe(true); // Station 1 chosen
    expect(result.chargingStationsMap.has(stations[1].station)).toBe(false);  // Station 2 skipped
});

});
