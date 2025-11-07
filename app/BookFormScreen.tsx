import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Platform,
  GestureResponderEvent, // Importado para tipo de 'onPress'
  ViewStyle, // Importado para tipo de 'style'
} from 'react-native';

// --- Tipos de Navegação ---
// 💡 Você precisará ter @react-navigation/stack instalado
// (ou @react-navigation/native-stack) para este tipo
import { RouteProp, NavigationProp, ParamListBase } from '@react-navigation/native';

// Mocks para funções de storage e tipos
// A importação .js é desnecessária em TS, ele resolve .ts/.js/index.ts
import Theme from '../theme/index'; 

// --- DEFINIÇÃO DE TIPOS ---

// 1. Tipo para o Status do Livro
type BookStatus = 'want-to-read' | 'reading' | 'read';

// 2. Interface para as Opções de Status
interface StatusOption {
  label: string;
  value: BookStatus;
}

// 3. Interface para o objeto Livro (baseado no mock)
interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  year: number;
  status: BookStatus;
  synopsis: string;
  totalPages: number;
}

// 4. Interface para o estado do formulário (note que 'year' e 'totalPages' são strings)
interface BookFormData {
  title: string;
  author: string;
  cover: string;
  genre: string;
  year: string;
  totalPages: string;
  synopsis: string;
  status: BookStatus;
}

// 5. Tipos para as props de Navegação (React Navigation)
// Define os parâmetros que esta tela (BookForm) espera receber
type RootStackParamList = {
  BookForm: { bookId?: string };
  // Adicione outras telas aqui se necessário
};

// Tipo específico da prop 'route' para esta tela
type BookFormScreenRouteProp = RouteProp<RootStackParamList, 'BookForm'>;

// Tipo para as props do componente BookFormScreen
interface BookFormScreenProps {
  navigation: NavigationProp<ParamListBase>; // Prop de navegação genérica
  route: BookFormScreenRouteProp;
}

// 6. Tipos para o Dropdown Customizado
type DropdownOption = string | StatusOption;

interface CustomDropdownProps {
  label: string;
  value: string; // O valor atual (seja string ou BookStatus)
  options: DropdownOption[];
  onSelect: (value: string) => void;
  style?: ViewStyle; // Permite passar estilos de View
}

// --- Fim dos Mocks de Dados (Agora Tipados) ---
const mockBookToEdit: Book = {
  id: '1',
  title: 'O Nome do Vento',
  author: 'Patrick Rothfuss',
  cover: 'https://picsum.photos/400/600',
  genre: 'Fantasia',
  year: 2007,
  status: 'read',
  synopsis: 'Uma história épica sobre Kvothe, um lendário mago, músico e assassino. Detalhe da Edição.',
  totalPages: 699,
};

const mockGenders: string[] = ['Fantasia', 'Ficção Científica', 'Romance', 'Thriller', 'Histórico', 'Outro'];

const statusOptions: StatusOption[] = [
  { label: 'Quero Ler', value: 'want-to-read' },
  { label: 'Lendo', value: 'reading' },
  { label: 'Lido', value: 'read' },
];

const getBookByIdMock = (id: string): Book | null => {
  if (id === '1') return { ...mockBookToEdit };
  return null;
};
// --- Fim dos Mocks ---

