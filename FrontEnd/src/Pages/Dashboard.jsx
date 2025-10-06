import * as React from "react";
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
  Slider,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Zoom,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  CircularProgress,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RecurringIcon from "@mui/icons-material/Autorenew";
import { UserButton } from "@clerk/clerk-react";
import Logo from "../assets/Blue Geometric Minimalist Finance Logo.png";
import { PieChart } from "@mui/x-charts/PieChart";
import { desktopOS, valueFormatter } from "../webUsageStats";
import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import { useForm } from "@mantine/form";
import { NumberInput, TextInput } from "@mantine/core";
import Switch from "@mui/material/Switch";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import { axiosClient } from "../Api/axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Dashboard() {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [accounts, setAccounts] = React.useState([]);
  const [isOn, setIsOn] = React.useState(false);
  const [spent, setSpent] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [expensesLoading, setExpensesLoading] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState([]);
  const [chatLoading, setChatLoading] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const provider = params.get("provider");

  const budget = 9000.0;
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(spent.toString());
  const [account, setAccount] = React.useState("personal");

  const percentage = (spent / budget) * 100;

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
      balance: 0,
      switch: isOn,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      type: (value) => (value === "" ? "Please select an account type" : null),
      balance: (value) => (value < 0 ? "Balance must be 0 or more" : null),
    },
  });

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 3 }}>
          Create New Account
        </Typography>
        <form
          style={{ marginLeft: "20px", width: "400%" }}
          onSubmit={form.onSubmit((values) => {
            const newAccount = {
              name: values.name,
              type: values.type,
              balance: values.balance,
              switch: values.switch,
            };

            setAccounts((prev) => [...prev, newAccount]);
            form.reset();
            toggleDrawer("left", false)({});

            axiosClient
              .get("/sanctum/csrf-cookie")
              .then(() => {
                const payload = {
                  name: newAccount.name,
                  type: newAccount.type,
                  balance: String(newAccount.balance),
                };
                return axiosClient.post("/api/createacc", payload);
              })
              .then((response) => {
                console.log("Created account:", response.data);
              })
              .catch((error) => {
                console.error("There was an error!", error);
              });
          })}
        >
          <TextInput
            label="Account Name"
            placeholder="eg.Hicham Kamani"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Account Type"
            placeholder="e.g. Current"
            component="select"
            key={form.key("type")}
            {...form.getInputProps("type")}
            mt="sm"
          >
            <option value="">Select type</option>
            <option value="Current">Current</option>
            <option value="Savings">Savings</option>
          </TextInput>

          <NumberInput
            mt="sm"
            label="Initial Balance"
            key={form.key("balance")}
            {...form.getInputProps("balance")}
          />

          <Box display="flex">
            <Button
              type="button"
              onClick={toggleDrawer("left", false)}
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "transparent",
                color: "black",
                marginRight: "20px",
                width: "50%",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              mt="sm"
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "black",
                color: "white",
                width: "50%",
              }}
            >
              Create Account
            </Button>
          </Box>
        </form>
      </List>
    </Box>
  );

  function handellogout() {
    axiosClient
      .get("/api/logout")
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  function HandleEachAcc(accountId) {
    axiosClient
      .get(`/api/findaccount?id=${accountId}`)
      .then((response) => {
        if (response.data.message === "Account Found") {
          navigate(`/dashboard2?id=${accountId}`, {
            state: { loginWithEmail: "true" },
          });
        }
      })
      .catch(console.error);
  }

  const handleSwitchChange = (acc, index) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].switch = !updatedAccounts[index].switch;
    setAccounts(updatedAccounts);
  };

  const handleChatOpen = () => setChatOpen(true);
  const handleChatClose = () => setChatOpen(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    setChatLoading(true);
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: chatInput,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated";

      const aiMessage = {
        sender: "ai",
        text: text,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    }

    setChatInput("");
    setChatLoading(false);
  };
  React.useEffect(() => {
    axiosClient
      .get("/api/FetchAccounts")
      .then((response) => {
        const data = response.data;
        console.log(response.data.data);
        const maybeArray = Array.isArray(data) ? data : Object.values(data);
        const accountsArray =
          maybeArray.length === 1 && Array.isArray(maybeArray[0])
            ? maybeArray[0]
            : maybeArray;
        setAccounts(accountsArray);
      })
      .catch(console.error);

    axiosClient
      .get("http://localhost:8000/api/expense-breakdown")
      .then((res) => {
        const formattedData = res.data
          .filter((item) => item.category.toLowerCase() !== "salary") // Exclude salary
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
          .map((item, index) => ({
            id: index,
            value: item.total,
            label: item.category,
          }));
        setExpenses(formattedData);
        setExpensesLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expense data:", err);
        setExpensesLoading(false);
      });

    axiosClient
      .get("/api/getAll")
      .then((response) => {
        console.log(response.data);
        const latestTransactions = response.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setTransactions(latestTransactions);
      })
      .catch(console.error);
  }, []);

  return (
    <>
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
              <img src={Logo} alt="Logo" width={"170px"} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                color="black"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  padding: "6px 12px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <DashboardIcon
                  sx={{ color: "black", pr: 1, fontSize: "25px" }}
                />
                Dashboard
              </Button>

              {location.state || provider == "facebook" ? (
                <Button
                  variant="contained"
                  onClick={handellogout}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    padding: "6px 12px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  <LogoutIcon
                    sx={{
                      color: "white",
                      mr: 1,
                      fontSize: "1rem",
                    }}
                  />
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    Log Out
                  </Typography>
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
        sx={{
          border: "none",
          height: "1px",
          bgcolor: "#E0E0E0",
          marginTop: "-30px",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginLeft: "50px",
          fontSize: { xs: "20px", sm: "30px", md: "50px" },
          my: 2,
          background: "linear-gradient(to right, #125a9c, #1975d1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Your Analytics
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Card
          sx={{
            borderRadius: "10px",
            boxShadow: 2,
            mt: "30px",
            ml: "50px",
            width: { xs: "100%", sm: "65%", md: "50%" },
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                fontSize="larger"
              >
                Recent Transactions
              </Typography>
            </Box>
            <List>
              {transactions.map((tx, index) => {
                const isIncome = tx.type === "Income"; // ← use actual type
                const isRecurring =
                  tx.title && tx.title.toLowerCase().includes("recurring");
                const amount = parseFloat(tx.amount); // ← ensure it's a number

                return (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      {isIncome ? (
                        <ArrowUpwardIcon
                          sx={{ color: "green", fontSize: 18 }}
                        />
                      ) : (
                        <ArrowDownwardIcon
                          sx={{ color: "red", fontSize: 18 }}
                        />
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography fontSize="16px" fontWeight="bold">
                          {tx.title}
                          {isRecurring && (
                            <RecurringIcon
                              fontSize="inherit"
                              sx={{ ml: 0.5, verticalAlign: "middle" }}
                            />
                          )}
                        </Typography>
                      }
                      secondary={
                        <>
                          {tx.description && (
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="black"
                            >
                              {tx.description}
                            </Typography>
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: isIncome ? "green" : "red",
                              fontStyle: "italic",
                              mb: 0.5,
                            }}
                          >
                            Type: {tx.type}
                            {isRecurring && " • Recurring"}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize={"small"}
                            sx={{ color: "#888", fontStyle: "italic" }}
                          >
                            {tx.date}
                          </Typography>
                        </>
                      }
                    />

                    <Typography
                      fontWeight="bold"
                      fontSize="15px"
                      color={isIncome ? "green" : "red"}
                    >
                      {isIncome ? "+" : "-"}${Math.abs(amount).toFixed(2)}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>

        <Box
          sx={{
            borderRadius: "10px",
            boxShadow: 2,
            mt: "30px",
            ml: "50px",
            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
            mx: "auto",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            paddingTop="30px"
            paddingLeft="30px"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Monthly Expense Breakdown
          </Typography>

          {expensesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <PieChart
              sx={{ paddingTop: 10, mx: "auto" }}
              series={[
                {
                  data: expenses,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={200}
              width={200}
            />
          )}

          <Typography
            variant="body2"
            sx={{
              maxWidth: 400,
              textAlign: "center",
              mx: "auto",
              mt: 5,
              color: "text.secondary",
              fontStyle: "italic",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            This chart provides a visual representation of how your monthly
            salary has been allocated, offering a clear snapshot of overall
            spending patterns and financial distribution throughout the month.
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: "10px",
            boxShadow: 2,
            mt: "30px",
            mb: "30px",
            ml: "50px",
            width: "350px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            p: 5,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <Button
            disableRipple
            disableElevation
            sx={{
              all: "unset",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              p: 2,
              borderRadius: 2,
            }}
            onClick={toggleDrawer("left", true)}
          >
            <AddIcon sx={{ fontSize: "60px", color: "grey", mb: 1 }} />
            <Typography
              align="center"
              sx={{ fontWeight: "bold", color: "grey" }}
            >
              Add New Account
            </Typography>
          </Button>

          <Drawer
            anchor="bottom"
            open={state.left}
            onClose={toggleDrawer("left", false)}
          >
            {list("left")}
          </Drawer>
        </Box>

        <Box
          sx={{
            mx: "50px",
            mt: 4,
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {accounts.map((acc, idx) => (
            <Card
              key={idx}
              sx={{
                mb: 2,
                p: 2,
                width: 350,
                height: 200,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.03)",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {acc.name}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => HandleEachAcc(acc.id)}
                  sx={{
                    mt: -6,
                    marginLeft: "200px",
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "#ed6c02",
                    },
                  }}
                >
                  Enter Account
                </Button>
              </Box>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ textAlign: "center" }}
              >
                ${acc.balance}
              </Typography>

              <Box>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 15,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {acc.type} Account
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ArrowOutwardIcon sx={{ color: "green", mr: 1 }} />
                    <Typography fontWeight="bold" fontSize="small">
                      Income
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SouthEastIcon sx={{ color: "red", mr: 1 }} />
                    <Typography fontWeight="bold" fontSize="small">
                      Expenses
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
      <Zoom in={!chatOpen}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleChatOpen}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>
      <Dialog
        open={chatOpen}
        onClose={handleChatClose}
        fullWidth
        maxWidth="xl" // Changed to extra large
        PaperProps={{
          sx: {
            position: "fixed",
            top: 65,
            left: 0,
            right: 0,
            bottom: 0,
            m: 0,
            height: "100vh",
            width: "100vw",
            maxWidth: "100%",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "primary.main",
            color: "white",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            p: 2,
          }}
        >
          <Avatar sx={{ mr: 2, bgcolor: "white", color: "primary.main" }}>
            <ChatIcon />
          </Avatar>
          <Typography variant="h6">AI Financial Assistant</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleChatClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 0,
            height: "calc(100% - 64px)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      msg.sender === "user" ? "primary.main" : "grey.100",
                    color: msg.sender === "user" ? "white" : "text.primary",
                    maxWidth: "80%",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your finances..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={chatLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                sx={{
                  minWidth: 100,
                  height: 56,
                  borderRadius: 4,
                }}
              >
                {chatLoading ? <CircularProgress size={24} /> : "Send"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Dashboard;
