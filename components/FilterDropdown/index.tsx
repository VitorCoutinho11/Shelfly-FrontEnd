import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

// Importação dos tipos e valores do tema (assumindo que '..' é o caminho para o tema)
import Theme, { Colors, Spacing, BorderRadius, Shadows} from '@/theme';

const { colors, spacing, borderRadius, shadows } = Theme as {
	colors: Colors;
	spacing: Spacing;
	borderRadius: BorderRadius;
	shadows: Shadows;
};

// --- DEFINIÇÕES DE TIPOS ---
export type FilterOption = 'Data de Cadastro' | 'Título' | 'Autor' | 'Avaliação';

interface FilterDropdownProps {
	isVisible: boolean;
	onClose: () => void;
	onSelect: (option: FilterOption) => void;
	selectedOption: FilterOption;
	// 💡 Prop de Posicionamento ajustada
	topPosition: number;
	// 💡 Nova prop para alinhamento (vamos usar leftPosition na tela principal)
	leftPosition: number; 
	rightPosition?: number; // Agora opcional
}

const options: FilterOption[] = ['Data de Cadastro', 'Título', 'Autor', 'Avaliação'];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
	isVisible,
	onClose,
	onSelect,
	selectedOption,
	topPosition,
	leftPosition,
	rightPosition,
}) => {
	if (!isVisible) {
		return null;
	}

	return (
		// OVERLAY TRANSPARENTE
		<TouchableOpacity 
			style={stylesDropdown.overlay} 
			onPress={onClose} 
			activeOpacity={1}
		>
			{/* CONTAINER DO DROPDOWN */}
			<View 
				style={[
					stylesDropdown.dropdownContainer, 
					// 💡 APLICANDO POSIÇÃO: leftPosition ou rightPosition
					{ top: topPosition, left: leftPosition, right: rightPosition } 
				]}
				// Impede que o clique no dropdown feche ele
				onTouchStart={(e) => e.stopPropagation()} 
			>
				{options.map((option) => {
					const isSelected = option === selectedOption;
					return (
						<TouchableOpacity
							key={option}
							style={[
								stylesDropdown.optionButton,
								isSelected && { backgroundColor: colors.primary }
							]}
							onPress={() => onSelect(option)}
						>
							<Text 
								style={[
									stylesDropdown.optionText,
									isSelected 
										? { color: colors.primaryForeground, fontWeight: '600' } 
										: { color: colors.foreground }
								]}
							>
								{option}
							</Text>
							{isSelected && (
								<Text style={stylesDropdown.checkIcon}>✓</Text>
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		</TouchableOpacity>
	);
};

const stylesDropdown = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.1)', 
		zIndex: 9999, 
	},
	dropdownContainer: {
		backgroundColor: colors.card,
		borderRadius: borderRadius.lg,
		width: 200, 
		borderWidth: 1,
		borderColor: colors.border,
		...shadows.lg as ViewStyle,
		zIndex: 10000, 
	},
	optionButton: {
		padding:20,
		paddingHorizontal: spacing[4],
		paddingVertical: spacing[3],
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	optionText: {
		fontSize: 16,
	},
	checkIcon: {
		fontSize: 18,
		color: colors.primaryForeground,
		fontWeight: 'bold',
	}
});