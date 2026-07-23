const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// IDHI KOTTA GA ADD CHEY
app.get("/", (req,res)=> {
  res.json({success: true, msg: "APSCHE API Running"});
});

// MIGATA ROUTES KADA UNDI GA
app.post("/register", async (req,res)=>{ ... });
app.post("/login", async (req,res)=>{ ... });
app.get("/colleges", (req,res)=>{ ... });

const PORT = process.env.PORT || 10000;
app.listen(PORT);
