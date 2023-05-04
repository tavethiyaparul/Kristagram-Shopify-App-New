import { React, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { getAppLocation, updateLocation } from "../../API/api";
import { Stack } from "@mui/system";
import { Avatar, CircularProgress, Switch } from "@mui/material";

const LocationPage = () => {
  const [arr, setArr] = useState();
  const [loader, setLoader] = useState(false);
  // switch value
  const [checked, setChecked] = useState(false);
  const [checkedId, setCheckedId] = useState("");

  useEffect(() => {}, [checked, checkedId]);

  const handleChange = (event, id) => {
    if (checkedId == id) {
      setChecked(event.target.checked);
    }
  };

  // get all user data api call
  const getAllData = async () => {
    setLoader(true);
    const response = await getAppLocation();
    setArr(response.data.country);
    setLoader(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  const columns = [
    {
      align: "left",
      sortable: false,
      field: "Country_Name",
      headerName: "Country Name",
      width: 180,
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              alt="Kristagram"
              src={params.row.Country_Flag}
              style={{ marginRight: "5px" }}
            />
            {params.row.Country_Name ? params.row.Country_Name : "-"}
          </div>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      editable: true,
      field: "Country_Code",
      headerName: "Country Code",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.Country_Code ? params.row.Country_Code : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      editable: true,
      sortable: false,
      field: "Currency",
      headerName: "Currency",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.Currency ? params.row.Currency : "-"}</span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      editable: true,
      sortable: false,
      field: "Currency_Symbol",
      headerName: "Symbol",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.Currency_Symbol ? params.row.Currency_Symbol : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "Phone_code",
      headerName: "Phone Code",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.Phone_code ? params.row.Phone_code : "-"}</span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "Status",
      headerName: "Status",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <Switch
              checked={params.row.id == checkedId ? checked : params.row.Status}
              onChange={async (e) => {
                setCheckedId(params.row.id);
                handleChange(e, params.row.id);
                let data = {
                  id: params.row.id,
                  Status: e.target.checked,
                };
                const response = await updateLocation(data);
              }}
            />
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "iso2",
      headerName: "iso2",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.iso2 ? params.row.iso2 : "-"}</span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "iso3",
      headerName: "iso3",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.iso3 ? params.row.iso3 : "-"}</span>
          </Stack>
        );
      },
    },
  ];

  const rows = [];
  arr?.map((item) => {
    return rows.push({
      id: item?._id,
      Country_Flag: item?.Country_Flag,
      Country_Name: item?.Country_Name,
      Country_Code: item?.Country_Code,
      Currency: item?.Currency,
      Currency_Symbol: item?.Currency_Symbol,
      Phone_code: item?.Phone_code,
      Status: item?.Status,
      iso2: item?.iso2,
      iso3: item?.iso3,
    });
  });

  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) =>
          setTimeout(async () => {
            const response = await updateLocation(user);
            if (user.name?.trim() === "") {
              reject(
                new Error("Error while saving user: name can't be empty.")
              );
            } else {
              resolve({ ...user, name: user.name?.toUpperCase() });
            }
          }, 200)
        ),
      []
    );
  };

  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (newRow) => {
      const response = await mutateRow(newRow);
      return response;
    },
    [mutateRow]
  );

  return (
    <div style={{ padding: "10px" }}>
      {loader ? (
        <div
          style={{
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <Box sx={{ height: 700, width: "100%" }}>
          <DataGrid
            sx={{
              [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: "none !important",
                },
              [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                {
                  outline: "none !important",
                },
            }}
            rowHeight={60}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            experimentalFeatures={{ newEditingApi: true }}
            hideFooterSelectedRowCount={true}
            disableSelectionOnClick={true}
            processRowUpdate={processRowUpdate}
            // disableColumnMenu={true}
          />
        </Box>
      )}
    </div>
  );
};

export default LocationPage;
