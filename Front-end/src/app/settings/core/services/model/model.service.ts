import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/model';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  constructor(private http: HttpClient) {
    this.modelUrl = `${environment.apiUrl}/api/v1/models`;
  }

  /**
 * Método para obter uma lista paginada de todos os modelos (Model).
 *
 * @param {number} page - Número da página que deseja carregar.
 * @param {number} size - Quantidade de itens por página.
 * @returns {Observable<PaginatedResponse<Model>>} - Um Observable que emite a resposta paginada contendo uma lista de modelos.
 *
 * O método realiza uma requisição HTTP GET para a URL `modelUrl`, enviando os parâmetros de paginação
 * (page e size) e a ordenação pelo nome em ordem ascendente. Caso ocorra algum erro, o método retorna
 * uma mensagem de erro genérica: 'Failed to load models'.
 */
  getAll(page: number, size: number): Observable<PaginatedResponse<Model>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'name'); // Ordenação pelo nome em ordem ascendente

    return this.http.get<PaginatedResponse<Model>>(this.modelUrl, { params: params }).pipe(
      catchError(() => throwError(() => new Error('Failed to load models')))
    );
  }

  /**
   * Método para obter todos os modelos associados a uma marca específica.
   *
   * @param {number} brandId - ID da marca para a qual os modelos devem ser carregados.
   * @returns {Observable<Model[]>} - Um Observable que emite uma lista de modelos associados à marca.
   *
   * Este método realiza uma requisição HTTP GET para buscar os modelos relacionados a uma marca
   * específica, utilizando o ID fornecido.
   */
  getModelsByBrandId(brandId: number): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.modelUrl}/brand/${brandId}`);
  }

  /**
   * Método para registrar um novo modelo no sistema.
   *
   * @param {Model} model - Objeto contendo os dados do novo modelo que será registrado.
   * @returns {Observable<Model>} - Um Observable que emite a resposta do backend com o modelo registrado.
   *
   * Este método realiza uma requisição HTTP POST para a URL `modelUrl` enviando os dados do modelo
   * a serem registrados. Em caso de sucesso, o response é retornado. Em caso de erro, o método captura
   * e propaga a exceção.
   */
  register(model: Model): Observable<Model> {
    return this.http.post<Model>(this.modelUrl, model).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  /**
   * Método para atualizar os dados de um modelo existente.
   *
   * @param {Model} model - Objeto contendo os dados atualizados do modelo. Deve incluir o ID.
   * @returns {Observable<Model>} - Um Observable que emite a resposta do backend com os dados atualizados do modelo.
   *
   * O método realiza uma verificação para garantir que o objeto `model` possui um ID e nome,
   * antes de fazer a requisição HTTP PUT. Caso falte algum desses dados obrigatórios, ele retorna
   * um erro informando que os dados são insuficientes para atualização.
   */
  update(model: Model): Observable<Model> {
    // Verifica se a model possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!model.id || !model.name) {
      return throwError(() => new Error('Dados do modelo são insuficientes para atualização.'));
    }

    return this.http.put<Model>(`${this.modelUrl}/${model.id}`, model).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  /**
   * Método para deletar um modelo específico.
   *
   * @param {number} id - ID do modelo que deseja deletar.
   * @returns {Observable<void>} - Um Observable que emite um valor vazio (void) quando o modelo é deletado com sucesso.
   *
   * Este método realiza uma requisição HTTP DELETE para remover um modelo com base no ID fornecido.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.modelUrl}/${id}`);
  }

  /**
   * Método para ativar um modelo específico.
   *
   * @param {number} id - ID do modelo que deseja ativar.
   * @returns {Observable<void>} - Um Observable que emite um valor vazio (void) quando a ativação é concluída com sucesso.
   *
   * Este método realiza uma requisição HTTP PUT para ativar um modelo específico com base no ID fornecido.
   * Em caso de erro, ele captura e propaga a exceção, além de exibir um erro no console.
   */
  activated(id: number): Observable<void> {
    return this.http.put<void>(`${this.modelUrl}/${id}/activate`, null).pipe(
      catchError(e => {
        console.error('Erro ao ativar o modelo:', e);
        return throwError(() => e);
      })
    );
  }


}