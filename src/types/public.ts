/*
 * Public API types. Those are re-exported for public use.
 */

import { ReactElement } from "react";
import { TableTypesRegistry } from "../TableTypesRegistry";
import { TablePluginList } from "./plugins";
import { GridState } from "./state";


/**
 * Propriétés d'affichage de la table.
 * <T> est le type d'un item
 */
export interface TableProps<T> {
  /**
   * Nom de classe CSS à appliquer à toute la table
   */
  className?: string,
  /**
   * Définition des colonnes
   */
  dataProperties: TableColumnDefinition<T>[],
  /**
   * Données a afficher, une liste d'items
   */
  data: T[],
  /**
   * Plugins à activer avec leur configuration
   */
  plugins?: TablePluginList<T>
  /**
   * Nom de la propriété qui sert d'identifiant
   */
  identifierProperty?: string,
  /**
   * Message à afficher si vide
   */
  emptyMessage?: string,
  /**
   * Indique si c'est éditable globalement ou pas
   */
  editable: boolean,
  /**
   * Permet de savoir si une ligne en particulier peut être éditée.
   * (au sens où on va afficher les widgets d'édition ou pas)
   * Si non spécifié, par défaut la ligne est éditable si le tableau est editable
   * @param item l'élément en cours d'affichage
   */
  editableItem?: (item: T) => boolean,

  /**
   * Liste des actions possibles sur un item
   */
  actionItemList?: TableActionList,


  /**
   * Quand une action est lancée globalement
   */
  onActionGeneric?: ActionGenericHandler,

  /**
   * Registry de types, si non fourni on utilise celle par défaut
   */
  types?: TableTypesRegistry,

  onEdit: (item: T) => Promise<void>,
  onDelete: (item: T) => Promise<void>
}

export type TableCellEditorValueChangeHandler<T> = (previousValue: T) => T
export type TableCellEditorFactory<T> = (data: T, onValueChange: TableCellEditorValueChangeHandler<T>) => ReactElement | null | undefined

export interface TableColumnDefinition<T> {
  name: string,
  label?: string,
  type?: string,
  render?: (value: any) => string,
  editable?: (rowData: T) => boolean,
  editor?: TableCellEditorFactory<T>
}

export type TableActionList = TableAction[]
export type ActionItemHandler<T> = (action: TableAction, rowData: T, evt: any) => void
export type ActionGenericHandler = (action: TableAction, evt: any) => void
export interface TableAction {
  name: string,
  displayed?: (state: GridState, item: any) => boolean,
  render: (state: GridState, dispatch: TableActionDispatch) => ReactElement
}
export type TableActionDispatch = {
  listeners: { [key: string]: TableActionHandler }
}
export type TableActionHandler = (on: any) => void