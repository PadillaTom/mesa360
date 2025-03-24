import { FormItem, FormLabel } from "../../../../../../components/ui/form";
import { ItemNav } from "../../filter/ItemNav";

interface Props {
	buttonsCarousel?: ((jump?: boolean) => void) | undefined;
	categorySelected?: string;
}
export const InputCategories = ({ buttonsCarousel, categorySelected}: Props) => {
	return (
		<FormItem className="w-4/5 mt-3">
			<FormLabel>
				<div onClick={() => buttonsCarousel?.()}>
					<ItemNav isSelected={!!categorySelected}>
						Seleccionar Categoria
					</ItemNav>
				</div>
			</FormLabel>
		</FormItem>
	);
};