// Desestrutura e complementa o tema (como nas outras telas)
// (O código do tema permanece o mesmo)
const { colors, spacing, typography } = {
  ...Theme,
  colors: {
    ...Theme.colors,
    background: Theme.colors.background || '#F4F4F5',
    card: Theme.colors.card || '#FFFFFF',
    primary: Theme.colors.primary || '#10B981',
    primaryForeground: Theme.colors.primaryForeground || '#FFFFFF',
    foreground: Theme.colors.foreground || '#1C1C1E',
    mutedForeground: Theme.colors.mutedForeground || '#717182',
    border: Theme.colors.border || '#D4D4D8',
    inputBackground: Theme.colors.inputBackground || '#F9FAFB',
  },
  spacing: Theme.spacing || { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  typography: Theme.typography || { body: { fontSize: 16 }, small: { fontSize: 14 }, button: { fontSize: 16 } }
};

// --- Componente Dropdown Tipado ---
const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onSelect, style }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Lógica de seleção tipada para lidar com string | StatusOption
  const selectedOption = options.find(opt => {
    if (typeof opt === 'string') return opt === value;
    return opt.value === value;
  });

  const selectedLabel = selectedOption
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : 'Selecione';

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setModalVisible(false);
  };

  return (
    <View style={style}>
      <Text style={stylesLocal.inputLabel}>{label} *</Text>
      <TouchableOpacity
        style={stylesLocal.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={stylesLocal.dropdownText}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={stylesLocal.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={stylesLocal.dropdownModalContent}>
            {options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;

              return (
                <TouchableOpacity
                  key={index}
                  style={stylesLocal.dropdownModalItem}
                  onPress={() => handleSelect(optionValue)}
                >
                  <Text style={stylesLocal.dropdownModalText}>
                    {optionLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// --- Componente Principal Tipado ---

// Aplicamos os tipos de props aqui
export default function BookFormScreen({ navigation, route }: BookFormScreenProps) {
  // 📌 Verifica se está no modo Edição
  const { bookId } = route.params || {};
  const isEditing = !!bookId;

  // 💡 Usamos Partial<Book> pois um livro inicial pode não ter todos os campos
 const initialBookData = isEditing && bookId ? getBookByIdMock(bookId) : null;
 const initialBook: Partial<Book> = initialBookData || {}; // Garante que nunca será null

  // 💡 Usamos o tipo BookFormData para o estado
  const [formData, setFormData] = useState<BookFormData>({
    title: initialBook?.title || '',
    author: initialBook?.author || '',
    cover: initialBook?.cover || '',
    genre: initialBook?.genre || mockGenders[0], // Pega o primeiro mock
    year: initialBook?.year ? String(initialBook.year) : String(new Date().getFullYear()),
    totalPages: initialBook?.totalPages ? String(initialBook.totalPages) : '',
    synopsis: initialBook?.synopsis || '',
    status: initialBook?.status || statusOptions[0].value,
  });

  // Título dinâmico da tela
  const screenTitle = isEditing ? 'Editar Livro' : 'Adicionar Livro';
  const actionButtonText = isEditing ? 'Salvar Alterações' : 'Adicionar Livro';

  // 💡 Tipamos 'name' para ser uma chave da interface BookFormData
  // e 'value' para aceitar os tipos de valor do formulário
  const handleChange = (name: keyof BookFormData, value: string | BookStatus) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // --- Validação Mínima ---
    // 💡 Usamos 'keyof BookFormData' para garantir que os campos existem
    const requiredFields: (keyof BookFormData)[] = ['title', 'author', 'genre', 'year', 'synopsis', 'status'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Erro de Validação', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const action = isEditing ? 'editado' : 'adicionado';

    // 💡 Aqui você chamaria a função de salvar/atualizar no seu serviço/storage
    Alert.alert('Sucesso', `Livro "${formData.title}" ${action} com sucesso!`);

    // Retorna para a tela de lista ou detalhes (dependendo de onde veio)
    navigation.goBack();
  };

  return (
    <View style={stylesLocal.fullScreenContainer}>
      {/* Header: Adaptado do visual da imagem de tela, mas usando navigation */}
      <View style={stylesLocal.header}>
        <TouchableOpacity onPress={handleCancel} style={stylesLocal.backButton}>
          <Text style={stylesLocal.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={stylesLocal.headerTitleContainer}>
          <Text style={stylesLocal.headerTitle}>Voltar</Text>
          <Text style={stylesLocal.headerSubtitle}>{screenTitle}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={stylesLocal.scrollViewContent}>

        {/* 1. Título */}
        <View style={stylesLocal.inputGroup}>
          <Text style={stylesLocal.inputLabel}>Título *</Text>
          <TextInput
            style={stylesLocal.textInput}
            placeholder="Digite o título do livro"
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
          />
        </View>

        {/* 2. Autor */}
        <View style={stylesLocal.inputGroup}>
          <Text style={stylesLocal.inputLabel}>Autor *</Text>
          <TextInput
            style={stylesLocal.textInput}
            placeholder="Digite o nome do autor"
            value={formData.author}
            onChangeText={(text) => handleChange('author', text)}
          />
        </View>

        {/* 3. URL da Capa e Botão Upload (mockado) */}
        <View style={stylesLocal.inputGroup}>
          <Text style={stylesLocal.inputLabel}>URL da Capa</Text>
          <View style={stylesLocal.inputWithButton}>
            <TextInput
              style={[stylesLocal.textInput, stylesLocal.urlInput]}
              placeholder="https://exemplo.com/capa.jpg"
              keyboardType="url"
              value={formData.cover}
              onChangeText={(text) => handleChange('cover', text)}
            />
            <TouchableOpacity style={stylesLocal.uploadButton}>
              <Text style={stylesLocal.uploadButtonText}>☁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Gênero e Ano de Publicação (Side-by-Side) */}
        <View style={stylesLocal.rowGroup}>
          {/* Gênero (Custom Dropdown) */}
          <CustomDropdown
            label="Gênero"
            value={formData.genre}
            options={mockGenders}
            onSelect={(value) => handleChange('genre', value)}
            style={stylesLocal.halfInput}
          />

          {/* Ano de Publicação */}
          <View style={stylesLocal.halfInput}>
            <Text style={stylesLocal.inputLabel}>Ano de Publicação *</Text>
            <TextInput
              style={stylesLocal.textInput}
              placeholder={String(new Date().getFullYear())}
              keyboardType="numeric"
              maxLength={4}
              value={formData.year}
              onChangeText={(text) => handleChange('year', text)}
            />
          </View>
        </View>

        {/* 5. Total de Páginas */}
        <View style={stylesLocal.inputGroup}>
          <Text style={stylesLocal.inputLabel}>Total de Páginas</Text>
          <TextInput
            style={stylesLocal.textInput}
            placeholder="Ex: 350"
            keyboardType="numeric"
            value={formData.totalPages}
            onChangeText={(text) => handleChange('totalPages', text)}
          />
        </View>

        {/* 6. Sinopse */}
        <View style={stylesLocal.inputGroup}>
          <Text style={stylesLocal.inputLabel}>Sinopse *</Text>
          <TextInput
            style={[stylesLocal.textInput, stylesLocal.textArea]}
            placeholder="Digite a sinopse do livro"
            multiline
            textAlignVertical="top"
            value={formData.synopsis}
            onChangeText={(text) => handleChange('synopsis', text)}
          />
        </View>

        {/* 7. Status (Custom Dropdown) */}
        <CustomDropdown
          label="Status"
          value={formData.status}
          options={statusOptions}
          onSelect={(value) => handleChange('status', value)}
          style={stylesLocal.inputGroup}
        />
      </ScrollView>

      {/* Rodapé com Botões de Ação */}
      <View style={stylesLocal.footer}>
        <TouchableOpacity onPress={handleCancel} style={stylesLocal.cancelButton}>
          <Text style={stylesLocal.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={stylesLocal.saveButton}>
          <Text style={stylesLocal.saveButtonText}>{actionButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- ESTILOS ---
// (Os estilos permanecem EXATAMENTE IGUAIS, 
// pois o StyleSheet do React Native já é totalmente compatível com TS)
const stylesLocal = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? spacing[8] : spacing[10],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.primary,
  },
  backButton: {
    paddingRight: spacing[4],
  },
  backIcon: {
    fontSize: 24,
    color: colors.primaryForeground,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: typography.body.fontSize,
    color: colors.primaryForeground,
    fontWeight: '500',
    lineHeight: 18,
  },
  headerSubtitle: {
    fontSize: 20,
    color: colors.primaryForeground,
    fontWeight: 'bold',
  },
  // --- ScrollView Content ---
  scrollViewContent: {
    padding: spacing[4],
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  inputLabel: {
    ...typography.small,
    fontWeight: '600',
    marginBottom: spacing[1],
    color: colors.foreground,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing[3],
    backgroundColor: colors.inputBackground,
    color: colors.foreground,
    ...typography.body,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  // --- URL com Botão ---
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  urlInput: {
    flex: 1,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    width: spacing[12],
    height: spacing[10],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 18,
    color: colors.primaryForeground,
  },
  // --- Campos Lado a Lado ---
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  halfInput: {
    flex: 1,
  },
  // --- Dropdown/Picker ---
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing[3],
    backgroundColor: colors.inputBackground,
  },
  dropdownText: {
    ...typography.body,
    color: colors.foreground,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dropdownModalContent: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownModalItem: {
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownModalText: {
    ...typography.body,
    color: colors.foreground,
  },
  // --- Footer/Botões de Ação ---
  footer: {
    flexDirection: 'row',
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing[3],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background, // Fundo cinza claro
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.foreground,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.primaryForeground,
    fontWeight: '600',
  },
});