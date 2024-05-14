import React,{ createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const[recentPrompt,setRecentPrompt] = useState("");
    const[prevPrompt,setPrevPrompt] = useState([]);
    const[showResult,setShowResult] = useState(false);
    const[loading,setLoading] = useState(false);
    const[resultData,setResultData] = useState("");
    
    const delayPara = (index,nextWord) => {
        setTimeout(function(){
            setResultData(prev => prev + nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }
    
    const onSent = async (prompt) =>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined){
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }else{
            setPrevPrompt(prev => [...prev,input])
            setRecentPrompt(input);
            response = await runChat(input);
        }
        // setRecentPrompt(input);
        // setPrevPrompt(prev => [...prev,input])
        // const response = await runChat(input);
        let responceArray = response.split("**");
        let newResponce;
        for(let i=0;i < responceArray.length;i++){
            if(i === 0 || i%2 === 0){
                newResponce += responceArray[i];
            }else{
                newResponce += '<b>' + responceArray[i] + '</b>';
            }
        }
        let filterResponce = newResponce.split("*").join("</br>")
        let newResponceArray = filterResponce.split(" ");
        for(let i=0;i<newResponceArray.length;i++){
            const nextWord = newResponceArray[i];
            delayPara(i,nextWord+" ");
        }
        // setResultData(filterResponce);
        setLoading(false);
        setInput("");
    }
    
    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider