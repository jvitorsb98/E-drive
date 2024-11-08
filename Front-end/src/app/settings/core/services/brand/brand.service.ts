import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Brand } from '../../models/brand';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private brandUrl: string;

  constructor(private http: HttpClient) {
    this.brandUrl = `${environment.apiUrl}/api/v1/brands`;
  }

  /**
  * Método para obter uma lista paginada de marcas (Brand) do backend.
  *
  * @param {number} [page=0] - Número da página que deseja carregar. O valor padrão é 0.
  * @param {number} [size=10] - Quantidade de itens por página. O valor padrão é 10.
  * @returns {Observable<PaginatedResponse<Brand>>} - Um Observable que emite a resposta paginada contendo uma lista de marcas.
  *
  * Este método realiza uma requisição HTTP GET para a URL `brandUrl`, 
  * enviando os parâmetros de paginação (page e size) e a ordenação pelo nome em ordem ascendente. 
  * Se ocorrer algum erro durante a requisição, o método retorna um erro genérico: 'Failed to load brands'.
  */
  getAllPaginated(pageIndex: number, pageSize: number, statusFilter: string ='all') {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());
  
    if (statusFilter != 'all') {
      params = params.set('activated', statusFilter); // Adiciona o filtro de status
    }
    return this.http.get<PaginatedResponse<Brand>>(`${this.brandUrl}`, { params });
  }
  /**
   * Método para carregar todas as marcas (Brand) de uma só vez após descobrir o total de registros.
   *
   * Este método faz uma requisição inicial para obter o número total de marcas disponíveis.
   * Em seguida, realiza uma requisição única para buscar todas as marcas, utilizando o total de registros 
   * obtido na primeira chamada como o tamanho da página. Isso permite carregar todos os dados em uma única 
   * requisição, facilitando o uso em situações onde um carregamento completo é necessário.
   *
   * @returns {Observable<Brand[]>} - Um Observable que emite uma lista de todas as marcas.
   *
   * Caso ocorra algum erro durante as requisições, o método retorna um erro genérico: 
   * 'Failed to load all brands'.
   */
  getAll(): Observable<Brand[]> {
    // Primeiro, faz uma requisição inicial para descobrir o número total de registros
    return this.getAllPaginated(0, 1).pipe(
      switchMap(response => {
        const totalElements = response.totalElements;
        // Faz a requisição final para obter todos os registros de uma só vez
        return this.getAllPaginated(0, totalElements).pipe(
          map(finalResponse => finalResponse.content),
          catchError((error) => throwError(() => new Error('Failed to load all brands')))
        );
      })
    );
  }

  /**
  * Método para obter detalhes de uma marca específica.
  *
  * @param {number} id - ID da marca que deseja obter os detalhes.
  * @returns {Observable<Brand>} - Um Observable que emite os detalhes da marca correspondente.
  *
  * Este método realiza uma requisição HTTP GET para buscar os detalhes de uma marca específica
  * com base no ID fornecido.
  */
  getBrandDetails(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.brandUrl}/${id}`);
  }

  /**
   * Método para registrar uma nova marca no sistema.
   *
   * @param {Brand} brand - Objeto contendo os dados da nova marca que será registrada.
   * @returns {Observable<Brand>} - Um Observable que emite a resposta do backend com a marca registrada.
   *
   * Este método realiza uma requisição HTTP POST para a URL `brandUrl` enviando os dados da marca
   * a serem registrados. Em caso de sucesso, o response é retornado. Em caso de erro, o método captura
   * e propaga a exceção.
   */
  register(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.brandUrl, brand).pipe(
      map(response => {
        console.log(response + 'O');
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  /**
   * Método para atualizar os dados de uma marca existente.
   *
   * @param {Brand} brand - Objeto contendo os dados atualizados da marca. Deve incluir o ID.
   * @returns {Observable<Brand>} - Um Observable que emite a resposta do backend com os dados atualizados da marca.
   *
   * O método realiza uma verificação para garantir que o objeto `brand` possui um ID e nome,
   * antes de fazer a requisição HTTP PUT. Caso falte algum desses dados obrigatórios, ele retorna
   * um erro informando que os dados são insuficientes para atualização.
   */
  update(brand: Brand): Observable<Brand> {
    // Verifica se a brand possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!brand.id || !brand.name) {
      return throwError(() => new Error('Dados da marca são insuficientes para atualização.'));
    }

    return this.http.put<Brand>(`${this.brandUrl}/${brand.id}`, brand).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  /**
   * Método para deletar uma marca específica.
   *
   * @param {number} id - ID da marca que deseja deletar.
   * @returns {Observable<void>} - Um Observable que emite um valor vazio (void) quando a marca é deletada com sucesso.
   *
   * Este método realiza uma requisição HTTP DELETE para remover uma marca com base no ID fornecido.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.brandUrl}/${id}`);
  }

  /**
   * Método para ativar uma marca específica.
   *
   * @param {number} id - ID da marca que deseja ativar.
   * @returns {Observable<void>} - Um Observable que emite um valor vazio (void) quando a ativação é concluída com sucesso.
   *
   * Este método realiza uma requisição HTTP PUT para ativar uma marca específica com base no ID fornecido.
   * Em caso de erro, ele captura e propaga a exceção.
   */
  activated(id: number): Observable<void> {
    return this.http.put<void>(`${this.brandUrl}/${id}/activate`, null).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

}
