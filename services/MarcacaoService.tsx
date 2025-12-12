import api from './api';
// Importe as interfaces de Marcacao (assumindo MarcacaoRequest e MarcacaoResponse)
import { MarcacaoResponse } from '../interfaces/marcacao/response'; 
import { MarcacaoRequest } from '../interfaces/marcacao/request'; 

// Caminho base definido no @RequestMapping("api/marcacao")
const BASE_PATH = '/marcacao'; 

// ----------------------------------------------------------------------------------------------
// --- Serviços de Marcação (CRUD) com Axios ---
// ----------------------------------------------------------------------------------------------

export const MarcacaoService = {
  
  /**
   * GET /api/marcacao/listar
   * Endpoint para listar todas as marcações.
   * O Controller retorna List<Marcacao>, tipamos como MarcacaoResponse[]
   * @returns Promise<MarcacaoResponse[]>
   */
  listarTodos: async () => {
    const response = await api.get<MarcacaoResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },
  
  /**
   * GET /api/marcacao/listar/{marcacaoId}
   * Endpoint para buscar uma marcação específica pelo ID.
   * O Controller retorna o objeto Marcacao, tipamos como MarcacaoResponse.
   * @param {number} marcacaoId O ID da marcação a ser buscada.
   * @returns Promise<MarcacaoResponse>
   */
  listarPorId: async (marcacaoId: number) => {
    const response = await api.get<MarcacaoResponse>(`${BASE_PATH}/listar/${marcacaoId}`);
    return response.data;
  },

  /**
   * POST /api/marcacao/criar
   * Endpoint para criar uma nova marcação.
   * Recebe MarcacaoRequest e retorna MarcacaoResponse (status 201 CREATED)
   * @param {MarcacaoRequest} dadosMarcacao Objeto com os dados da nova marcação.
   * @returns Promise<MarcacaoResponse>
   */
  criar: async (dadosMarcacao: MarcacaoRequest) => {
    const response = await api.post<MarcacaoResponse>(`${BASE_PATH}/criar`, dadosMarcacao);
    return response.data;
  },

  /**
   * PUT /api/marcacao/atualizar/{marcacaoId}
   * Endpoint para atualizar uma marcação existente.
   * @param {number} marcacaoId O ID da marcação a ser atualizada.
   * @param {MarcacaoRequest} novosDados Objeto com os novos dados.
   * @returns Promise<MarcacaoResponse>
   */
  atualizar: async (marcacaoId: number, novosDados: MarcacaoRequest) => {
    const response = await api.put<MarcacaoResponse>(`${BASE_PATH}/atualizar/${marcacaoId}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/marcacao/apagar/{marcacaoId}
   * Endpoint para apagar uma marcação. Retorna ResponseEntity<Void> (204 No Content).
   * @param {number} marcacaoId O ID da marcação a ser apagada.
   * @returns Promise<void>
   */
  apagar: async (marcacaoId: number) => {
    // Não tipamos o retorno, pois não há corpo (204 No Content)
    return api.delete(`${BASE_PATH}/apagar/${marcacaoId}`);
  }
};