let express = require("express");
let cors = require("cors");
let app = express();
//Added in router
app.use(cors());
app.use(express.json());
let port = 8080;

app.listen(port, () => console.log(`Server is running on PORT: ${port}!`));
