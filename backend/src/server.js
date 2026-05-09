import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  // We remove 'localhost' from the log because the host will provide a real URL
  console.log(`🚀 RetailCore Backend live on port ${PORT}`);
});
