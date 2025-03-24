import { Button } from '../../../../../components/ui/button';
import { Card } from '../../../../../components/ui/card';
import { cn } from '../../../../../lib/utils';
import { Category } from '../../../../../types/category';

interface Props {
	category?: Category;
	isSelected?: boolean;
	className?: string;
	children?: React.ReactNode;
	errorIntemSelected?: boolean;
}

const errorStyle = 'border-red-500 focus:border-red-500 border-2';

export const ItemNav = ({ category, isSelected, className, children, errorIntemSelected }: Props) => {
	return (
		<Card className={cn('rounded-full ', category && 'inline-block', className)}>
			<Button
				type="button"
				className={cn(
					'px-2 rounded-full hover:bg-chart-1 hover:text-white w-full',
					isSelected && 'bg-chart-1 text-white',
					category && 'w-auto',
					errorIntemSelected && errorStyle,
				)}
				variant={'ghost'}
			>
				{category?.name}
				{!category && !children && 'Todos'}
				{children}
			</Button>
		</Card>
	);
};
