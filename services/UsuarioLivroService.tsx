import api from './api';
// Importe as interfaces de UsuarioLivro
import { UsuarioLivroResponse } from '../interfaces/usuarioLivro/response'; 
import { UsuarioLivroRequest } from '../interfaces/usuarioLivro/request'; 

// Caminho base definido no @RequestMapping("api/usuarios-livros")
const BASE_PATH = '/usuarios-livros'; 

// ----------------------------------------------------------------------------------------------
// --- Serviços de Associação Usuário-Livro (CRUD) com Axios ---
// ----------------------------------------------------------------------------------------------

export const UsuarioLivroService = {
  
  /**
   * GET /api/usuarios-livros/listar
   * Endpoint para listar todas as associações Usuario-Livro.
   * O Controller retorna List<UsuarioLivro>, tipamos como UsuarioLivroResponse[]
   * @returns Promise<UsuarioLivroResponse[]>
   */
  listarTodos: async () => {
    const response = await api.get<UsuarioLivroResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },
  
  /**
   * GET /api/usuarios-livros/listar/{id}
   * Endpoint para buscar uma associação específica pelo ID (da tabela de associação).
   * O Controller retorna o objeto UsuarioLivro, tipamos como UsuarioLivroResponse.
   * @param {number} id O ID da associação UsuarioLivro a ser buscada.
   * @returns Promise<UsuarioLivroResponse>
   */
  listarPorId: async (id: number) => {
    const response = await api.get<UsuarioLivroResponse>(`${BASE_PATH}/listar/${id}`);
    return response.data;
  },

  /**
   * POST /api/usuarios-livros/criar
   * Endpoint para criar uma nova associação (associar um livro a um usuário).
   * Recebe UsuarioLivroRequest e retorna UsuarioLivroResponse (status 201 CREATED)
   * @param {UsuarioLivroRequest} dadosUsuarioLivro Objeto com os dados da nova associação.
   * @returns Promise<UsuarioLivroResponse>
   */
  criar: async (dadosUsuarioLivro: UsuarioLivroRequest) => {
    const response = await api.post<UsuarioLivroResponse>(`${BASE_PATH}/criar`, dadosUsuarioLivro);
    return response.data;
  },

  /**
   * PUT /api/usuarios-livros/atualizar/{id}
   * Endpoint para atualizar uma associação existente (ex: mudar status de leitura).
   * @param {number} id O ID da associação a ser atualizada.
   * @param {UsuarioLivroRequest} novosDados Objeto com os novos dados.
   * @returns Promise<UsuarioLivroResponse>
   */
  atualizar: async (id: number, novosDados: UsuarioLivroRequest) => {
    const response = await api.put<UsuarioLivroResponse>(`${BASE_PATH}/atualizar/${id}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/usuarios-livros/apagar/{id}
   * Endpoint para apagar uma associação (remover um livro da lista do usuário).
   * Retorna ResponseEntity<Void> (204 No Content).
   * @param {number} id O ID da associação a ser apagada.
   * @returns Promise<void>
   */
  apagar: async (id: number) => {
    // Não tipamos o retorno, pois não há corpo (204 No Content)
    return api.delete(`${BASE_PATH}/apagar/${id}`);
  }
};