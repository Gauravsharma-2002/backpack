// try to under stand what is this <regarding high order functrion :
// a function that recives a function or returns a function is a high order function
// now see below carefully
// const acynchandler=()=>{}
// const asyncHandler =(function)=>{()=>{}} or astncHandler = (function) => ()=>{} calling inside a function
// if u want a async function then
// asyncHandler = (function )=> async()=>{}


// promise base async handler 
const asyncHandler = (reqHandler)=>{
    // heigher order function return karega
    return (req,res,next)=>{
      Promise.resolve(reqHandler(req,res,next)).catch((error)=>{ //fixed a bug by  myself by removing error from input 
        return next(error)
      })
    }

}









// const asyncHandler = (fun) => async (err, req, res, next) => {
//   try {
//         await fun(err,req,res,next);

//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };
