import api from './api';
// Importe as interfaces de Livro
import { LivroResponse } from '../interfaces/livro/response'; 
import { LivroRequest } from '../interfaces/livro/request'; 

// Caminho base definido no @RequestMapping("api/livro") do Controller
const BASE_PATH = 'http://academico3.rj.senac.br/shelfly/api'; 

// ----------------------------------------------------------------------------------------------
// --- Serviços de Livro (CRUD) com Axios ---
// ----------------------------------------------------------------------------------------------

export const LivroService = {
  
  /**
   * GET /api/livro/listar
   * Endpoint para listar todos os livros.
   * O Controller retorna List<Livro>, então tipamos como LivroDTOResponse[]
   * @returns Promise<LivroDTOResponse[]>
   */
  listarTodos: async () => {
    // Usamos o genérico <LivroDTOResponse[]>
    const response = await api.get<LivroResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },

  /**
   * GET /api/livro/listar/{livroId}
   * Endpoint para buscar um livro específico pelo ID.
   * O Controller retorna o objeto Livro (que mapeamos para LivroDTOResponse)
   * @param {number} livroId O ID do livro a ser buscado.
   * @returns Promise<LivroDTOResponse>
   */
  listarPorId: async (livroId: number) => {
    const response = await api.get<LivroResponse>(`${BASE_PATH}/listar/${livroId}`);
    return response.data;
  },

  /**
   * POST /api/livro/criar
   * Endpoint para criar um novo livro.
   * O Controller recebe LivroDTORequest e retorna LivroDTOResponse (status 201 CREATED)
   * @param {LivroDTORequest} dadosLivro Objeto com os dados do novo livro.
   * @returns Promise<LivroDTOResponse>
   */
  criar: async (dadosLivro: LivroRequest) => {
    const response = await api.post<LivroResponse>(`${BASE_PATH}/criar`, dadosLivro);
    return response.data;
  },

  /**
   * PUT /api/livro/atualizar/{livroId}
   * Endpoint para atualizar um livro existente.
   * @param {number} livroId O ID do livro a ser atualizado.
   * @param {LivroDTORequest} novosDados Objeto com os novos dados do livro.
   * @returns Promise<LivroDTOResponse>
   */
  atualizar: async (livroId: number, novosDados: LivroRequest) => {
    const response = await api.put<LivroResponse>(`${BASE_PATH}/atualizar/${livroId}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/livro/apagar/{livroId}
   * Endpoint para apagar um livro. O Controller retorna ResponseEntity<Void> (204 No Content).
   * @param {number} livroId O ID do livro a ser apagado.
   * @returns Promise<void>
   */
  apagar: async (livroId: number) => {
    // O retorno do Promise é void, pois não esperamos dados (204 No Content)
    return api.delete(`${BASE_PATH}/apagar/${livroId}`);
  }
};