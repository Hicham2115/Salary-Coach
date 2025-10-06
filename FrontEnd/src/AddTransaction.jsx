import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Box,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Logo from "./assets/Blue Geometric Minimalist Finance Logo.png";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditSquareIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { axiosClient } from "./Api/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useParams();

  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("2000");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleLogout = () => {
    axiosClient
      .get("/api/logout")
      .then(() => navigate("/"))
      .catch((error) => console.error("Logout error:", error));
  };

  const handleCreate = () => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;

    console.log(userId);

    const payload = {
      type,
      amount,
      account_id: userId, // <-- correct: use userId from URL
      category,
      date: formattedDate,
      description,
      is_recurring: isRecurring,
    };

    axiosClient.get("/sanctum/csrf-cookie").then(() => {
      axiosClient
        .post("/api/addtransaction", payload)
        .then((response) => {
          console.log("Transaction added:", response.data);
          navigate(`/dashboard2?id=${userId}`);
        })
        .catch((error) => {
          console.error("Error adding transaction:", error.response.data);
        });
    });
  };

  return (
    <>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: 0,
          mt: "-50px",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={Logo} alt="Logo" width="170px" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link to="/dashboard">
                <Button
                  variant="outlined"
                  size="small"
                  color="black"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "0.875rem",
                    padding: "6px 12px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <DashboardIcon sx={{ color: "black", pr: 1, fontSize: 25 }} />
                  Dashboard
                </Button>
              </Link>

              {location.state ? (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "0.875rem",
                    padding: "6px 12px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1, fontSize: "1rem" }} />
                  Log Out
                </Button>
              ) : (
                <Tooltip title="Profile">
                  <IconButton sx={{ p: 0 }}>{/* <UserButton /> */}</IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Add Transaction */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{
            fontSize: { xs: "20px", sm: "30px", md: "50px" },
            lineHeight: 1,
            background: "linear-gradient(to right, #125a9c, #1975d1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Add Transaction
        </Typography>

        <TextField
          select
          label="Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Expense">Expense</MenuItem>
          <MenuItem value="Income">Income</MenuItem>
        </TextField>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {/* <TextField
            select
            label="Account"
            fullWidth
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            <MenuItem value="personal">Personal</MenuItem>
          </TextField> */}
        </Box>

        <TextField
          select
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Rental ">Rental</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
          <MenuItem value="Salary">Salary</MenuItem>
          <MenuItem value="Freelance">Freelance</MenuItem>
          <MenuItem value="Freelance">Dining</MenuItem>
          <MenuItem value="Freelance">Health</MenuItem>
          <MenuItem value="Freelance">Transport</MenuItem>

          {/* Add more categories */}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ mb: 2, width: "100%" }}
          />
        </LocalizationProvider>

        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!isRecurring}
              color="warning"
              onChange={(e) => setIsRecurring(!e.target.checked)}
              onClick={() => {
                console.log(isRecurring);
              }}
            />
          }
          label="Recurring Transaction"
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            color="black"
            variant="outlined"
            onClick={() => {
              navigate(`/dashboard2?id=${userId}`);
            }}
            fullWidth
            sx={{ backgroundColor: "white", color: "black" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "black", color: "white" }}
            onClick={handleCreate}
          >
            Create Transaction
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AddTransaction;
