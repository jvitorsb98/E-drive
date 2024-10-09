import { IAutonomyRequest } from './autonomy';
import { Category } from './category';
import { Model } from "./model";
import { Propulsion } from "./propulsion";
import { VehicleType } from "./vehicle-type";

/**
 * Interface que representa um veículo no sistema.
 */
export interface Vehicle {
  /**
   * Identificador único do veículo.
   * @type {number}
   */
  id: number;

  /**
   * Tipo de motor do veículo.
   * @type {string}
   */
  motor: string;

  /**
   * Versão do veículo.
   * @type {string}
   */
  version: string;

  /**
   * Modelo do veículo, associado à interface Model.
   * @type {Model}
   */
  model: Model;

  /**
   * Categoria do veículo, associada à interface Category.
   * @type {Category}
   */
  category: Category;

  /**
   * Tipo do veículo, associado à interface VehicleType.
   * @type {VehicleType}
   */
  type: VehicleType;

  /**
   * Propulsão do veículo, associada à interface Propulsion.
   * @type {Propulsion}
   */
  propulsion: Propulsion;

  /**
   * Dados de autonomia do veículo, associados à interface IAutonomyRequest.
   * @type {IAutonomyRequest}
   */
  autonomy: IAutonomyRequest;

  /**
   * Indica se o veículo está ativado.
   * @type {boolean}
   */
  activated: boolean;

  /**
   * Ano de fabricação do veículo.
   * @type {number}
   */
  year: number;
}

/**
 * Interface que representa a requisição para criação ou atualização de um veículo.
 */
export interface IVehicleRequest {
  /**
   * Tipo de motor do veículo.
   * @type {string}
   */
  motor: string;

  /**
   * Versão do veículo.
   * @type {string}
   */
  version: string;

  /**
   * Identificador do modelo do veículo.
   * @type {number}
   */
  modelId: number;

  /**
   * Identificador da categoria do veículo.
   * @type {number}
   */
  categoryId: number;

  /**
   * Identificador do tipo do veículo.
   * @type {number}
   */
  typeId: number;

  /**
   * Identificador da propulsão do veículo.
   * @type {number}
   */
  propulsionId: number;

  /**
   * Ano de fabricação do veículo.
   * @type {number}
   */
  year: number;

  /**
   * Dados de autonomia do veículo, associados à interface IAutonomyRequest.
   * @type {IAutonomyRequest}
   */
  dataRegisterAutonomy: IAutonomyRequest;
}

// Como tem que chegar no backend:
/*
{
  "motor": "Motor 1.6 Turbo",
  "version": "Sport",
  "modelId": 12345,
  "categoryId": 54321,
  "typeId": 9876,
  "propulsionId": 6789,
  "year": 2023,
  "dataRegisterAutonomy": {
    "mileagePerLiterRoad": 15.5,
    "mileagePerLiterCity": 12.0,
    "consumptionEnergetic": 7.8,
    "autonomyElectricMode": 100.0
  }
}
*/
