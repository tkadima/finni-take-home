import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';

export const generateGridColDef = (
  handleDeleteClick: (id: number) => void,
  handleEditClick: (id: number) => void,
  additionalFields?: string[]
): GridColDef[] => {
  let configuredColumns: GridColDef[] = [];
  if (additionalFields)
    configuredColumns = additionalFields?.map(
      (field) => ({ field, headerName: field, width: 200 }) as GridColDef
    );
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
    },
    { field: 'date_of_birth', headerName: 'Date of Birth', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'addresses',
      headerName: 'Addresses',
      width: 300,
      renderCell: (params) => {
        const addresses: Address[] = JSON.parse(params.value);
        return addresses
          .map(
            (address) =>
              `${address.addressLine1} ${address.city}, ${address.state}`
          )
          .join(', ');
      },
    },
    {
      field: 'phone_numbers',
      headerName: 'Phone Numbers',
      width: 200,
    },
    ...configuredColumns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      renderCell: (params) => {
        const { id } = params;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id as number)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id as number)}
            color="inherit"
          />,
        ];
      },
    },
  ];
};
