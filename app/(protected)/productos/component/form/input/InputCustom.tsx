import { useEffect, useState } from "react";
import { useCategories } from "../../../../../../actions/hooks/categories/useCategories";
import { Input } from "../../../../../../components/ui/input";
import { campos } from "../../../types/schema";
import { ControllerRenderProps } from "react-hook-form";

interface Props {
	campo: campos;
	field: ControllerRenderProps;
	categoriSelected?: string;
}
const inputHidden = () => <input className="hidden" />;
const inputBlock = (field: ControllerRenderProps, campo: campos) => (
	<Input className="!my-0 p-0 h-8" {...field} type={campo.type} required={false} />
);
/*  */
export const InputCustom = ({ field, campo, categoriSelected }: Props) => {
	const input = {
		id: inputHidden(),
		categoryId: inputHidden(),
		target: inputHidden(),
		description: inputBlock(field, campo),
		name: inputBlock(field, campo),
		price: inputBlock(field, campo),
	}[campo.name];
	return input;
};