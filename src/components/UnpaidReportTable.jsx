import React from 'react';
import { useTable, useSortBy } from 'react-table';

const UnpaidReportTable = ({ data }) => {
    const columns = React.useMemo(() => [
        {
            Header: 'Nome do Paciente',
            accessor: 'nome_paciente', // accessor is the "key" in the data
        },
        {
            Header: 'Valor Não Pago',
            accessor: 'unpaid_amount',
            // custom cell format here to format the currency
            Cell: ({ value }) => {
                return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data }, useSortBy);

    return (
        <table {...getTableProps()} className="unpaidtable">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={column.isSorted ? column.isSortedDesc ? 'desc' : 'asc' : ''}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
};

export default UnpaidReportTable;
