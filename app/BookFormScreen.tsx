import React, { useState, useEffect } from 'react'; 
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
    ViewStyle,
} from 'react-native';

import { RouteProp, NavigationProp, ParamListBase } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import Theme from '../theme/index'; 

// --- CONSTANTES DE STORAGE ---
const ASYNC_STORAGE_KEY = '@BookList'; 

// --- DEFINIÇÃO DE TIPOS ---

type BookListStatus = 'Lido' | 'Lendo' | 'Quero Ler'; 
type BookStatus = 'want-to-read' | 'reading' | 'read';

interface StatusOption {
    label: string;
    value: BookStatus;
}

interface BookListItem {
    id: string;
    title: string;
    author: string;
    cover: string; 
    status: BookListStatus; 
    rating?: number; 
    progress?: number; 
    coverImage: string; 
    registrationDate: Date | string; // Permitindo Date ou string (como é salvo no AsyncStorage)
    genre: string; 
    publicationYear: number; 
    synopsis: string; 
    totalPages: number; 
    userReview?: string; 
    pagesRead?: number; 
}

interface BookFormData {
    title: string;
    author: string;
    cover: string; 
    genre: string;
    publicationYear: string; 
    totalPages: string; 
    synopsis: string;
    status: BookStatus;
    pagesRead: string; 
}

// Mapeamento de Status para o tipo final (BooksListScreen)
const statusMap: Record<BookStatus, BookListStatus> = {
    'want-to-read': 'Quero Ler',
    'reading': 'Lendo',
    'read': 'Lido',
};

// Mapeamento inverso para carregar dados de edição (BookListStatus -> BookStatus)
const reverseStatusMap: Record<BookListStatus, BookStatus> = {
    'Quero Ler': 'want-to-read',
    'Lendo': 'reading',
    'Lido': 'read',
};


type RootStackParamList = {
    BookForm: { bookId?: string };
};
type BookFormScreenRouteProp = RouteProp<RootStackParamList, 'BookForm'>;
interface BookFormScreenProps {
    navigation: NavigationProp<ParamListBase>;
    route: BookFormScreenRouteProp;
}

type DropdownOption = string | StatusOption;
interface CustomDropdownProps {
    label: string;
    value: string;
    options: DropdownOption[];
    onSelect: (value: string) => void;
    style?: ViewStyle;
}

// --- Mocks ---
const mockGenders: string[] = ['Fantasia', 'Ficção Científica', 'Romance', 'Thriller', 'Histórico', 'Outro'];

const statusOptions: StatusOption[] = [
    { label: 'Quero Ler', value: 'want-to-read' },
    { label: 'Lendo', value: 'reading' },
    { label: 'Lido', value: 'read' },
];

const initialBookState: BookFormData = {
    title: '',
    author: '',
    cover: '',
    genre: mockGenders[0],
    publicationYear: String(new Date().getFullYear()),
    totalPages: '',
    synopsis: '',
    status: statusOptions[0].value,
    pagesRead: '0',
};
// --- Fim dos Mocks ---

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
            <Text style={stylesLocal.inputLabel}>{label}</Text>
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

