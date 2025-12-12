import api from './api';
// Importe as interfaces de Avaliacao (sem DTO)
import { AvaliacaoResponse } from '../interfaces/avaliacao/response'; 
import { AvaliacaoRequest } from '../interfaces/avaliacao/request'; 

// Caminho base definido no @RequestMapping("api/avaliacao")
const BASE_PATH = '/avaliacao'; 

// ----------------------------------------------------------------------------------------------
// --- Serviços de Avaliação (CRUD) com Axios ---
// ----------------------------------------------------------------------------------------------

export const AvaliacaoService = {
  
  /**
   * GET /api/avaliacao/listar
   * Endpoint para listar todas as avaliações.
   * O Controller retorna List<Avaliacao>, tipamos como AvaliacaoResponse[]
   * @returns Promise<AvaliacaoResponse[]>
   */
  listarTodos: async () => {
    const response = await api.get<AvaliacaoResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },
  
  /**
   * GET /api/avaliacao/listar/{avaliacaoId}
   * Endpoint para buscar uma avaliação específica pelo ID.
   * O Controller retorna o objeto Avaliacao, tipamos como AvaliacaoResponse.
   * @param {number} avaliacaoId O ID da avaliação a ser buscada.
   * @returns Promise<AvaliacaoResponse>
   */
  listarPorId: async (avaliacaoId: number) => {
    const response = await api.get<AvaliacaoResponse>(`${BASE_PATH}/listar/${avaliacaoId}`);
    return response.data;
  },

  /**
   * POST /api/avaliacao/criar
   * Endpoint para criar uma nova avaliação.
   * Recebe AvaliacaoRequest e retorna AvaliacaoResponse (status 201 CREATED)
   * @param {AvaliacaoRequest} dadosAvaliacao Objeto com os dados da nova avaliação.
   * @returns Promise<AvaliacaoResponse>
   */
  criar: async (dadosAvaliacao: AvaliacaoRequest) => {
    const response = await api.post<AvaliacaoResponse>(`${BASE_PATH}/criar`, dadosAvaliacao);
    return response.data;
  },

  /**
   * PUT /api/avaliacao/atualizar/{avaliacaoId}
   * Endpoint para atualizar uma avaliação existente.
   * @param {number} avaliacaoId O ID da avaliação a ser atualizada.
   * @param {AvaliacaoRequest} novosDados Objeto com os novos dados.
   * @returns Promise<AvaliacaoResponse>
   */
  atualizar: async (avaliacaoId: number, novosDados: AvaliacaoRequest) => {
    const response = await api.put<AvaliacaoResponse>(`${BASE_PATH}/atualizar/${avaliacaoId}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/avaliacao/apagar/{avaliacaoId}
   * Endpoint para apagar uma avaliação. Retorna ResponseEntity<Void> (204 No Content).
   * @param {number} avaliacaoId O ID da avaliação a ser apagada.
   * @returns Promise<void>
   */
  apagar: async (avaliacaoId: number) => {
    // Não tipamos o retorno, pois não há corpo (204 No Content)
    return api.delete(`${BASE_PATH}/apagar/${avaliacaoId}`);
  }
};