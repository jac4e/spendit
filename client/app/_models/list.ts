import { Observable } from "rxjs";
import { IRefill, ITransaction, IAccount, IProduct, ICartItem, UnionKeys, IRefillForm, IProductForm, IPreOrder, ITransactionForm, IStockEntry, IStockEntryForm, IAccountBaseForm, IAccountSettingsForm, IAccountPasswordForm } from "typesit";

export type AllowableListData = IRefill | ITransaction | IAccount | IProduct | ICartItem | IStockEntry;
export type CreatableListForms = ITransactionForm | IAccountBaseForm | IProductForm | IStockEntryForm;
export type EditableListTypes = IAccount | IProduct;
export type EditableListForms = IAccountSettingsForm | IProductForm;

export type SortColumn = UnionKeys<AllowableListData> | '';
export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

export enum ListControlType {
    View = 'view',
    Edit = 'edit',
    CustomButton = 'customButton',
    CustomDropdown = 'customDropdown',
}

export interface listControlBase {
    name: string;
    shouldDisplay: (data: any) => boolean;
}

export interface ListControlView extends listControlBase {
    type: ListControlType.View;
}

export interface ListControlEdit extends listControlBase {
    type: ListControlType.Edit;
    edit: {
        successAlert: string;
        submit: (id: string, content: EditableListForms) => Observable<any>;
        secondarySubmit?: (id: string) => Observable<any>;
    }
}

export interface ListControlCustomButton extends listControlBase {
    type: ListControlType.CustomButton;
    onClick: (data: any) => void;
}

export interface ListControlCustomDropdown extends listControlBase {
    type: ListControlType.CustomDropdown;
    options: { name: string, onClick: (data: any) => void }[];
}

export type ListControl = ListControlView | ListControlEdit | ListControlCustomButton | ListControlCustomDropdown;

