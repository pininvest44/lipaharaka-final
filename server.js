require('dotenv').config();
const express=require('express');
const axios=require('axios');
const app=express();

app.use(express.json());
app.use(express.static('public'));

const delay=ms=>new Promise(r=>setTimeout(r,ms));

app.post('/api/bulk-stk', async (req,res)=>{
 const {numbers,amount,reference}=req.body;
 const results=[];

 for(const phone of numbers){
   try{
     const params=new URLSearchParams();
     params.append('api_key',process.env.API_KEY);
     params.append('phone',phone.trim());
     params.append('amount',amount);
     params.append('channel_id',process.env.CHANNEL_ID || '16');

     const response=await axios.post(
      'https://lipaharakaapis.co.ke/api.php?action=api_stk',
      params,
      {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
     );

     results.push({phone,reference,status:'SUCCESS',response:response.data,time:new Date().toISOString()});
   }catch(err){
     results.push({phone,reference,status:'FAILED',error:err.response?.data||err.message,time:new Date().toISOString()});
   }
   await delay(3000);
 }
 res.json(results);
});

app.listen(process.env.PORT || 3000, ()=>console.log('Running'));
