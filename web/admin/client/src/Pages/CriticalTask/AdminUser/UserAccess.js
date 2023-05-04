import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex ",
    width: "100%",
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" checked={isSelected} onChange={() => {}} />
      {children}
    </components.Option>
  );
};

export default function UserAccess() {
  const StyledTable = styled(Table)`
    width: 100%;
    margin: 20px auto 0 auto;
  `;

  const THead = styled(TableRow)`
    background: #fff;
    & > th {
      color: #000000;
      font-size: 16px;
      font-weight: bold;
    }
  `;

  const TBody = styled(TableRow)`
    & > td {
      font-size: 15px;
      width: 50%;
    }
  `;

  const [loading, setLoading] = useState(false);

  const [allOptions, setAllOptions] = useState([]);
  const [updateMultiAccessFromEmail, setUpdateMultiAccessFromEmail] = useState(
    []
  );

  const [selectedEmailOptions, setSelectedEmailOptions] = useState([]);
  // console.log("selectedOptions", selectedOptions);
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);

  const getUserAPI = async () => {
    try {
      setLoader(true);
      const res = await axios.get(`/api/v1/getuser`);
      let user_opt = [];
      let user_selected_opt = [];
      console.log("getUserAPI", res.data.WebAdminUser);
      res.data.WebAdminUser.map((e) => {
        user_opt.push({
          label: e.email,
          value: e.email,
        });
      });
      console.log("user_opt", user_opt);

      res.data.WebAdminUser.map((e) => {
        if (e?.user_access[0] === "admin_user") {
          user_selected_opt.push({
            label: e.email,
            value: e.email,
          });
        }
      });
      console.log("user_selected_opt", user_selected_opt);
      setSelectedEmailOptions(user_selected_opt);
      setAllOptions(user_opt);
      setData(res?.data?.WebAdminUser);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

  let inc = 1;
  console.log("selectedEmailOptions", selectedEmailOptions);
  return (
    <div className="App">
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
        <div>
          <StyledTable>
            <TableHead>
              <THead>
                <TableCell>Department Name</TableCell>
                <TableCell>User Access</TableCell>
                <TableCell>Action</TableCell>
              </THead>
            </TableHead>

            <TableBody>
              <TBody key={inc++}>
                <TableCell>{"Admin department"}</TableCell>
                <TableCell>
                  <div style={{ width: "100%" }}>
                    <Select
                      defaultValue={selectedEmailOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={(options) => {
                        setSelectedEmailOptions(options);
                      }}
                      options={allOptions}
                      components={{
                        Option: InputOption,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "#273746",
                      color: "white",
                      borderColor: "white",
                    }}
                    disabled={loading}
                    onClick={async () => {
                      console.log(".....", selectedEmailOptions);
                      let opt = [];
                      selectedEmailOptions.map((e) => {
                        opt.push(e.value);
                      });
                      console.log("opt", opt);
                      setUpdateMultiAccessFromEmail(opt);
                      setLoading(true);
                      const res = await axios.put(`/api/v1/updateAccess`, {
                        emails: opt,
                      });
                      console.log("&&&update", res);
                      setLoading(false);
                      return res;
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </TableCell>
              </TBody>
              <TBody key={inc++}>
                <TableCell>{"Marketing department"}</TableCell>
                <TableCell>
                  <div style={{ width: "100%" }}>
                    <Select
                      defaultValue={selectedEmailOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={(options) => {
                        setSelectedEmailOptions(options);
                      }}
                      options={allOptions}
                      components={{
                        Option: InputOption,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "#273746",
                      color: "white",
                      borderColor: "white",
                    }}
                    disabled={loading}
                    onClick={async () => {
                      console.log(".....", selectedEmailOptions);
                      let opt = [];
                      selectedEmailOptions.map((e) => {
                        opt.push(e.value);
                      });
                      console.log("opt", opt);
                      setUpdateMultiAccessFromEmail(opt);
                      setLoading(true);
                      const res = await axios.put(`/api/v1/updateAccess`, {
                        emails: opt,
                      });
                      console.log("&&&update", res);
                      setLoading(false);
                      return res;
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </TableCell>
              </TBody>
              <TBody key={inc++}>
                <TableCell>{"Stake Holder"}</TableCell>
                <TableCell>
                  <div style={{ width: "100%" }}>
                    <Select
                      defaultValue={selectedEmailOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={(options) => {
                        setSelectedEmailOptions(options);
                      }}
                      options={allOptions}
                      components={{
                        Option: InputOption,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "#273746",
                      color: "white",
                      borderColor: "white",
                    }}
                    disabled={loading}
                    onClick={async () => {
                      console.log(".....", selectedEmailOptions);
                      let opt = [];
                      selectedEmailOptions.map((e) => {
                        opt.push(e.value);
                      });
                      console.log("opt", opt);
                      setUpdateMultiAccessFromEmail(opt);
                      setLoading(true);
                      const res = await axios.put(`/api/v1/updateAccess`, {
                        emails: opt,
                      });
                      console.log("&&&update", res);
                      setLoading(false);
                      return res;
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </TableCell>
              </TBody>
            </TableBody>
          </StyledTable>

          {/* <div
            style={{
              paddingTop: "20px",
              justifyContent: "right",
              display: "flex",
            }}
          >
            {console.log(
              "updateMultiAccessFromEmail",
              updateMultiAccessFromEmail
            )}
            <Button
              variant="contained"
              style={{
                background: "#273746",
                color: "white",
                borderColor: "white",
              }}
              disabled={loading}
              onClick={async () => {
                console.log(".....", selectedEmailOptions);
                let opt = [];
                selectedEmailOptions.map((e) => {
                  opt.push(e.value);
                });
                console.log("opt", opt);
                setUpdateMultiAccessFromEmail(opt);
                setLoading(true);
                const res = await axios.put(`/api/v1/updateAccess`, {
                  emails: opt,
                });
                console.log("&&&update", res);
                setLoading(false);
                return res;
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
}
