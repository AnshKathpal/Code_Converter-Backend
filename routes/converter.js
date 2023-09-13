const express = require("express");
const app = express();
const axios = require("axios");
const converter = express.Router();
require("dotenv").config();
const codeModel = require("../model/codeModel");

app.use(express.json());

const MyKey = process.env.MY_API_KEY;



converter.post("/convert", async (req, res) => {
  try {
    const { code, generatedLanguage } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Translate the following code ${code} into ${generatedLanguage} and also give the conversion instructions.`,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MyKey}`,
        },
      }
    );

    const translatedCode = response.data.choices[0].text;

    const generated = new codeModel({
      code,
      generatedLanguage,
      generatedCode: translatedCode,
    });

    await generated.save();

    res.status(200).send(translatedCode);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


converter.post("/output", async (req, res) => {
  try {
    const { code } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Give the output of the ${code} and also explain the code and the concepts used`,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MyKey}`,
        },
      }
    );

    const output = response.data.choices[0].text;

    const generated = new codeModel({
      code,
      generatedCode: output,
    });

    await generated.save();

    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


converter.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Debug the following code effectively  ${code}.
        find out errors and list them, then tell me how I can improve my code , then at last remove all 
        errors from code and give me the bug free code`,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MyKey}`,
        },
      }
    );

    const debugged = response.data.choices[0].text;

    const generated = new codeModel({
      code,
      generatedCode: debugged,
    });

    await generated.save();

    res.status(200).send(debugged);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

converter.post("/quality", async (req, res) => {
  try {
    const { code } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: `Identitify the following code ${code} and it's language , check the quality of the  following code.
        give me an assessment of the code's quality (such as commentary on style, how its organised, potential improvements, etc.) 
        then tell me how I can improve my code , then  remove all 
        errors from code and give me the bug free code in the same language
        at last rate the code quality on a scale of 10 points. Try to provide your response in form of pointers in markdown language`,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MyKey}`,
        },
      }
    );

    const qualityCheck = response.data.choices[0].text;

    const generated = new codeModel({
      code,
      generatedCode: qualityCheck,
    });

    await generated.save();

    res.status(200).send(qualityCheck);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = converter;
