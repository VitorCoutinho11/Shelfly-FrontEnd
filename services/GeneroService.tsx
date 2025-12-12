import api from './api';
// Importe as interfaces de Genero (assumindo GeneroRequest e GeneroResponse)
import { GeneroResponse } from '../interfaces/genero/response'; 
import { GeneroRequest } from '../interfaces/genero/request'; 

// Caminho base definido no @RequestMapping("api/genero")
const BASE_PATH = 'http://academico3.rj.senac.br/shelfly/api'; 

// ----------------------------------------------------------------------------------------------
// --- Serviços de Gênero (CRUD) com Axios ---
// ----------------------------------------------------------------------------------------------

export const GeneroService = {
  
  /**
   * GET /api/genero/listar
   * Endpoint para listar todos os gêneros.
   * O Controller retorna List<Genero>, tipamos como GeneroResponse[]
   * @returns Promise<GeneroResponse[]>
   */
  listarTodos: async () => {
    const response = await api.get<GeneroResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },
  
  /**
   * GET /api/genero/listar/{generoId}
   * Endpoint para buscar um gênero específico pelo ID.
   * O Controller retorna o objeto Genero, tipamos como GeneroResponse.
   * @param {number} generoId O ID do gênero a ser buscado.
   * @returns Promise<GeneroResponse>
   */
  listarPorId: async (generoId: number) => {
    const response = await api.get<GeneroResponse>(`${BASE_PATH}/listar/${generoId}`);
    return response.data;
  },

  /**
   * POST /api/genero/criar
   * Endpoint para criar um novo gênero.
   * Recebe GeneroRequest e retorna GeneroResponse (status 201 CREATED)
   * @param {GeneroRequest} dadosGenero Objeto com os dados do novo gênero.
   * @returns Promise<GeneroResponse>
   */
  criar: async (dadosGenero: GeneroRequest) => {
    const response = await api.post<GeneroResponse>(`${BASE_PATH}/criar`, dadosGenero);
    return response.data;
  },

  /**
   * PUT /api/genero/atualizar/{generoId}
   * Endpoint para atualizar um gênero existente.
   * @param {number} generoId O ID do gênero a ser atualizado.
   * @param {GeneroRequest} novosDados Objeto com os novos dados.
   * @returns Promise<GeneroResponse>
   */
  atualizar: async (generoId: number, novosDados: GeneroRequest) => {
    const response = await api.put<GeneroResponse>(`${BASE_PATH}/atualizar/${generoId}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/genero/apagar/{generoId}
   * Endpoint para apagar um gênero. Retorna ResponseEntity<Void> (204 No Content).
   * @param {number} generoId O ID do gênero a ser apagado.
   * @returns Promise<void>
   */
  apagar: async (generoId: number) => {
    // Não tipamos o retorno, pois não há corpo (204 No Content)
    return api.delete(`${BASE_PATH}/apagar/${generoId}`);
  }
};