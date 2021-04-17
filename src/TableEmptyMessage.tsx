import React from "react";

export const TableEmptyMessage: React.FC<{ size: number, columnsSize: number, emptyMessage: string }> = (
    {
        size,
        columnsSize,
        emptyMessage
    }) => (<>{ size == 0 &&
<tfoot>
<tr>
    <td colSpan={ columnsSize }>{ emptyMessage }</td>
</tr>
</tfoot> }</>);
