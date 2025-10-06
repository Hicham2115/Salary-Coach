import {
  AppBar,
  Box,
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
  Slider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axiosClient } from "../Api/axios";
import Logo from "../assets/Blue Geometric Minimalist Finance Logo.png";
import {
  blue,
  green,
  purple,
  red,
  orange,
  yellow,
  teal,
  pink,
} from "@mui/material/colors";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const colorPalette = [
  blue[600],
  green[600],
  purple[600],
  red[600],
  orange[600],
  yellow[800],
  teal[600],
  pink[400],
  // Add more if needed
];

// Type colors
const typeColors = {
  Recurring: blue[700],
  OneTime: red[700],
};

const categoryColors = {};

const getCategoryColor = (category) => {
  if (!categoryColors[category]) {
    const index = Object.keys(categoryColors).length % colorPalette.length;
    categoryColors[category] = colorPalette[index];
  }
  return categoryColors[category];
};

export default function Dashboard2() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("id");

  const [acctype, setAcctype] = useState("");
  const [balance, setBalance] = useState("");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  const [budget, setbudget] = useState(0);

  const [spent, setspent] = useState(0);
  const percentage = (spent / budget) * 100;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // you can change this as needed

  useEffect(() => {
    if (userId) {
      // First request: Get account data
      axiosClient
        .get(`/api/findaccount?id=${userId}`)
        .then((response) => {
          const accountData = response.data.account;
          setAcctype(accountData.type);
          setBalance(accountData.balance);
          setbudget(Number(accountData.balance));

          // Second request: Get transaction data after account data
          return axiosClient.get(`/api/getTransaction?id=${userId}`);
        })
        .then((response) => {
          const transactions = response.data.transactions;
          console.log(transactions);
          setData(transactions);

          const totalExpenses = transactions
            .filter((item) => item.type === "Expense")
            .reduce((sum, item) => sum + Number(item.amount), 0);

          setspent(totalExpenses);
        })
        .catch(console.error);
    }
  }, [userId]);

  const handleLogout = () => {
    axiosClient
      .get("/api/logout")
      .then(() => navigate("/"))
      .catch((error) => console.error("Logout error:", error));
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value); // Update search text state
    const filtered = rows.filter((row) => {
      const searchQuery = event.target.value.toLowerCase();
      return (
        row.description.toLowerCase().includes(searchQuery) ||
        row.category.toLowerCase().includes(searchQuery)
      );
    });
    setData(filtered); // Update the data state with filtered rows
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    try {
      await axiosClient.delete(`/api/deleteTransaction/${id}`);

      // Remove the deleted transaction from the data state
      setData((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the transaction.");
    }
  };

  const handleEditTransaction = (id) => {
    navigate(`/edit-transaction/${id}?id=${userId}`);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // initialize arrays
  const incomePerMonth = Array(12).fill(0);
  const expensePerMonth = Array(12).fill(0);

  data.forEach((item) => {
    const date = new Date(item.date); // make sure your DB items have a valid `date` field
    const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec

    const amount = parseFloat(item.amount);

    if (item.type === "Income") {
      incomePerMonth[monthIndex] += amount;
    } else if (item.type === "Expense") {
      expensePerMonth[monthIndex] += amount;
    }
  });

  function GoTodash1(){
    navigate("/dashboard", { state: { loginWithEmail: "true" } });
  }
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
              {/* <Link to="/dashboard"> */}
                <Button
                  variant="outlined"
                  onClick={GoTodash1}
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
              {/* </Link> */}
              <Link to={`/addtransaction/${userId}`}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "0.875rem",
                    padding: "6px 12px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  <EditSquareIcon sx={{ pr: 1, fontSize: 25 }} />
                  Add Transaction
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
                  <IconButton sx={{ p: 0 }}>
                    <UserButton />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Divider
        sx={{ border: "none", height: "1px", bgcolor: "#E0E0E0", mt: "-30px" }}
      />

      {/* Budget Tracker */}
      <Box
        sx={{
          border: "1px solid #cccaca",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "7px",
          padding: "15px",
          mx: "50px",
          my: "50px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          Monthly Budget (Default Account)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>
            ${spent.toFixed(2)} of ${budget.toFixed(2)} spent
          </Typography>
        </Box>
        <Slider
          value={percentage}
          color="primary"
          aria-label="Budget progress"
          valueLabelDisplay="auto"
        />
        <Typography
          sx={{ color: "text.secondary", display: "flex", justifySelf: "end" }}
        >
          {percentage.toFixed(1)}% used
        </Typography>
      </Box>

      {/* Dashboard Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "20px", sm: "30px", md: "50px" },
              background: "linear-gradient(to right, #125a9c, #1975d1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            Personal
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", mt: 0.5, ml: 0.5 }}
          >
            {acctype} Account
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              fontSize: "30px",
              mb: 0.5,
            }}
          >
            ${balance}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Transactions
          </Typography>
        </Box>
      </Box>

      {/* Bar Chart */}
      <BarChart
        height={300}
        series={[
          {
            id: "Income",
            label: "Income",
            data: incomePerMonth,
            color: "#4CAF50",
          },
          {
            id: "Expenses",
            label: "Expenses",
            data: expensePerMonth,
            color: "#F44336",
          },
        ]}
        xAxis={[{ data: months, scaleType: "band", label: "Months" }]}
        yAxis={[{ min: 0, max: 10000, label: "Amount ($)" }]} // adapt max to your values
        legend={{ position: "bottom", orientation: "horizontal" }}
        margin={{ left: 70 }}
      />

      {/* Search Bar */}
      <Box sx={{ px: 4, mt: 4 }}>
        <TextField
          fullWidth
          placeholder="Search transactions..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              backgroundColor: "#f5f5f5",
            },
          }}
          sx={{
            mb: 2,
            "& fieldset": { border: "none" },
          }}
        />
      </Box>

      {/* Transaction Table */}
      <TableContainer
        component={Paper}
        sx={{
          px: "30px",
          py: "20px",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f5f5",
                "& th": {
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottom: "2px solid #e0e0e0",
                  py: 2,
                },
              }}
            >
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="center">Recuring</TableCell>
              <TableCell align="center">Delete</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#fafafa" },
                    "&:last-child td": { borderBottom: "none" },
                  }}
                >
                  <TableCell>{row.date}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {row.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      sx={{
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: getCategoryColor(row.category),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      letterSpacing: "0.5px",
                      color:
                        row.type.toLowerCase() === "income"
                          ? green[500]
                          : red[500], // Ensuring lower case
                      textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                      minWidth: "120px",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color:
                          row.type.toLowerCase() === "income"
                            ? green[700]
                            : red[700], // Darker on hover
                      },
                    }}
                  >
                    {row.type.toLowerCase() === "income" ? "+" : "-"}$
                    {(parseFloat(row.amount) || 0).toFixed(2)}{" "}
                    {/* Safely convert amount */}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.type}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        backgroundColor:
                          row.type === "Recurring" ? blue[50] : "grey.100",
                        border: `2px solid ${
                          row.type === "Recurring" ? blue[500] : "black"
                        }`,
                        color: row.type === "Recurring" ? blue[700] : "black",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor:
                            row.type === "Recurring" ? blue[100] : "grey.200",
                          borderColor:
                            row.type === "Recurring" ? blue[700] : "black",
                          color: row.type === "Recurring" ? blue[900] : "black",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.is_recurring === false ? "False" : "True"}
                      size="small"
                      sx={{
                        backgroundColor:
                          row.is_recurring === false
                            ? "error.main"
                            : "success.main",
                        color: "white",
                        ml: "70px",
                        p: 1,
                        borderRadius: "7px",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteTransaction(row.id)} // Deleting the transaction
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditTransaction(row.id)}>
                      <EditIcon sx={{ color: "green" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transactions available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}

      <Stack spacing={2} alignItems="center" margin="30px">
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary" // or any color you want
        />
      </Stack>
    </>
  );
}
