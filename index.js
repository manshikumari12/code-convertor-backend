const express=require("express")
const app=express()
require('dotenv').config()
const cors= require("cors")
app.use(cors())
app.use(express.json())


const {Configuration,OpenAIApi}=require("openai")

const config=new Configuration({
    apiKey:process.env.OPENAI_API_KEY
})
const openAI=new OpenAIApi(config)


// app.post("/convert",async(req,res)=>{
//     try {
// const {code,language}=req.body

// const prompt=`Act as a dynamic compiler, get the following  ${code}
// and convert it  into ${language} and give me the response as follows  
//     {
//         code:{converted code},
//         extra:{extra information}
//      }
// `
// console.log(prompt)

//         const response = await openAI.createCompletion({
//             model:"text-davinci-003",
//             prompt,
//             max_tokens:400,
//             temperature:0,
     
//         })
     
//    console.log(response);
//    let data=response.data.choices[0].text;
//    console.log(data);  res.status(200).send({response:data.trim().split("\n").join("")})  
//     } catch (error) {
//         res.status(404).send({"msg":"fail of connect"})
//        console.log(error); 
//     }
// })

app.post("/convert", async (req, res) => {
	try {
		const { code, language } = req.body;

		const prompt = `Act as a dynamic compiler , detect the lanaguage of the fillowing code.
            
        ${code}

        your task is to convert the code into ${language} and return the converted code.

        as follows 
            {
                code : {converted code},
                extra : {extra information}
            }
        
        `;
		const chatCompletion = await openAI.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
		});


		res.status(200).send(chatCompletion.data.choices[0].message);
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: error.message });
	}
});


app.post("/debug",async (req,res)=>{
    try {
        const { code, language } = req.body;

        const prompt =`Act as a ${language} compiler , following is the code.
            
        ${code}

        your task is to debug it and give the errors and if there is no error then do also tell that 
		
		as follows 
            
			{
                error : [list the errors if any as an array],
				numberError : {number of the error},
                extra : {extra information}
            }
        
        `
    
        ;
        console.log(prompt)
		const chatCompletion = await openAI.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
		});


		res.status(200).send(chatCompletion.data.choices[0].message);
    } catch (error) {
        console.log(error);
		res.status(400).json({ msg: error.message });  
    }
})





app.listen(1111,(req,res)=>{
    console.log("server is running on the port 1111");
})

