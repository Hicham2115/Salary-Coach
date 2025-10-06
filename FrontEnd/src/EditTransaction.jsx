import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosClient } from "./Api/axios";

export default function EditTransaction() {
  const { transactionId } = useParams();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("id");

  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
    description: "",
    is_recurring: false,
  });

  useEffect(() => {
    axiosClient.get(`/api/getTransactionById/${transactionId}`).then((res) => {
      setTransaction(res.data.transaction);
    });
  }, [transactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleSubmit = async () => {
    await axiosClient.put(`/api/updateTransaction/${transactionId}`, {
      ...transaction,
    });

    navigate(`/dashboard2?id=${userId}`);
  };

  return (
    <Paper sx={{ p: 4, m: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={4}
        sx={{
          fontSize: { xs: "20px", sm: "30px", md: "50px" },
          lineHeight: 1,
          background: "linear-gradient(to right, #125a9c, #1975d1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Edit Transaction
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Description"
          name="description"
          value={transaction.description}
          onChange={handleChange}
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={transaction.amount}
          onChange={handleChange}
        />
        <TextField
          select
          label="Category"
          name="category"
          value={transaction.category}
          onChange={handleChange}
        >
          {[
            "Rental",
            "Entertainment",
            "Shopping",
            "Salary",
            "Freelance",
            "Dining",
            "Health",
            "Transport",
          ].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Type"
          name="type"
          value={transaction.type}
          onChange={handleChange}
        >
          <MenuItem value="Income">Income</MenuItem>
          <MenuItem value="Expense">Expense</MenuItem>
        </TextField>
        <TextField
          label="Date"
          name="date"
          type="date"
          value={transaction.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}