// --- Componente Principal CORRIGIDO ---
export default function BookFormScreen({ navigation, route }: BookFormScreenProps) {
    const { bookId } = route.params || {};
    const isEditing = !!bookId;
    const [formData, setFormData] = useState<BookFormData>(initialBookState);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado para preservar a data de registro original na edição
    const [originalRegistrationDate, setOriginalRegistrationDate] = useState<Date | string>(new Date());

    const screenTitle = isEditing ? 'Editar Livro' : 'Adicionar Livro';
    const actionButtonText = isEditing ? 'Salvar Alterações' : 'Adicionar Livro';

    const handleChange = (name: keyof BookFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    // --- LÓGICA DE CARREGAMENTO (EDITAR) ---
    useEffect(() => {
        if (isEditing && bookId) {
            const loadBookForEdit = async () => {
                setIsLoading(true);
                try {
                    const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
                    const bookList: BookListItem[] = storedData ? JSON.parse(storedData) : [];
                    const bookToEdit = bookList.find(b => b.id === bookId);

                    if (bookToEdit) {
                        // Preserva a data original
                        setOriginalRegistrationDate(bookToEdit.registrationDate);

                        // Mapeia o status de volta
                        const statusKey = reverseStatusMap[bookToEdit.status] || 'want-to-read';

                        // Preenche o formulário
                        setFormData({
                            title: bookToEdit.title,
                            author: bookToEdit.author,
                            cover: bookToEdit.coverImage,
                            genre: bookToEdit.genre,
                            publicationYear: String(bookToEdit.publicationYear),
                            totalPages: String(bookToEdit.totalPages),
                            synopsis: bookToEdit.synopsis,
                            status: statusKey,
                            pagesRead: String(bookToEdit.pagesRead || 0),
                        });
                    } else {
                        Alert.alert("Erro de Edição", "Livro não encontrado para edição.");
                        navigation.goBack();
                    }
                } catch (error) {
                    console.error("Erro ao carregar livro:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados para edição.");
                } finally {
                    setIsLoading(false);
                }
            };

            loadBookForEdit();
        }
    }, [bookId, isEditing, navigation]); 


    // --- FUNÇÃO DE SALVAMENTO (ADIÇÃO E EDIÇÃO) ---
    const handleSave = async () => {
        // 1. Validação
        const totalPagesNum = parseInt(formData.totalPages) || 0;
        const pagesReadNum = parseInt(formData.pagesRead) || 0;
        const yearNum = parseInt(formData.publicationYear) || 0;

        if (!formData.title || !formData.author || !formData.genre || !formData.synopsis || totalPagesNum <= 0) {
            Alert.alert('Erro de Validação', 'Por favor, preencha Título, Autor, Gênero, Sinopse e o número total de páginas (com valor maior que zero).');
            return;
        }

        if (pagesReadNum > totalPagesNum) {
            Alert.alert('Erro de Validação', 'Páginas Lidas não pode ser maior que o Total de Páginas.');
            return;
        }

        setIsLoading(true);

        try {
            // 2. Carrega lista existente
            const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let bookList: BookListItem[] = storedData ? JSON.parse(storedData) : [];

            // 3. Monta o Objeto de Livro
            const progressValue = totalPagesNum > 0 ? (pagesReadNum / totalPagesNum) * 100 : 0;
            
            // Define o ID: Usa o bookId se estiver editando, senão gera um novo ID.
            const finalId = isEditing && bookId ? bookId : Date.now().toString();

            // Define a Data: Preserva a data original se for edição, senão usa a data atual.
            const finalRegistrationDate = isEditing && originalRegistrationDate 
                ? originalRegistrationDate 
                : new Date();

            const bookToSave: BookListItem = {
                id: finalId, 
                title: formData.title,
                author: formData.author,
                genre: formData.genre,
                publicationYear: yearNum,
                synopsis: formData.synopsis,
                totalPages: totalPagesNum,
                pagesRead: pagesReadNum,
                status: statusMap[formData.status], 
                progress: progressValue,
                registrationDate: finalRegistrationDate, 
                cover: formData.cover || `https://picsum.photos/400/600?random=${Date.now()}`,
                coverImage: formData.cover || `https://picsum.photos/400/600?random=${Date.now()}`,
            };
            
            // 4. Lógica de Adição ou Edição
            if (isEditing && bookId) {
                const index = bookList.findIndex(b => b.id === bookId);
                if (index !== -1) {
                    // EDITA: Substitui o item antigo pelo novo
                    bookList[index] = bookToSave; 
                    Alert.alert("Sucesso", `Livro "${bookToSave.title}" editado!`);
                } else {
                    Alert.alert("Erro", "Não foi possível encontrar o livro para edição. Adicionando como novo.");
                    bookList.unshift(bookToSave);
                }
            } else {
                // ADIÇÃO: Adiciona no início da lista
                bookList.unshift(bookToSave); 
                Alert.alert("Sucesso", `Livro "${bookToSave.title}" adicionado à biblioteca!`);
            }
            
            // 5. Salva a lista de volta no AsyncStorage
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bookList));

            // 6. Volta para a tela anterior (Isso aciona o useFocusEffect na tela de listagem)
            navigation.goBack(); 

        } catch (error) {
            console.error("Erro ao salvar livro:", error);
            Alert.alert("Erro", "Não foi possível salvar o livro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    // --- FIM DA FUNÇÃO DE SALVAMENTO ---

    return (
        <View style={stylesLocal.fullScreenContainer}>
            {/* Header */}
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
                        label="Gênero *" 
                        value={formData.genre}
                        options={mockGenders}
                        onSelect={(value) => handleChange('genre', value)}
                        style={stylesLocal.halfInput}
                    />

                    {/* Ano de Publicação */}
                    <View style={stylesLocal.halfInput}>
                        <Text style={stylesLocal.inputLabel}>Ano de Publicação</Text>
                        <TextInput
                            style={stylesLocal.textInput}
                            placeholder={String(new Date().getFullYear())}
                            keyboardType="numeric"
                            maxLength={4}
                            value={formData.publicationYear}
                            onChangeText={(text) => handleChange('publicationYear', text)}
                        />
                    </View>
                </View>

                {/* 5. Total de Páginas */}
                <View style={stylesLocal.inputGroup}>
                    <Text style={stylesLocal.inputLabel}>Total de Páginas *</Text>
                    <TextInput
                        style={stylesLocal.textInput}
                        placeholder="Ex: 350"
                        keyboardType="numeric"
                        value={formData.totalPages}
                        onChangeText={(text) => handleChange('totalPages', text)}
                    />
                </View>
                {/* 6. Páginas Lidas */}
                <View style={stylesLocal.inputGroup}>
                    <Text style={stylesLocal.inputLabel}>Páginas Lidas (0 se não começou)</Text>
                    <TextInput
                        style={stylesLocal.textInput}
                        placeholder="Ex: 50"
                        keyboardType="numeric"
                        value={formData.pagesRead}
                        onChangeText={(text) => handleChange('pagesRead', text)}
                    />
                </View>

                {/* 7. Sinopse */}
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

                {/* 8. Status (Custom Dropdown) */}
                <CustomDropdown
                    label="Status *"
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
                <TouchableOpacity onPress={handleSave} style={stylesLocal.saveButton} disabled={isLoading}>
                    <Text style={stylesLocal.saveButtonText}>
                        {isLoading ? 'Salvando...' : actionButtonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// --- ESTILOS (Mantidos) ---
const stylesLocal = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
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
    rowGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
        gap: spacing[3],
    },
    halfInput: {
        flex: 1,
    },
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
        backgroundColor: colors.background,
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